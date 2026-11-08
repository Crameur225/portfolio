'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { Diagramme } from '@/data/contenu'

/* ------------------------------------------------------------------ RÉVÉLATION */

/** Révèle son contenu quand il entre dans la fenêtre. Une seule fois. */
export function Rev({
  children,
  delai = 0,
  as: Balise = 'div',
  className = '',
}: {
  children: ReactNode
  delai?: number
  as?: 'div' | 'section' | 'li' | 'article' | 'header'
  className?: string
}) {
  const ref = useRef<HTMLElement>(null)
  const [vu, setVu] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setVu(true)
      return
    }
    const obs = new IntersectionObserver(
      (entrees) => {
        for (const e of entrees) {
          if (e.isIntersecting) {
            setVu(true)
            obs.disconnect()
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.06 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const Composant = Balise as 'div'
  return (
    <Composant
      // @ts-expect-error — ref polymorphe assumée
      ref={ref}
      className={`rev ${className}`}
      data-vu={vu || undefined}
      style={delai ? { transitionDelay: `${delai}ms` } : undefined}
    >
      {children}
    </Composant>
  )
}

/* -------------------------------------------------------------------- COMPTEUR */

/** Compte de 0 à `vers` quand il devient visible. */
export function Compteur({ vers, duree = 1150 }: { vers: number; duree?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [n, setN] = useState(0)
  const lance = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduit =
      typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

    const anime = () => {
      if (lance.current) return
      lance.current = true
      if (reduit) {
        setN(vers)
        return
      }
      const t0 = performance.now()
      const pas = (t: number) => {
        const p = Math.min(1, (t - t0) / duree)
        // sortie cubique : démarrage franc, arrivée posée
        setN(Math.round(vers * (1 - Math.pow(1 - p, 3))))
        if (p < 1) requestAnimationFrame(pas)
      }
      requestAnimationFrame(pas)
    }

    if (typeof IntersectionObserver === 'undefined') {
      anime()
      return
    }
    const obs = new IntersectionObserver(
      (es) => es.some((e) => e.isIntersecting) && (anime(), obs.disconnect()),
      { threshold: 0.4 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [vers, duree])

  return (
    <span ref={ref} className="compteur">
      {n}
    </span>
  )
}

/* ------------------------------------------------------------- TÊTE DE SECTION */

export function Tete({
  num,
  titre,
  note,
}: {
  num: string
  titre: string
  note?: string
}) {
  return (
    <header className="tete">
      <span className="tete__carre" aria-hidden />
      <span className="tete__num">§ {num}</span>
      <span className="tete__titre">{titre}</span>
      {note ? <span className="tete__note">{note}</span> : null}
    </header>
  )
}

/* ------------------------------------------------------------------ DIAGRAMME */

/**
 * Schéma d'architecture dessiné à partir des données du projet.
 * Chaque couche est une rangée ; les liaisons verticales sont tracées
 * entre les couches. Aucun SVG figé : le schéma suit le contenu.
 */
export function Schema({ d, refCode }: { d: Diagramme; refCode: string }) {
  return (
    <figure className="diag">
      <div className="diag__tete">
        <span className="mono" style={{ fontWeight: 700 }}>
          Fig. {refCode}
        </span>
        <span className="mono sourd">Architecture</span>
      </div>

      {d.couches.map((couche, i) => (
        <div key={couche.titre}>
          <div className="diag__couche">
            <span className="diag__titre">{couche.titre}</span>
            <div className="diag__noeuds">
              {couche.noeuds.map((n) => (
                <div key={n.nom} className={`noeud${n.accent ? ' noeud--accent' : ''}`}>
                  <span className="noeud__nom">{n.nom}</span>
                  {n.detail ? <span className="noeud__detail">{n.detail}</span> : null}
                </div>
              ))}
            </div>
          </div>
          {i < d.couches.length - 1 ? (
            <div className="diag__liaison" aria-hidden>
              <span>│</span>
            </div>
          ) : null}
        </div>
      ))}

      <figcaption className="diag__legende">{d.legende}</figcaption>
    </figure>
  )
}
