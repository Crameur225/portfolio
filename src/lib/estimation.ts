/* ============================================================================
   MOTEUR D'ESTIMATION DU DEVIS
   ---------------------------------------------------------------------------
   >>> C'EST ICI, ET NULLE PART AILLEURS, QUE SE RÈGLENT LES TARIFS. <<<
   Les valeurs ci-dessous sont des hypothèses de départ : ajuste TARIFS
   (taux journalier bas et haut) à ta réalité commerciale avant mise en ligne.
   Tout le reste du site s'adapte automatiquement.

   Le calcul est volontairement dupliqué nulle part : le client l'utilise pour
   l'affichage en direct, et l'API /api/devis le rejoue côté serveur sur les
   données reçues. Un montant envoyé par le navigateur n'est jamais retenu.
   ========================================================================== */

export const TARIFS = {
  /**
   * Taux journalier bas, EN FRANCS CFA.
   * Le franc CFA est la devise de référence : c'est le marché visé. L'euro
   * est calculé à partir d'elle, et non l'inverse — ainsi un changement de
   * tarif se fait dans la seule devise qui compte pour toi.
   */
  tjmMinFcfa: 32_000,
  /** Taux journalier haut, en francs CFA. */
  tjmMaxFcfa: 48_000,
  /** Parité fixe euro / franc CFA (UEMOA) : 1 € = 655,957 F. */
  pariteFcfa: 655.957,
  /** Jours ouvrés travaillés par semaine, pour le planning. */
  joursParSemaine: 5,
}

/* -------------------------------------------------------------------------- */

export type Option<T extends string = string> = {
  id: T
  nom: string
  detail: string
  jours?: number
  coef?: number
}

export const NATURES: Option[] = [
  { id: 'vitrine', nom: 'Site vitrine', detail: 'Présentation, contenu, formulaires, référencement', jours: 8 },
  { id: 'plateforme', nom: 'Plateforme web métier', detail: 'Rôles, workflows, back-office, données', jours: 28 },
  { id: 'mobile', nom: 'Application mobile', detail: 'Flutter — Android, iOS, et web si besoin', jours: 30 },
  { id: 'api', nom: 'API & backend', detail: 'Service REST documenté, base de données, livraison', jours: 18 },
  { id: 'data', nom: 'Données & IA', detail: 'Pipeline, modèle, évaluation, restitution', jours: 22 },
  { id: 'infra', nom: 'Infrastructure & supervision', detail: 'Conteneurs, CI/CD, métriques, alertes', jours: 16 },
]

export const MODULES: Option[] = [
  { id: 'auth', nom: 'Comptes, rôles & permissions', detail: 'Inscription, JWT, droits par rôle', jours: 4 },
  { id: 'workflow', nom: 'Workflows de validation', detail: 'États explicites, transitions, historique', jours: 7 },
  { id: 'backoffice', nom: 'Back-office d’administration', detail: 'CRUD complet, prévisualisation, exports', jours: 10 },
  { id: 'paiement', nom: 'Paiements & abonnements', detail: 'Facturation, webhooks, droits d’accès serveur', jours: 9 },
  { id: 'dashboard', nom: 'Tableaux de bord & indicateurs', detail: 'Agrégats, graphiques, filtres', jours: 7 },
  { id: 'tempsreel', nom: 'Temps réel', detail: 'WebSocket, présence, notifications in-app', jours: 6 },
  { id: 'push', nom: 'Notifications push', detail: 'Firebase, tâches de fond, préférences', jours: 4 },
  { id: 'multilingue', nom: 'Multilingue', detail: 'Chaînes externalisées, formats locaux', jours: 4 },
  { id: 'offline', nom: 'Hors-ligne & synchronisation', detail: 'Cache local, résolution de conflits', jours: 8 },
  { id: 'exports', nom: 'Exports & documents PDF', detail: 'CSV, XLSX, contrats, rapports', jours: 5 },
  { id: 'integrations', nom: 'Intégrations tierces', detail: 'API externes, SSO, e-mails, stockage', jours: 6 },
  { id: 'ia', nom: 'Modèle ou pipeline de données', detail: 'Préparation, entraînement, inférence', jours: 10 },
  { id: 'seo', nom: 'SEO technique & performance', detail: 'Rendu serveur, métadonnées, Core Web Vitals', jours: 3 },
  { id: 'tests', nom: 'Tests automatisés & CI/CD', detail: 'Couverture des règles sensibles, pipeline', jours: 6 },
]

export const PLATEFORMES: Option[] = [
  { id: 'web', nom: 'Web', detail: 'Navigateur, responsive' },
  { id: 'android', nom: 'Android', detail: 'Play Store' },
  { id: 'ios', nom: 'iOS', detail: 'App Store' },
  { id: 'admin', nom: 'Console interne', detail: 'Back-office séparé' },
]

/** Jours ajoutés par plateforme cible au-delà de la première. */
export const JOURS_PAR_PLATEFORME_SUP = 6

export const DELAIS: Option[] = [
  { id: 'souple', nom: 'Souple', detail: 'La qualité passe avant la date', coef: 0.95 },
  { id: 'normal', nom: 'Normal', detail: 'Rythme de projet standard', coef: 1 },
  { id: 'serre', nom: 'Serré', detail: 'Date imposée, priorisation forte', coef: 1.3 },
]

export const SOINS: Option[] = [
  { id: 'fonctionnel', nom: 'Fonctionnel', detail: 'Sobre, lisible, efficace', coef: 1 },
  { id: 'soigne', nom: 'Soigné', detail: 'Identité visuelle travaillée', coef: 1.15 },
  { id: 'surmesure', nom: 'Sur-mesure', detail: 'Design system complet, animations', coef: 1.35 },
]

/* -------------------------------------------------------------------------- */

export type Demande = {
  nature: string
  modules: string[]
  plateformes: string[]
  delai: string
  soin: string
}

export type Estimation = {
  joursMin: number
  joursMax: number
  semainesMin: number
  semainesMax: number
  /** Devise de référence. */
  fcfaMin: number
  fcfaMax: number
  /** Conversion indicative pour un client hors zone franc. */
  euroMin: number
  euroMax: number
  detail: { poste: string; jours: number }[]
  valide: boolean
}

const trouve = (liste: Option[], id: string) => liste.find((o) => o.id === id)

export const DEMANDE_VIDE: Demande = {
  nature: '',
  modules: [],
  plateformes: [],
  delai: 'normal',
  soin: 'soigne',
}

/**
 * Calcule une fourchette de charge et de budget à partir d'une demande.
 * Fonction pure : mêmes entrées, mêmes sorties, aucun effet de bord.
 * Utilisée à l'identique par le navigateur et par l'API.
 */
export function estimer(d: Demande): Estimation {
  const nature = trouve(NATURES, d.nature)
  const detail: { poste: string; jours: number }[] = []

  if (!nature) {
    return {
      joursMin: 0,
      joursMax: 0,
      semainesMin: 0,
      semainesMax: 0,
      fcfaMin: 0,
      fcfaMax: 0,
      euroMin: 0,
      euroMax: 0,
      detail: [],
      valide: false,
    }
  }

  let jours = nature.jours ?? 0
  detail.push({ poste: nature.nom, jours: nature.jours ?? 0 })

  for (const id of d.modules) {
    const m = trouve(MODULES, id)
    if (m?.jours) {
      jours += m.jours
      detail.push({ poste: m.nom, jours: m.jours })
    }
  }

  const supplementaires = Math.max(0, d.plateformes.length - 1)
  if (supplementaires > 0) {
    const ajout = supplementaires * JOURS_PAR_PLATEFORME_SUP
    jours += ajout
    detail.push({ poste: `${supplementaires} plateforme(s) supplémentaire(s)`, jours: ajout })
  }

  const delai = trouve(DELAIS, d.delai)
  const soin = trouve(SOINS, d.soin)
  const coef = (delai?.coef ?? 1) * (soin?.coef ?? 1)
  jours = jours * coef

  const joursMin = Math.round(jours * 0.9)
  const joursMax = Math.round(jours * 1.1)
  const jps = TARIFS.joursParSemaine

  // Le budget est calculé sur la charge CENTRALE, pas sur les bornes.
  // Multiplier l'incertitude de périmètre (±10 %) par celle du taux
  // donnerait une fourchette de facteur deux : vraie mathématiquement,
  // inutilisable commercialement. Ici la fourchette de charge dit
  // l'incertitude de périmètre, celle de budget dit le taux.
  const fcfaMin = Math.round((jours * TARIFS.tjmMinFcfa) / 5000) * 5000
  const fcfaMax = Math.round((jours * TARIFS.tjmMaxFcfa) / 5000) * 5000

  return {
    joursMin,
    joursMax,
    semainesMin: Math.max(1, Math.ceil(joursMin / jps)),
    semainesMax: Math.max(2, Math.ceil(joursMax / jps)),
    fcfaMin,
    fcfaMax,
    // L'euro est une commodité pour un client international : il découle
    // du franc CFA, qui reste la référence.
    euroMin: Math.round(fcfaMin / TARIFS.pariteFcfa / 10) * 10,
    euroMax: Math.round(fcfaMax / TARIFS.pariteFcfa / 10) * 10,
    detail,
    valide: true,
  }
}

/* -------------------------------------------------------------------------- */

const espace = (n: number) => n.toLocaleString('fr-FR').replace(/ /g, ' ')

export const formatEuro = (n: number) => `${espace(n)} €`
export const formatFcfa = (n: number) => `${espace(n)} FCFA`
/** Le nombre seul : pour afficher une fourchette dont l'unité est dite une fois. */
export const nombre = (n: number) => espace(n)

/** Affiche une fourchette, ou un seul nombre quand les bornes se rejoignent. */
export const plage = (min: number, max: number) =>
  min === max ? `${min}` : `${min}–${max}`

/** Référence de dossier : DV-AAMM-XXXX. Lisible, triable, non devinable. */
export function referenceDevis(d = new Date()): string {
  const aa = String(d.getFullYear()).slice(2)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const alea = Math.floor(Math.random() * 9000) + 1000
  return `DV-${aa}${mm}-${alea}`
}

/** Libellés lisibles pour l'e-mail et le récapitulatif. */
export function libelles(d: Demande) {
  return {
    nature: trouve(NATURES, d.nature)?.nom ?? '—',
    modules: d.modules.map((id) => trouve(MODULES, id)?.nom ?? id),
    plateformes: d.plateformes.map((id) => trouve(PLATEFORMES, id)?.nom ?? id),
    delai: trouve(DELAIS, d.delai)?.nom ?? '—',
    soin: trouve(SOINS, d.soin)?.nom ?? '—',
  }
}
