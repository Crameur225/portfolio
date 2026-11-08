'use client'

import { useMemo, useState } from 'react'
import {
  DELAIS,
  DEMANDE_VIDE,
  MODULES,
  NATURES,
  PLATEFORMES,
  SOINS,
  estimer,
  formatEuro,
  formatFcfa,
  libelles,
  nombre,
  plage,
  type Demande,
} from '@/lib/estimation'
import { IDENTITE } from '@/data/contenu'
import { Rev, Tete } from './Primitives'

const PAS = ['Nature', 'Périmètre', 'Contraintes', 'Coordonnées', 'Récapitulatif']

type Coords = {
  societe: string
  nom: string
  email: string
  telephone: string
  message: string
}

const COORDS_VIDES: Coords = { societe: '', nom: '', email: '', telephone: '', message: '' }

const emailValide = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())

/* ------------------------------------------------------------------- OPTION UI */

function Opt({
  on,
  rond,
  nom,
  detail,
  jours,
  onClick,
}: {
  on: boolean
  rond?: boolean
  nom: string
  detail: string
  jours?: number
  onClick: () => void
}) {
  return (
    <button type="button" className="opt" data-on={on} onClick={onClick} aria-pressed={on}>
      <span className={`opt__case${rond ? ' opt__case--rond' : ''}`} aria-hidden>
        {rond ? '●' : '✓'}
      </span>
      <span style={{ minWidth: 0 }}>
        <span className="opt__nom">{nom}</span>
        <span className="opt__detail">{detail}</span>
      </span>
      {jours ? <span className="opt__jours">+{jours} j</span> : null}
    </button>
  )
}

/* ----------------------------------------------------------------- BORDEREAU */

function Bordereau({ d }: { d: Demande }) {
  const e = useMemo(() => estimer(d), [d])

  if (!e.valide) {
    return (
      <aside className="bordereau">
        <p className="bordereau__tete">Bordereau d’estimation</p>
        <p className="bordereau__vide">
          Sélectionnez la nature du projet.
          <br />
          <br />
          L’estimation se calcule en direct, étape par étape, à partir de la charge réelle de chaque
          module — pas d’un forfait au hasard.
        </p>
      </aside>
    )
  }

  return (
    <aside className="bordereau">
      <p className="bordereau__tete">Bordereau d’estimation</p>

      <div className="chiffre">
        <p className="chiffre__l">Charge estimée</p>
        <p className="chiffre__v">
          {plage(e.joursMin, e.joursMax)}
        </p>
        <p className="chiffre__u">jours ouvrés</p>
      </div>

      <div className="chiffre">
        <p className="chiffre__l">Délai de réalisation</p>
        <p className="chiffre__v">
          {plage(e.semainesMin, e.semainesMax)}
        </p>
        <p className="chiffre__u">semaines</p>
      </div>

      <div className="chiffre">
        <p className="chiffre__l">Budget indicatif</p>
        <p className="chiffre__v chiffre__v--signal chiffre__v--montant">
          {nombre(e.fcfaMin)} – {nombre(e.fcfaMax)}
        </p>
        <p className="chiffre__u">
          FCFA
          <span className="chiffre__eur">
            soit {formatEuro(e.euroMin)} – {formatEuro(e.euroMax)}
          </span>
        </p>
      </div>

      <div className="ventilation">
        <p className="chiffre__l" style={{ marginBottom: 7 }}>
          Ventilation
        </p>
        {e.detail.map((l) => (
          <div className="ventilation__l" key={l.poste}>
            <span>{l.poste}</span>
            <span className="ventilation__p" aria-hidden />
            <b>{l.jours} j</b>
          </div>
        ))}
      </div>

      <p className="mention">
        Estimation indicative et non contractuelle, calculée à partir d’une charge en jours et d’un
        taux journalier. Le devis définitif est établi après cadrage.
      </p>
    </aside>
  )
}

/* ---------------------------------------------------------------------- DEVIS */

export function Devis() {
  const [pas, setPas] = useState(0)
  const [d, setD] = useState<Demande>(DEMANDE_VIDE)
  const [c, setC] = useState<Coords>(COORDS_VIDES)
  const [erreurs, setErreurs] = useState<Record<string, string>>({})
  const [envoi, setEnvoi] = useState<'repos' | 'cours' | 'fait' | 'echec'>('repos')
  const [reference, setReference] = useState('')
  const [messageEchec, setMessageEchec] = useState('')

  const e = useMemo(() => estimer(d), [d])
  const l = useMemo(() => libelles(d), [d])

  const bascule = (cle: 'modules' | 'plateformes', id: string) =>
    setD((v) => ({
      ...v,
      [cle]: v[cle].includes(id) ? v[cle].filter((x) => x !== id) : [...v[cle], id],
    }))

  function valider(n: number): boolean {
    const err: Record<string, string> = {}
    if (n === 0 && !d.nature) err.nature = 'Sélectionnez la nature du projet'
    if (n === 2 && d.plateformes.length === 0) err.plateformes = 'Sélectionnez au moins une cible'
    if (n === 3) {
      if (!c.nom.trim()) err.nom = 'Requis'
      if (!c.email.trim()) err.email = 'Requis'
      else if (!emailValide(c.email)) err.email = 'Adresse invalide'
    }
    setErreurs(err)
    return Object.keys(err).length === 0
  }

  const suivant = () => valider(pas) && setPas((p) => Math.min(PAS.length - 1, p + 1))
  const precedent = () => {
    setErreurs({})
    setPas((p) => Math.max(0, p - 1))
  }

  async function envoyer() {
    if (!valider(3)) {
      setPas(3)
      return
    }
    setEnvoi('cours')
    setMessageEchec('')
    try {
      const r = await fetch('/api/devis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ demande: d, coordonnees: c }),
      })
      const json = (await r.json()) as { reference?: string; erreur?: string }
      if (!r.ok) throw new Error(json.erreur || 'Envoi refusé')
      setReference(json.reference ?? '')
      setEnvoi('fait')
    } catch (err) {
      setEnvoi('echec')
      setMessageEchec(err instanceof Error ? err.message : 'Erreur inattendue')
    }
  }

  /* ----------------------------------------------------------- confirmation */

  if (envoi === 'fait') {
    return (
      <section id="devis" className="section">
        <div className="bloc">
          <Tete num="06" titre="Devis" note="Demande enregistrée" />
          <div className="devis">
            <div className="fini">
              <span className="tampon">Demande reçue</span>
              <p className="fini__ref">{reference}</p>
              <p className="texte" style={{ maxWidth: '46ch', margin: '0 auto 24px' }}>
                Conservez cette référence. Je reviens vers vous sous 24 heures ouvrées avec un devis
                détaillé et, si le projet s’y prête, une proposition de découpage en lots.
              </p>
              <div className="recap" style={{ maxWidth: 440, margin: '0 auto 24px', textAlign: 'left' }}>
                <div className="recap__l">
                  <span className="recap__k">Charge</span>
                  <span className="recap__v">
                    {plage(e.joursMin, e.joursMax)} jours ouvrés
                  </span>
                </div>
                <div className="recap__l">
                  <span className="recap__k">Délai</span>
                  <span className="recap__v">
                    {plage(e.semainesMin, e.semainesMax)} semaines
                  </span>
                </div>
                <div className="recap__l">
                  <span className="recap__k">Budget</span>
                  <span className="recap__v">
                    {formatFcfa(e.fcfaMin)} – {formatFcfa(e.fcfaMax)}
                    <span className="sourd" style={{ display: 'block', fontSize: 12 }}>
                      soit {formatEuro(e.euroMin)} – {formatEuro(e.euroMax)}
                    </span>
                  </span>
                </div>
              </div>
              <a className="btn btn--creux" href={`mailto:${IDENTITE.email}?subject=${reference}`}>
                Écrire directement
              </a>
            </div>
          </div>
        </div>
      </section>
    )
  }

  /* ------------------------------------------------------------- formulaire */

  return (
    <section id="devis" className="section">
      <div className="bloc">
        <Tete num="06" titre="Devis" note="Estimation en direct · 2 minutes" />

        <div className="deux-col" style={{ marginBottom: 'clamp(26px, 3.5vw, 40px)' }}>
          <Rev>
            <h2 className="h2">
              Un chiffre,
              <br />
              <span className="serif-it" style={{ color: 'var(--signal)' }}>
                pas un « nous&nbsp;vous recontactons »
              </span>
            </h2>
          </Rev>
          <Rev delai={110}>
            <p className="texte">
              Décrivez le projet en quatre étapes. La charge et le budget se calculent au fur et à
              mesure, à partir du coût réel de chaque module — vous voyez immédiatement ce qu’une
              fonctionnalité ajoute à la facture. Rien n’est envoyé avant la dernière étape.
            </p>
          </Rev>
        </div>

        <Rev>
          <div className="devis">
            <div className="devis__entete">
              <span className="mono" style={{ fontWeight: 700 }}>
                Bon de travail — demande d’estimation
              </span>
              <span className="mono sourd">
                Étape {pas + 1} / {PAS.length}
              </span>
            </div>

            <div className="devis__corps">
              <div className="devis__volet">
                {/* Pas de role="list"/"listitem" ici : appliquer `listitem` à un
                    bouton écrase sa sémantique de bouton et le rend muet aux
                    lecteurs d'écran. Un groupe nommé suffit. */}
                <div className="pas" role="group" aria-label="Étapes du devis">
                  {PAS.map((p, i) => (
                    <button
                      key={p}
                      type="button"
                      aria-current={i === pas ? 'step' : undefined}
                      className="pas__e"
                      data-etat={i === pas ? 'courant' : i < pas ? 'fait' : 'avenir'}
                      onClick={() => i < pas && setPas(i)}
                      disabled={i > pas}
                    >
                      {i + 1}.<span className="pas__nom">&nbsp;{p}</span>
                    </button>
                  ))}
                </div>

                {/* ---------------------------------------------- 1. NATURE */}
                {pas === 0 && (
                  <div>
                    <h3 className="devis__q">Quelle est la nature du projet&nbsp;?</h3>
                    <p className="devis__aide">
                      Un seul choix. C’est la base de l’estimation — tout le reste s’y ajoute.
                    </p>
                    <div className="choix choix--2">
                      {NATURES.map((n) => (
                        <Opt
                          key={n.id}
                          rond
                          on={d.nature === n.id}
                          nom={n.nom}
                          detail={n.detail}
                          jours={n.jours}
                          onClick={() => setD((v) => ({ ...v, nature: n.id }))}
                        />
                      ))}
                    </div>
                    {erreurs.nature ? <p className="erreur">{erreurs.nature}</p> : null}
                  </div>
                )}

                {/* -------------------------------------------- 2. PÉRIMÈTRE */}
                {pas === 1 && (
                  <div>
                    <h3 className="devis__q">De quoi avez-vous besoin&nbsp;?</h3>
                    <p className="devis__aide">
                      Autant de choix que nécessaire. La charge indiquée à droite de chaque ligne est
                      celle que j’applique réellement — y compris les tests et la mise en production
                      du module.
                    </p>
                    <div className="choix choix--2">
                      {MODULES.map((m) => (
                        <Opt
                          key={m.id}
                          on={d.modules.includes(m.id)}
                          nom={m.nom}
                          detail={m.detail}
                          jours={m.jours}
                          onClick={() => bascule('modules', m.id)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* ------------------------------------------ 3. CONTRAINTES */}
                {pas === 2 && (
                  <div style={{ display: 'grid', gap: 26 }}>
                    <div>
                      <h3 className="devis__q">Quelles cibles&nbsp;?</h3>
                      <p className="devis__aide">
                        La première est incluse. Chaque cible supplémentaire ajoute 6 jours.
                      </p>
                      <div className="choix choix--2">
                        {PLATEFORMES.map((p) => (
                          <Opt
                            key={p.id}
                            on={d.plateformes.includes(p.id)}
                            nom={p.nom}
                            detail={p.detail}
                            onClick={() => bascule('plateformes', p.id)}
                          />
                        ))}
                      </div>
                      {erreurs.plateformes ? <p className="erreur">{erreurs.plateformes}</p> : null}
                    </div>

                    <div>
                      <h3 className="devis__q">Quelle contrainte de délai&nbsp;?</h3>
                      <p className="devis__aide">
                        Une date imposée se paie en priorisation, pas en magie.
                      </p>
                      <div className="choix choix--3">
                        {DELAIS.map((o) => (
                          <Opt
                            key={o.id}
                            rond
                            on={d.delai === o.id}
                            nom={o.nom}
                            detail={o.detail}
                            onClick={() => setD((v) => ({ ...v, delai: o.id }))}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="devis__q">Quel niveau de finition&nbsp;?</h3>
                      <p className="devis__aide">
                        Du sobre et solide au design system complet.
                      </p>
                      <div className="choix choix--3">
                        {SOINS.map((o) => (
                          <Opt
                            key={o.id}
                            rond
                            on={d.soin === o.id}
                            nom={o.nom}
                            detail={o.detail}
                            onClick={() => setD((v) => ({ ...v, soin: o.id }))}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ------------------------------------------ 4. COORDONNÉES */}
                {pas === 3 && (
                  <div>
                    <h3 className="devis__q">Où vous répondre&nbsp;?</h3>
                    <p className="devis__aide">
                      Nom et adresse e-mail suffisent. Rien n’est encore envoyé.
                    </p>
                    <div className="champs champs--2">
                      <label className="champ">
                        <span className="champ__l">Société</span>
                        <input
                          value={c.societe}
                          onChange={(ev) => setC({ ...c, societe: ev.target.value })}
                          placeholder="Nom de l’entreprise"
                          autoComplete="organization"
                        />
                      </label>
                      <label className="champ">
                        <span className="champ__l">
                          Nom <span>*</span>
                        </span>
                        <input
                          value={c.nom}
                          onChange={(ev) => setC({ ...c, nom: ev.target.value })}
                          placeholder="Votre nom"
                          autoComplete="name"
                          aria-invalid={!!erreurs.nom}
                        />
                        {erreurs.nom ? <span className="erreur">{erreurs.nom}</span> : null}
                      </label>
                      <label className="champ">
                        <span className="champ__l">
                          E-mail <span>*</span>
                        </span>
                        <input
                          type="email"
                          value={c.email}
                          onChange={(ev) => setC({ ...c, email: ev.target.value })}
                          placeholder="vous@societe.com"
                          autoComplete="email"
                          aria-invalid={!!erreurs.email}
                        />
                        {erreurs.email ? <span className="erreur">{erreurs.email}</span> : null}
                      </label>
                      <label className="champ">
                        <span className="champ__l">Téléphone</span>
                        <input
                          value={c.telephone}
                          onChange={(ev) => setC({ ...c, telephone: ev.target.value })}
                          placeholder="Optionnel"
                          autoComplete="tel"
                        />
                      </label>
                    </div>
                    <label className="champ" style={{ marginTop: 14 }}>
                      <span className="champ__l">Contexte du projet</span>
                      <textarea
                        value={c.message}
                        onChange={(ev) => setC({ ...c, message: ev.target.value })}
                        placeholder="Ce que vous voulez obtenir, l’existant s’il y en a, les contraintes connues…"
                      />
                    </label>
                  </div>
                )}

                {/* ----------------------------------------- 5. RÉCAPITULATIF */}
                {pas === 4 && (
                  <div>
                    <h3 className="devis__q">Récapitulatif avant envoi</h3>
                    <p className="devis__aide">
                      Vérifiez, puis envoyez. L’estimation est recalculée côté serveur.
                    </p>

                    <div className="recap">
                      <div className="recap__l">
                        <span className="recap__k">Nature</span>
                        <span className="recap__v">{l.nature}</span>
                      </div>
                      <div className="recap__l">
                        <span className="recap__k">Modules</span>
                        <span className="recap__v">
                          {l.modules.length ? l.modules.join(' · ') : 'Aucun module additionnel'}
                        </span>
                      </div>
                      <div className="recap__l">
                        <span className="recap__k">Cibles</span>
                        <span className="recap__v">{l.plateformes.join(' · ') || '—'}</span>
                      </div>
                      <div className="recap__l">
                        <span className="recap__k">Délai</span>
                        <span className="recap__v">{l.delai}</span>
                      </div>
                      <div className="recap__l">
                        <span className="recap__k">Finition</span>
                        <span className="recap__v">{l.soin}</span>
                      </div>
                      <div className="recap__l">
                        <span className="recap__k">Contact</span>
                        <span className="recap__v">
                          {c.nom}
                          {c.societe ? ` — ${c.societe}` : ''} · {c.email}
                          {c.telephone ? ` · ${c.telephone}` : ''}
                        </span>
                      </div>
                      {c.message ? (
                        <div className="recap__l">
                          <span className="recap__k">Contexte</span>
                          <span className="recap__v">{c.message}</span>
                        </div>
                      ) : null}
                    </div>

                    {envoi === 'echec' ? (
                      <p className="erreur" style={{ marginBottom: 14 }}>
                        Envoi impossible : {messageEchec}. Écrivez-moi à {IDENTITE.email}.
                      </p>
                    ) : null}
                  </div>
                )}

                {/* ---------------------------------------------- NAVIGATION */}
                <div className="devis__nav">
                  <button
                    type="button"
                    className="btn btn--creux"
                    onClick={precedent}
                    disabled={pas === 0 || envoi === 'cours'}
                  >
                    ← Précédent
                  </button>

                  {pas < PAS.length - 1 ? (
                    <button type="button" className="btn" onClick={suivant}>
                      Continuer →
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn"
                      onClick={envoyer}
                      disabled={envoi === 'cours'}
                    >
                      {envoi === 'cours' ? 'Envoi…' : 'Envoyer la demande'}
                    </button>
                  )}
                </div>

                {e.valide ? (
                  <div className="devis__apercu" aria-hidden>
                    <span className="devis__apercu__l">
                      {plage(e.joursMin, e.joursMax)} j ·{' '}
                      {plage(e.semainesMin, e.semainesMax)} sem.
                    </span>
                    <span className="devis__apercu__v">
                      {nombre(e.fcfaMin)} – {nombre(e.fcfaMax)} F
                    </span>
                  </div>
                ) : null}
              </div>

              <Bordereau d={d} />
            </div>
          </div>
        </Rev>
      </div>
    </section>
  )
}
