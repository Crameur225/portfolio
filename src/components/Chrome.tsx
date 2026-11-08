'use client'

import { useEffect, useRef, useState } from 'react'
import { IDENTITE } from '@/data/contenu'

export const SECTIONS = [
  { id: 'seuil', num: '00', nom: 'Seuil' },
  { id: 'releve', num: '01', nom: 'Relevé' },
  { id: 'travaux', num: '02', nom: 'Travaux' },
  { id: 'matiere', num: '03', nom: 'Matière' },
  { id: 'methode', num: '04', nom: 'Méthode' },
  { id: 'parcours', num: '05', nom: 'Parcours' },
  { id: 'devis', num: '06', nom: 'Devis' },
]

/* ------------------------------------------------------------ SUIVI DE SECTION */

function useSectionActive() {
  const [actif, setActif] = useState('seuil')

  useEffect(() => {
    const cibles = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (e): e is HTMLElement => e !== null,
    )
    if (!cibles.length || typeof IntersectionObserver === 'undefined') return

    const obs = new IntersectionObserver(
      (entrees) => {
        // On retient la section visible la plus haute dans la page.
        const visibles = entrees
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visibles[0]) setActif(visibles[0].target.id)
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    cibles.forEach((c) => obs.observe(c))
    return () => obs.disconnect()
  }, [])

  return actif
}

/* ----------------------------------------------------------------------- THÈME */

function useTheme() {
  const [theme, setTheme] = useState<'clair' | 'sombre' | null>(null)

  useEffect(() => {
    let garde: 'clair' | 'sombre' | null = null
    try {
      const v = localStorage.getItem('atelier-theme')
      if (v === 'clair' || v === 'sombre') garde = v
    } catch {
      /* stockage indisponible : on retombe sur la préférence système */
    }
    const systeme =
      typeof matchMedia !== 'undefined' && matchMedia('(prefers-color-scheme: dark)').matches
        ? 'sombre'
        : 'clair'
    setTheme(garde ?? systeme)
  }, [])

  useEffect(() => {
    if (!theme) return
    document.documentElement.setAttribute('data-theme', theme === 'sombre' ? 'dark' : 'light')
    try {
      localStorage.setItem('atelier-theme', theme)
    } catch {
      /* lecture seule : le thème reste valable pour la session */
    }
  }, [theme])

  return [theme, () => setTheme((t) => (t === 'sombre' ? 'clair' : 'sombre'))] as const
}

/* ------------------------------------------------------------------------ RAIL */

export function Rail() {
  const actif = useSectionActive()

  return (
    <nav className="rail" aria-label="Navigation latérale">
      <span className="rail__sigle" aria-hidden>
        AG
      </span>

      <div className="rail__points">
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="rail__point"
            data-actif={actif === s.id}
            title={`${s.num} — ${s.nom}`}
          >
            <span className="sr">{s.nom}</span>
          </a>
        ))}
      </div>

      <span className="rail__texte">
        {IDENTITE.ville} · {IDENTITE.fuseau}
      </span>
    </nav>
  )
}

/* ------------------------------------------------------------------ BARRE HAUTE */

export function Barre() {
  const [theme, basculer] = useTheme()
  const actif = useSectionActive()
  const courante = SECTIONS.find((s) => s.id === actif) ?? SECTIONS[0]
  const piste = useRef<HTMLElement>(null)

  // La bande d'onglets mobile défile : on ramène l'onglet courant dans le
  // champ de vision. `scrollIntoView` ferait défiler la page entière, alors
  // qu'on ne veut déplacer que la bande — d'où le calcul à la main.
  useEffect(() => {
    const bande = piste.current
    const onglet = bande?.querySelector<HTMLElement>('[data-actif="true"]')
    if (!bande || !onglet) return
    const marge = 14
    const b = bande.getBoundingClientRect()
    const o = onglet.getBoundingClientRect()
    if (o.left < b.left + marge) bande.scrollLeft -= b.left + marge - o.left
    else if (o.right > b.right - marge) bande.scrollLeft += o.right - b.right + marge
  }, [actif])

  return (
    <div className="barre">
      <div className="barre__in">
        {/* Sous 1100 px le nom complet ne tient pas dans la ligne : le sigle
            le remplace et la bande d'onglets dit où l'on se trouve. */}
        <span className="barre__sigle" aria-hidden>
          AG
        </span>
        <span className="barre__ref">
          {IDENTITE.nomComplet} — § {courante.num} {courante.nom}
        </span>

        <div className="barre__droite">
          <button
            type="button"
            className="ico"
            onClick={basculer}
            aria-label={theme === 'sombre' ? 'Passer en thème clair' : 'Passer en thème sombre'}
            title="Thème"
          >
            {theme === 'sombre' ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <circle cx="12" cy="12" r="4.2" />
                <path d="M12 2v2.6M12 19.4V22M2 12h2.6M19.4 12H22M4.9 4.9l1.9 1.9M17.2 17.2l1.9 1.9M19.1 4.9l-1.9 1.9M6.8 17.2l-1.9 1.9" />
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path d="M20.5 14.6A8.6 8.6 0 1 1 9.4 3.5a6.9 6.9 0 0 0 11.1 11.1Z" />
              </svg>
            )}
          </button>

          <a
            className="ico"
            href={IDENTITE.github}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Profil GitHub"
            title="GitHub"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1.8a10.2 10.2 0 0 0-3.2 19.9c.5.1.7-.2.7-.5v-1.9c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.4 1.1 3 .8.1-.7.4-1.1.7-1.4-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.7 1a9.4 9.4 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10.2 10.2 0 0 0 12 1.8Z" />
            </svg>
          </a>

          <a className="btn btn--petit" href="#devis">
            Devis
          </a>
        </div>
      </div>

      {/* Navigation des petits écrans — le rail vertical n'existe qu'à
          partir de 1100 px. Masquée en CSS au-delà. */}
      <nav className="barre__nav" aria-label="Sections de la page" ref={piste}>
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="barre__onglet"
            data-actif={actif === s.id}
            aria-current={actif === s.id ? 'true' : undefined}
          >
            <b aria-hidden>{s.num}</b> {s.nom}
          </a>
        ))}
      </nav>
    </div>
  )
}
