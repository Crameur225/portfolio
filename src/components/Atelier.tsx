import { MATIERE, METHODE, PARCOURS } from '@/data/contenu'
import { Rev, Tete } from './Primitives'

/* --------------------------------------------------------------------- MATIÈRE */

export function Matiere() {
  return (
    <section id="matiere" className="section">
      <div className="bloc">
        <Tete num="03" titre="Matière" note="Avec le contexte d’emploi réel" />

        <Rev>
          <p className="texte" style={{ maxWidth: '62ch', marginBottom: 'clamp(26px, 3.5vw, 44px)' }}>
            Une liste de logos ne dit rien. Voici ce que chaque outil a servi à construire — et sur
            quel projet il est en production.
          </p>
        </Rev>

        <div className="matiere">
          {MATIERE.map((f, i) => (
            <Rev key={f.code} className="famille" delai={Math.min(i * 60, 300)}>
              <div className="famille__tete">
                <h3 className="h3">{f.titre}</h3>
                <span className="mono sourd">{f.code}</span>
              </div>
              {f.entrees.map((e) => (
                <div className="famille__l" key={e.nom}>
                  <span className="famille__nom">{e.nom}</span>
                  <span className="famille__ctx">{e.contexte}</span>
                </div>
              ))}
            </Rev>
          ))}
        </div>
      </div>
    </section>
  )
}

/* --------------------------------------------------------------------- MÉTHODE */

export function Methode() {
  return (
    <section id="methode" className="section">
      <div className="bloc">
        <Tete num="04" titre="Méthode" note="Protocole en quatre temps" />

        <div className="deux-col" style={{ marginBottom: 'clamp(26px, 3.5vw, 44px)' }}>
          <Rev>
            <h2 className="h2">
              Un projet est fini quand
              <br />
              <span className="serif-it" style={{ color: 'var(--signal)' }}>
                quelqu’un d’autre
              </span>
              <br />
              peut le reprendre
            </h2>
          </Rev>
          <Rev delai={110}>
            <p className="texte">
              La plupart des projets échouent après la livraison, pas pendant. Un code qu’on ne sait
              pas déployer, une décision d’architecture dont personne ne connaît la raison, une
              variable d’environnement qui n’est documentée nulle part : voilà ce qui coûte cher.
              Ce protocole existe pour que cela n’arrive pas.
            </p>
          </Rev>
        </div>

        <div className="methode">
          {METHODE.map((e, i) => (
            <Rev key={e.num} className="etape" delai={Math.min(i * 80, 320)}>
              <span className="etape__num" aria-hidden>
                {e.num}
              </span>
              <h3 className="h3">{e.titre}</h3>
              <p className="etape__duree">{e.duree}</p>
              <p className="etape__texte">{e.texte}</p>
            </Rev>
          ))}
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------- PARCOURS */

export function Parcours() {
  return (
    <section id="parcours" className="section">
      <div className="bloc">
        <Tete num="05" titre="Parcours" note="Formation & expérience" />

        <div className="parcours">
          {PARCOURS.map((p, i) => (
            <Rev
              key={`${p.periode}-${p.titre}`}
              className="parcours__l"
              delai={Math.min(i * 50, 300)}
            >
              <span className="parcours__periode">
                {p.courant ? <span className="pastille__pt" aria-hidden /> : null}
                {p.periode}
              </span>
              <span>
                <span className="parcours__titre">{p.titre}</span>
                <span className="parcours__lieu" style={{ display: 'block' }}>
                  {p.lieu}
                </span>
              </span>
              <p className="parcours__texte">{p.texte}</p>
            </Rev>
          ))}
        </div>
      </div>
    </section>
  )
}
