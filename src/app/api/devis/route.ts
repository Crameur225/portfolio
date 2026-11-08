import { NextResponse } from 'next/server'
import { appendFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import {
  DEMANDE_VIDE,
  DELAIS,
  MODULES,
  NATURES,
  PLATEFORMES,
  SOINS,
  estimer,
  formatEuro,
  formatFcfa,
  libelles,
  plage,
  referenceDevis,
  type Demande,
} from '@/lib/estimation'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/* --------------------------------------------------------- GARDE-FOUS D'ENTRÉE */

const MAX = { court: 160, long: 4000 }

const texte = (v: unknown, max: number) =>
  typeof v === 'string' ? v.trim().slice(0, max) : ''

const idsConnus = (v: unknown, liste: { id: string }[]) => {
  if (!Array.isArray(v)) return []
  const permis = new Set(liste.map((o) => o.id))
  // On dédoublonne et on jette tout ce qui n'est pas au catalogue.
  return [...new Set(v.filter((x): x is string => typeof x === 'string' && permis.has(x)))]
}

const idConnu = (v: unknown, liste: { id: string }[], defaut: string) =>
  typeof v === 'string' && liste.some((o) => o.id === v) ? v : defaut

const emailValide = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)

/* ---------------------------------------------- LIMITATION DE DÉBIT EN MÉMOIRE */

/**
 * Suffisant pour un site mono-instance. Sur plusieurs instances, remplacer par
 * Redis ou un compteur en base — ce garde-fou ne survit pas à un redémarrage.
 */
const vus = new Map<string, number[]>()
const FENETRE = 10 * 60 * 1000
const PLAFOND = 5

function tropDeDemandes(ip: string): boolean {
  const t = Date.now()
  const recents = (vus.get(ip) ?? []).filter((x) => t - x < FENETRE)
  if (recents.length >= PLAFOND) {
    vus.set(ip, recents)
    return true
  }
  recents.push(t)
  vus.set(ip, recents)
  if (vus.size > 2000) vus.clear() // garde-fou mémoire
  return false
}

/* ----------------------------------------------------------------------- ROUTE */

export async function POST(req: Request) {
  let brut: unknown
  try {
    brut = await req.json()
  } catch {
    return NextResponse.json({ erreur: 'Corps de requête illisible' }, { status: 400 })
  }

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    'inconnue'

  if (tropDeDemandes(ip)) {
    return NextResponse.json(
      { erreur: 'Trop de demandes. Réessayez dans quelques minutes.' },
      { status: 429 },
    )
  }

  const corps = (brut ?? {}) as Record<string, unknown>
  const dIn = (corps.demande ?? {}) as Record<string, unknown>
  const cIn = (corps.coordonnees ?? {}) as Record<string, unknown>

  // On ne retient que des valeurs du catalogue : aucun montant, aucun libellé
  // envoyé par le navigateur n'entre dans le calcul.
  const demande: Demande = {
    nature: idConnu(dIn.nature, NATURES, ''),
    modules: idsConnus(dIn.modules, MODULES),
    plateformes: idsConnus(dIn.plateformes, PLATEFORMES),
    delai: idConnu(dIn.delai, DELAIS, DEMANDE_VIDE.delai),
    soin: idConnu(dIn.soin, SOINS, DEMANDE_VIDE.soin),
  }

  const coordonnees = {
    societe: texte(cIn.societe, MAX.court),
    nom: texte(cIn.nom, MAX.court),
    email: texte(cIn.email, MAX.court),
    telephone: texte(cIn.telephone, MAX.court),
    message: texte(cIn.message, MAX.long),
  }

  if (!demande.nature) {
    return NextResponse.json({ erreur: 'Nature du projet manquante' }, { status: 400 })
  }
  if (!coordonnees.nom || !emailValide(coordonnees.email)) {
    return NextResponse.json({ erreur: 'Nom ou adresse e-mail invalide' }, { status: 400 })
  }

  const estimation = estimer(demande)
  const l = libelles(demande)
  const reference = referenceDevis()
  const horodatage = new Date().toISOString()

  const resume = [
    `Référence     : ${reference}`,
    `Reçu le       : ${horodatage}`,
    '',
    `Société       : ${coordonnees.societe || '—'}`,
    `Contact       : ${coordonnees.nom}`,
    `E-mail        : ${coordonnees.email}`,
    `Téléphone     : ${coordonnees.telephone || '—'}`,
    '',
    `Nature        : ${l.nature}`,
    `Modules       : ${l.modules.join(', ') || '—'}`,
    `Cibles        : ${l.plateformes.join(', ') || '—'}`,
    `Délai         : ${l.delai}`,
    `Finition      : ${l.soin}`,
    '',
    `Charge        : ${plage(estimation.joursMin, estimation.joursMax)} jours ouvrés`,
    `Planning      : ${plage(estimation.semainesMin, estimation.semainesMax)} semaines`,
    `Budget        : ${formatFcfa(estimation.fcfaMin)} – ${formatFcfa(estimation.fcfaMax)}`,
    `  soit        : ${formatEuro(estimation.euroMin)} – ${formatEuro(estimation.euroMax)}`,
    '',
    'Ventilation :',
    ...estimation.detail.map((x) => `  - ${x.poste} : ${x.jours} j`),
    '',
    'Contexte :',
    coordonnees.message || '  (non renseigné)',
  ].join('\n')

  /* ------------------------------------------------------------ ACHEMINEMENT */

  const destinataire = process.env.DEVIS_DESTINATAIRE ?? 'gaelagbe@gmail.com'
  const expediteur = process.env.DEVIS_EXPEDITEUR // ex. "Devis <devis@votredomaine.com>"
  const cle = process.env.RESEND_API_KEY

  let achemine = false

  if (cle && expediteur) {
    try {
      const { Resend } = await import('resend')
      const resend = new Resend(cle)
      await resend.emails.send({
        from: expediteur,
        to: destinataire,
        replyTo: coordonnees.email,
        subject: `[${reference}] ${l.nature} — ${coordonnees.societe || coordonnees.nom}`,
        text: resume,
      })
      achemine = true
    } catch (err) {
      // L'envoi a échoué : on ne perd pas la demande pour autant, elle part au journal.
      console.error('[devis] envoi e-mail impossible', err)
    }
  }

  if (!achemine) {
    try {
      const dossier = join(process.cwd(), 'demandes')
      await mkdir(dossier, { recursive: true })
      await appendFile(
        join(dossier, 'devis.log'),
        `\n${'='.repeat(72)}\n${resume}\n`,
        'utf8',
      )
    } catch (err) {
      console.error('[devis] journal inaccessible', err)
      console.info(`[devis] demande ${reference}\n${resume}`)
    }
  }

  return NextResponse.json({ reference, achemine })
}
