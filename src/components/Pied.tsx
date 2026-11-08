import { IDENTITE, PROJETS } from '@/data/contenu'
import { Rev } from './Primitives'

export function Pied() {
  const annee = new Date().getFullYear()

  return (
    <footer className="pied">
      <div className="bloc">
        <div className="pied__grille">
          <Rev>
            <h2 className="h2" style={{ marginBottom: 18 }}>
              Parlons de
              <br />
              <span className="serif-it" style={{ color: 'var(--signal)' }}>
                votre système
              </span>
            </h2>
            <p className="texte" style={{ maxWidth: '44ch', marginBottom: 22 }}>
              Que ce soit une plateforme à construire, une API à reprendre ou une infrastructure à
              instrumenter — décrivez-moi le problème, je vous dis comment je l’aborderais.
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <a className="btn" href="#devis">
                Obtenir un devis
              </a>
              <a className="btn btn--creux" href={`mailto:${IDENTITE.email}`}>
                {IDENTITE.email}
              </a>
            </div>
          </Rev>

          <Rev delai={110}>
            <p className="mono sourd" style={{ marginBottom: 4 }}>
              Coordonnées
            </p>
            <div className="pied__liens">
              <a className="pied__lien" href={`mailto:${IDENTITE.email}`}>
                <b>E-mail</b>
                <span>{IDENTITE.email}</span>
              </a>
              <a
                className="pied__lien"
                href={IDENTITE.github}
                target="_blank"
                rel="noreferrer noopener"
              >
                <b>GitHub</b>
                <span>{IDENTITE.githubPseudo} ↗</span>
              </a>
              <a
                className="pied__lien"
                href={IDENTITE.siteMedia}
                target="_blank"
                rel="noreferrer noopener"
              >
                <b>Média</b>
                <span>info.nextmakers.net ↗</span>
              </a>
              <span className="pied__lien" style={{ cursor: 'default' }}>
                <b>Lieu</b>
                <span>
                  {IDENTITE.ville}, {IDENTITE.pays} · {IDENTITE.fuseau}
                </span>
              </span>
              <span className="pied__lien" style={{ cursor: 'default' }}>
                <b>Statut</b>
                <span style={{ color: 'var(--signal)' }}>{IDENTITE.disponibilite}</span>
              </span>
            </div>
          </Rev>
        </div>

        <div className="pied__bas">
          <span>
            © {annee} {IDENTITE.nomComplet}
          </span>
          <span>
            {PROJETS.length} fiches · 56 dépôts · Construit en Next.js, sans dépendance d’interface
          </span>
        </div>
      </div>
    </footer>
  )
}
