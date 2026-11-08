'use client'

import { useState } from 'react'
import { IDENTITE, PROJETS, type Projet } from '@/data/contenu'
import { planche } from '@/lib/planches'
import { Rev, Schema, Tete } from './Primitives'

/* ----------------------------------------------------------------- FICHE */

function Fiche({ p }: { p: Projet }) {
  // Le schéma d'architecture se révèle au clic sur la planche.
  const [schemaVisible, setSchemaVisible] = useState(false)

  // Le SVG vient d'une fonction locale, sans aucune entrée extérieure :
  // rien d'injectable ici.
  const svg = planche(p.ref)

  return (
    <div className="fiche" id={`fiche-${p.ref}`}>
      <div className="fiche__in">
        {/* Colonne gauche : texte et spécifications */}
        <div>
          <div className="fiche__entete">
            <span className="mono" style={{ color: 'var(--signal)', fontWeight: 700 }}>
              Réf. {p.ref}
            </span>
            <span className="mono sourd">{p.annee}</span>
            <span className={`mono puce puce--${p.statutTon}`}>{p.statut}</span>
          </div>

          <p className="fiche__accroche">{p.accroche}</p>
          <p className="fiche__resume">{p.resume}</p>

          <p className="mono sourd" style={{ marginBottom: 8 }}>
            Rôle — {p.role}
          </p>

          <div className="specs">
            {p.specs.map((s) => (
              <div className="specs__l" key={s.cle}>
                <span className="specs__k">{s.cle}</span>
                <span className="specs__pointille" aria-hidden />
                <span className="specs__v">{s.valeur}</span>
              </div>
            ))}
          </div>

          <p className="mono sourd" style={{ marginBottom: 12 }}>
            Points d’ingénierie
          </p>
          <ul className="faits">
            {p.faits.map((f) => (
              // Pas de span vide ici : le `::before` du CSS est lui-même un
              // élément de grille, donc deux enfants feraient trois colonnes.
              <li key={f}>
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <div className="jetons">
            {p.stack.map((t) => (
              <span className="jeton" key={t}>
                {t}
              </span>
            ))}
          </div>

          <div className="depots">
            <p className="mono sourd" style={{ marginBottom: 6 }}>
              {p.depots.length ? `Dépôts — ${p.depots.length}` : 'Code source'}
            </p>

            {p.codeClient ? <div className="depots__l">{p.codeClient}</div> : null}

            {p.depots.map((d) => (
              <div className="depots__l" key={d.nom}>
                <span aria-hidden>▪</span>
                {/* On ne lie que les dépôts publics : un lien vers un dépôt
                    privé renvoie un 404 à qui n'y a pas accès. */}
                {d.prive ? (
                  <span className="depots__nom">{d.nom}</span>
                ) : (
                  <a
                    className="depots__nom lien-signal"
                    href={`${IDENTITE.github}/${d.nom}`}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {d.nom} ↗
                  </a>
                )}
                <span>· {d.langue}</span>
                {d.poids ? <span>· {d.poids}</span> : null}
                <span>· {d.prive ? 'privé — accès sur demande' : 'public'}</span>
              </div>
            ))}
            {p.lien ? (
              <p style={{ marginTop: 10, marginBottom: 0 }}>
                <a
                  className="mono lien-signal"
                  href={p.lien}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Voir en production ↗
                </a>
              </p>
            ) : null}
          </div>
        </div>

        {/* Colonne droite : la planche, puis le schéma qu'elle révèle */}
        <div style={{ minWidth: 0 }}>
          {svg ? (
            <>
              <button
                type="button"
                className="illus illus--cliquable"
                onClick={() => setSchemaVisible((v) => !v)}
                aria-expanded={schemaVisible}
                aria-controls={`schema-${p.ref}`}
              >
                <span dangerouslySetInnerHTML={{ __html: svg }} />
                <span className="illus__appel">
                  <span>{schemaVisible ? 'Masquer le schéma' : 'Voir le schéma d’architecture'}</span>
                  <span className="illus__signe" aria-hidden>
                    {schemaVisible ? '×' : '+'}
                  </span>
                </span>
              </button>

              {schemaVisible ? (
                <div id={`schema-${p.ref}`} className="revele">
                  <Schema d={p.diagramme} refCode={p.ref} />
                </div>
              ) : null}
            </>
          ) : (
            <Schema d={p.diagramme} refCode={p.ref} />
          )}
        </div>
      </div>
    </div>
  )
}

/* ----------------------------------------------------------------------- INDEX */

export function Travaux() {
  // Le premier projet est ouvert d'emblée : personne ne devrait avoir à
  // cliquer pour comprendre de quoi il s'agit.
  const [ouvert, setOuvert] = useState<string | null>(PROJETS[0].ref)

  return (
    <section id="travaux" className="section">
      <div className="bloc">
        <Tete num="02" titre="Index des travaux" note="Cliquer pour déplier la fiche" />

        <div className="index">
          {PROJETS.map((p, i) => {
            const estOuvert = ouvert === p.ref
            const vignette = planche(p.ref)
            // Le numéro suit la position : réordonner les projets ne demande
            // aucune renumérotation à la main.
            const num = String(i + 1).padStart(2, '0')

            return (
              <Rev key={p.ref} delai={Math.min(i * 45, 280)}>
                <button
                  type="button"
                  className="index__ligne"
                  data-ouvert={estOuvert}
                  aria-expanded={estOuvert}
                  aria-controls={`fiche-${p.ref}`}
                  onClick={() => setOuvert(estOuvert ? null : p.ref)}
                >
                  <span className="index__num">{num}</span>
                  {vignette ? (
                    <span
                      className="vignette"
                      aria-hidden
                      dangerouslySetInnerHTML={{ __html: vignette }}
                    />
                  ) : (
                    <span className="vignette" aria-hidden />
                  )}
                  <span className="index__nom">{p.nom}</span>
                  <span className="index__cat">{p.categorie}</span>
                  <span className={`index__statut puce puce--${p.statutTon}`}>{p.statut}</span>
                  <span className="index__fleche" aria-hidden>
                    +
                  </span>
                </button>
                {estOuvert ? <Fiche p={p} /> : null}
              </Rev>
            )
          })}
        </div>
      </div>
    </section>
  )
}
