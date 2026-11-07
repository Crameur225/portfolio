import Image from 'next/image'
import { BANDEAU, IDENTITE, RELEVE } from '@/data/contenu'
import { Compteur, Rev, Tete } from './Primitives'

/* ----------------------------------------------------------------------- SEUIL */

export function Seuil() {
  return (
    <section id="seuil" className="section section--nu seuil">
      <div className="bloc">
        <Rev as="header">
          <div className="seuil__haut">
            <span className="pastille">
              <span className="pastille__pt" aria-hidden />
              {IDENTITE.disponibilite}
            </span>
            <span className="mono sourd">
              {IDENTITE.ville}, {IDENTITE.pays} · {IDENTITE.fuseau}
            </span>
          </div>

          <h1 className="mega">
            {IDENTITE.accrocheA}
            <span className="mega__l2">
              <em>{IDENTITE.accrocheB}</em>
            </span>
            <span className="mega__l3">{IDENTITE.accrocheC}</span>
          </h1>
        </Rev>

        <div className="seuil__bas">
          <Rev delai={110}>
            <p className="texte texte--grand" style={{ maxWidth: '58ch' }}>
              {IDENTITE.manifeste}
            </p>

            <div className="seuil__actions">
              <a className="btn" href="#devis">
                Obtenir un devis
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M4 12h15M13 6l6 6-6 6" />
                </svg>
              </a>
              <a className="btn btn--creux" href="#travaux">
                Voir les travaux
              </a>
              <a
                className="btn btn--creux"
                href={IDENTITE.github}
                target="_blank"
                rel="noreferrer noopener"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M12 1.8a10.2 10.2 0 0 0-3.2 19.9c.5.1.7-.2.7-.5v-1.9c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.4 1.1 3 .8.1-.7.4-1.1.7-1.4-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.7 1a9.4 9.4 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10.2 10.2 0 0 0 12 1.8Z" />
                </svg>
                56 dépôts sur GitHub
              </a>
            </div>
          </Rev>

          <Rev delai={200}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 22,
                alignItems: 'flex-start',
              }}
            >
              <figure className="planche">
                <Image
                  className="planche__img"
                  src="/image_agbe.jpg"
                  alt={`Portrait de ${IDENTITE.nomComplet}`}
                  width={960}
                  height={1280}
                  priority
                  sizes="(min-width: 900px) 320px, 100vw"
                />
                <figcaption className="planche__leg">
                  <span>Portrait — réf. AG-00</span>
                  <span>{IDENTITE.ville}</span>
                </figcaption>
              </figure>

              <span className="tampon">8 systèmes livrés</span>

              <div style={{ borderTop: '1px solid var(--trait)', paddingTop: 18, width: '100%' }}>
                <p className="mono sourd" style={{ marginTop: 0, marginBottom: 10 }}>
                  Identité
                </p>
                <p
                  className="h3"
                  style={{ marginBottom: 6, fontSize: 'clamp(1.1rem, 2.2vw, 1.5rem)' }}
                >
                  {IDENTITE.nomComplet}
                </p>
                <p className="mono sourd" style={{ lineHeight: 1.8 }}>
                  {IDENTITE.titre}
                  <br />
                  {IDENTITE.sousTitre}
                </p>
              </div>
            </div>
          </Rev>
        </div>
      </div>
    </section>
  )
}

/* --------------------------------------------------------------------- BANDEAU */

export function Bandeau() {
  // Deux pistes identiques côte à côte : la boucle est sans raccord.
  const piste = (cle: string) => (
    <div className="bandeau__piste" key={cle} aria-hidden={cle === 'b'}>
      {BANDEAU.map((t) => (
        <span className="bandeau__item" key={`${cle}-${t}`}>
          {t}
        </span>
      ))}
    </div>
  )

  return (
    <div className="bandeau" role="img" aria-label={`Technologies utilisées : ${BANDEAU.join(', ')}`}>
      {piste('a')}
      {piste('b')}
    </div>
  )
}

/* ---------------------------------------------------------------------- RELEVÉ */

export function Releve() {
  return (
    <section id="releve" className="section">
      <div className="bloc">
        <Tete num="01" titre="Relevé" note="Au 6 novembre 2026" />

        <div className="releve">
          {RELEVE.map((r, i) => (
            <Rev key={r.label} className="releve__case" delai={i * 70}>
              <span className="cote">
                <Compteur vers={r.valeur} />
              </span>
              <p className="releve__label">{r.label}</p>
              <p className="releve__detail">{r.detail}</p>
            </Rev>
          ))}
        </div>
      </div>
    </section>
  )
}
