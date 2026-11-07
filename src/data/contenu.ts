/* ============================================================================
   CONTENU DU PORTFOLIO — source unique de vérité.
   Tout ce qui est affiché sur le site vient de ce fichier.
   Modifier ici, jamais dans les composants.
   ========================================================================== */

export const IDENTITE = {
  prenom: 'Gaël',
  nom: 'Agbé',
  nomComplet: 'Agbé Yavo Gaël Borromée',
  titre: 'Ingénieur logiciel',
  sousTitre: 'Systèmes distribués · Applications multiplateformes · Infrastructure',
  ville: 'Abidjan',
  pays: 'Côte d’Ivoire',
  fuseau: 'GMT',
  email: 'gaelagbe@gmail.com',
  github: 'https://github.com/Crameur225',
  githubPseudo: 'Crameur225',
  siteMedia: 'https://info.nextmakers.net',
  disponibilite: 'Ouvert aux missions et aux postes',
  accrocheA: 'Je construis des',
  accrocheB: 'systèmes',
  accrocheC: 'qui tiennent en production',
  manifeste:
    'Neuf plateformes livrées — de l’API Django qui orchestre quatorze modules métier au collecteur de télémétrie écrit en Go et installé en service système. Je ne livre pas une maquette : je livre un schéma de données, des workflows à états explicites, une chaîne de déploiement, et la documentation qui permet à quelqu’un d’autre de reprendre le code sans moi.',
}

export const RELEVE = [
  { valeur: 56, label: 'dépôts', detail: 'depuis juin 2023' },
  { valeur: 9, label: 'plateformes livrées', detail: 'web · mobile · infra' },
  { valeur: 9, label: 'langages en production', detail: 'TS · Dart · Python · Go · Java' },
  { valeur: 14, label: 'modules métier', detail: 'sur le seul projet LocAfrica' },
]

/* -------------------------------------------------------------------------- */
/* PROJETS                                                                     */
/* -------------------------------------------------------------------------- */

export type Noeud = { nom: string; detail?: string; accent?: boolean }
export type Couche = { titre: string; noeuds: Noeud[] }
export type Diagramme = { legende: string; couches: Couche[] }

export type Projet = {
  ref: string
  nom: string
  categorie: string
  annee: string
  statut: string
  statutTon: 'prod' | 'actif' | 'livre'
  accroche: string
  resume: string
  role: string
  specs: { cle: string; valeur: string }[]
  faits: string[]
  stack: string[]
  depots: { nom: string; langue: string; poids?: string; prive: boolean }[]
  /** Quand le code appartient au client et n'est pas publié. */
  codeClient?: string
  diagramme: Diagramme
  lien?: string
}

export const PROJETS: Projet[] = [
  {
    ref: 'LA-01',
    nom: 'LocAfrica',
    categorie: 'Plateforme métier multi-rôles',
    annee: '2026',
    statut: 'En production',
    statutTon: 'prod',
    accroche: 'Location immobilière en Côte d’Ivoire. Quatorze modules métier, cinq rôles, quatre clients.',
    resume:
      'API REST Django qui pilote toute la chaîne de location : le propriétaire soumet son bien, un gestionnaire valide le dossier documentaire, un agent se déplace et remplit une enquête terrain avec photos, le bien est publié, un client demande une visite, le contrat est généré. Trois applications Flutter distinctes consomment la même API selon le rôle.',
    role: 'Architecture · backend · clients mobiles · chaîne de déploiement',
    specs: [
      { cle: 'Backend', valeur: 'Django REST Framework' },
      { cle: 'Base de données', valeur: 'PostgreSQL 14' },
      { cle: 'Cache & files', valeur: 'Redis' },
      { cle: 'Tâches planifiées', valeur: 'Celery + Celery Beat' },
      { cle: 'Temps réel', valeur: 'WebSocket (ASGI)' },
      { cle: 'Push mobile', valeur: 'Firebase FCM' },
      { cle: 'Clients', valeur: '3 apps Flutter + web' },
      { cle: 'Livraison', valeur: 'Docker + GitHub Actions' },
      { cle: 'Volume', valeur: '1,16 Mo de Python' },
    ],
    faits: [
      'Quatorze applications métier isolées : biens, validations, enquêtes, visites, contrats, réclamations, messagerie, partenaires, notifications, audit, zones, tableaux de bord, comptes, adresses.',
      'Cinq rôles aux permissions distinctes — client, propriétaire, agent terrain, gestionnaire, administrateur — et un tableau de bord agrégé propre à chacun.',
      'Workflows à états explicites plutôt qu’à booléens : EN_ATTENTE → DOCUMENTS_SOUMIS → VALIDÉ ou REJETÉ pour les propriétaires, AFFECTÉ → TERMINÉE → VALIDÉE pour les enquêtes terrain.',
      'Notifications sur trois canaux : in-app, WebSocket authentifié par JWT, push Firebase.',
      'Rappels de visite automatisés par Celery Beat : la veille à 08h00, deux heures avant, et relance des demandes non traitées toutes les six heures.',
      'Exports CSV et XLSX, génération des contrats de location et des rapports d’activité en PDF.',
      'Quatre fichiers de réglages séparés — base, développement, production, test. La suite de tests tourne sur SQLite en parallèle pour rester rapide.',
      'Journal d’activité dédié : qui a fait quoi, et quand.',
    ],
    stack: ['Python', 'Django REST', 'PostgreSQL', 'Redis', 'Celery', 'WebSocket', 'Flutter', 'Firebase', 'Docker'],
    depots: [
      { nom: 'loc-africa-backend', langue: 'Python', poids: '1,16 Mo', prive: true },
      { nom: 'loc-africa-mobile-and-web-user', langue: 'Dart', poids: '714 Ko', prive: true },
      { nom: 'loc-africa-mobile-and-web-agent-terrain', langue: 'Dart', poids: '290 Ko', prive: true },
      { nom: 'loc-africa-gestionnaire', langue: 'TypeScript', prive: true },
    ],
    diagramme: {
      legende: 'Une API, trois clients par rôle, traitement asynchrone découplé.',
      couches: [
        {
          titre: 'Clients',
          noeuds: [
            { nom: 'App Client', detail: 'Flutter' },
            { nom: 'App Agent terrain', detail: 'Flutter' },
            { nom: 'Console Gestionnaire', detail: 'Web' },
          ],
        },
        {
          titre: 'Service',
          noeuds: [
            { nom: 'Django REST', detail: 'JWT · 14 apps', accent: true },
            { nom: 'ASGI WebSocket', detail: 'temps réel' },
          ],
        },
        {
          titre: 'Asynchrone',
          noeuds: [
            { nom: 'Celery Worker', detail: 'e-mails · PDF' },
            { nom: 'Celery Beat', detail: 'rappels · alertes' },
          ],
        },
        {
          titre: 'Données',
          noeuds: [
            { nom: 'PostgreSQL', detail: 'métier + audit' },
            { nom: 'Redis', detail: 'broker + canaux' },
          ],
        },
        {
          titre: 'Externe',
          noeuds: [{ nom: 'Firebase FCM' }, { nom: 'Stockage médias' }],
        },
      ],
    },
  },

  {
    ref: 'AF-09',
    nom: 'Afriklance',
    categorie: 'Place de marché freelance — 4 rôles, paiement sous séquestre',
    annee: '2026',
    statut: 'En production',
    statutTon: 'prod',
    accroche: 'Mettre en relation entreprises et développeurs africains, et sécuriser l’argent entre les deux. 30 modules côté serveur.',
    resume:
      'Place de marché qui relie des entreprises à des développeurs freelances : l’entreprise publie un projet, reçoit des candidatures, signe un contrat de mission, et le paiement transite par un portefeuille sous séquestre jusqu’à la livraison. Quatre espaces distincts — entreprise, freelance, administration et centre d’appels — et les moyens de paiement réellement utilisés sur le continent : Orange Money, MTN Money, Moov Money, Wave et CinetPay.',
    role: 'Architecture · backend NestJS · front Angular SSR · paiements · exploitation',
    specs: [
      { cle: 'Front', valeur: 'Angular 21 + SSR' },
      { cle: 'État', valeur: 'NgRx Signals' },
      { cle: 'Backend', valeur: 'NestJS — 30 modules' },
      { cle: 'Temps réel', valeur: 'Socket.IO' },
      { cle: 'Paiement', valeur: 'CinetPay · Orange · MTN · Moov · Wave' },
      { cle: 'Supervision', valeur: 'Sentry' },
      { cle: 'Tests', valeur: 'Vitest' },
      { cle: 'Processus', valeur: 'PM2 · Docker' },
      { cle: 'Volume', valeur: '1,4 Mo TS (front) · 984 Ko TS (API)' },
    ],
    faits: [
      'Quatre espaces aux parcours entièrement séparés : entreprise (publier, candidatures, contrats, suivi, portefeuille), freelance (alertes, propositions, missions, évaluations, portefeuille), administration, et un centre d’appels avec sa propre interface de litiges.',
      'Trente modules côté serveur, dont portefeuille, retrait, facture, reçu et audit financier — l’argent a sa propre chaîne de modules, séparée du métier, parce que c’est la partie qu’on ne peut pas se permettre de rater.',
      'Paiement sous séquestre : les fonds de l’entreprise sont bloqués à la commande et libérés à la livraison, ce qui est la seule façon de créer de la confiance entre deux inconnus.',
      'Cinq moyens de paiement du marché africain plutôt qu’une carte bancaire : Orange Money, MTN Money, Moov Money, Wave et CinetPay.',
      'Vérification d’identité intégrée à l’administration (contrôle des pièces), parrainage et fidélité, modération et blocage de comptes.',
      'Messagerie temps réel par Socket.IO entre entreprise et freelance, avec notifications et suivi de mission.',
      'Rendu côté serveur avec Angular SSR : les pages projets et profils de développeurs sont indexables, ce qui compte pour une place de marché.',
      'Erreurs de production remontées à Sentry, et génération automatisée des documents légaux et du logo par des scripts outillés.',
    ],
    stack: ['Angular 21', 'SSR', 'NgRx Signals', 'NestJS', 'TypeScript', 'Socket.IO', 'CinetPay', 'Sentry', 'Tailwind 4', 'Vitest', 'PM2', 'Docker'],
    depots: [
      { nom: 'presentation-entreprise', langue: 'TypeScript', poids: '1,4 Mo', prive: true },
      { nom: 'backend-presentation-entreprise', langue: 'TypeScript', poids: '984 Ko', prive: true },
    ],
    diagramme: {
      legende: 'Les fonds sont bloqués à la commande et libérés à la livraison.',
      couches: [
        {
          titre: 'Espaces',
          noeuds: [
            { nom: 'Entreprise', detail: 'publier · recruter' },
            { nom: 'Freelance', detail: 'postuler · livrer' },
            { nom: 'Administration', detail: 'identité · finance' },
            { nom: 'Centre d’appels', detail: 'litiges · support' },
          ],
        },
        { titre: 'Front', noeuds: [{ nom: 'Angular 21 SSR', detail: 'NgRx Signals', accent: true }] },
        { titre: 'Service', noeuds: [{ nom: 'NestJS', detail: '30 modules' }, { nom: 'Socket.IO', detail: 'messagerie' }] },
        { titre: 'Argent', noeuds: [{ nom: 'Portefeuille sous séquestre', detail: 'retrait · facture · audit', accent: true }] },
        {
          titre: 'Paiement',
          noeuds: [{ nom: 'CinetPay' }, { nom: 'Orange Money' }, { nom: 'MTN' }, { nom: 'Moov' }, { nom: 'Wave' }],
        },
      ],
    },
  },

  {
    ref: 'OS-02',
    nom: 'OSIS db-monitor',
    categorie: 'Infrastructure & observabilité',
    annee: '2026',
    statut: 'En production',
    statutTon: 'prod',
    accroche: 'Télémétrie multi-SGBD en Go. Trois binaires, deux topologies, six moteurs.',
    resume:
      'Collecteur de métriques pour PostgreSQL, MySQL, MongoDB, Redis, SQLite et Oracle, accompagné d’une API de supervision et d’un agent installable en service système. La décision d’architecture centrale : un agent co-porté sur l’hôte de la base, parce que c’est le seul moyen de mesurer honnêtement CPU, RAM et IOPS — et le seul qui fonctionne derrière un pare-feu client qui n’accepte aucune connexion entrante.',
    role: 'Conception · trois binaires · packaging multi-OS · déploiement',
    specs: [
      { cle: 'Langage', valeur: 'Go' },
      { cle: 'Binaires', valeur: '3 — agent, api, cli' },
      { cle: 'Moteurs couverts', valeur: '6' },
      { cle: 'Exposition', valeur: 'Prometheus /metrics + push HTTPS' },
      { cle: 'Authentification', valeur: 'JWT + clés d’API, RBAC' },
      { cle: 'Service système', valeur: 'systemd · Windows SCM · launchd' },
      { cle: 'Restitution', valeur: 'Tableau de bord Angular' },
      { cle: 'Livraison', valeur: 'Docker + GitHub Actions' },
      { cle: 'Volume', valeur: '476 Ko de Go' },
    ],
    faits: [
      'osisgroup-agent — collecte les métriques d’une ou plusieurs bases et les expose au format Prometheus, ou les pousse vers /api/ingest authentifié par clé d’API.',
      'osisgroup-api — REST : authentification, comptes et rôles, connexions surveillées, historique, calcul des indicateurs servis au tableau de bord.',
      'osisgroup — CLI d’installation : déploie l’agent comme service système sur systemd, le gestionnaire de services Windows et launchd.',
      'Deux topologies assumées et documentées, choisies selon le réseau : polling centralisé quand l’API peut joindre la base, push par agent quand elle ne le peut pas.',
      'Les métriques système ne sont pas remontées en polling centralisé — elles décriraient la machine de l’API, pas celle de la base. Limite documentée, jamais masquée.',
      'Provisionnement PostgreSQL par scripts shell plutôt que par psql -v : la substitution de variables psql s’est révélée indisponible sur un environnement de production. Le contournement est écrit en tête de script, avec sa raison.',
      'Une connexion poussée par un agent apparaît automatiquement dans le tableau de bord au premier relevé — rien à précréer côté interface.',
      'Premier compte administrateur créé en ligne de commande, les suivants depuis l’interface ou l’API.',
    ],
    stack: ['Go', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Oracle', 'Prometheus', 'Angular', 'Docker'],
    depots: [{ nom: 'dba_osis_monitor', langue: 'Go', poids: '476 Ko', prive: true }],
    diagramme: {
      legende: 'Le push par agent est la seule topologie qui traverse un pare-feu client.',
      couches: [
        {
          titre: 'Hôte surveillé',
          noeuds: [{ nom: 'osisgroup-agent', detail: 'service système', accent: true }],
        },
        {
          titre: 'Collecte',
          noeuds: [
            { nom: 'Push HTTPS sortant', detail: '/api/ingest · clé d’API', accent: true },
            { nom: 'Polling centralisé', detail: 'drivers directs' },
          ],
        },
        {
          titre: 'Service',
          noeuds: [{ nom: 'osisgroup-api', detail: 'JWT · RBAC · KPI' }],
        },
        {
          titre: 'Moteurs',
          noeuds: [
            { nom: 'PostgreSQL' },
            { nom: 'MySQL' },
            { nom: 'MongoDB' },
            { nom: 'Redis' },
            { nom: 'SQLite' },
            { nom: 'Oracle' },
          ],
        },
        {
          titre: 'Restitution',
          noeuds: [{ nom: 'Tableau de bord Angular' }, { nom: 'Prometheus /metrics' }],
        },
      ],
    },
  },

  {
    ref: 'VZ-03',
    nom: 'Vizo',
    categorie: 'Application grand public multiplateforme',
    annee: '2026',
    statut: 'Actif — développement continu',
    statutTon: 'actif',
    accroche: 'Finances personnelles. Flutter, cinq langues, abonnements Play, 3,3 Mo de Dart.',
    resume:
      'Suivi de dépenses et de revenus avec budgets multi-méthodes, suivi d’investissements, gamification et récapitulatifs mensuels. Trois surfaces pour un même produit : l’application Flutter sur Android, iOS et web, une API Node/Express, et une console d’administration React/TypeScript.',
    role: 'Produit complet — mobile · API · console · facturation',
    specs: [
      { cle: 'Mobile', valeur: 'Flutter / Dart' },
      { cle: 'API', valeur: 'Node.js + Express' },
      { cle: 'Base de données', valeur: 'PostgreSQL (Supabase)' },
      { cle: 'Console admin', valeur: 'React + TypeScript + Vite' },
      { cle: 'Paiements', valeur: 'Google Play Billing + webhooks' },
      { cle: 'Notifications', valeur: 'Firebase + tâches de fond' },
      { cle: 'Langues', valeur: 'fr · en · es · de · zh' },
      { cle: 'Volume', valeur: '3,3 Mo Dart · 500 Ko JS · 392 Ko TS' },
    ],
    faits: [
      'Facturation par abonnement de bout en bout : playBilling, entitlementService, subscriptionSchema, webhooks Google Play, et un middleware requirePlus qui garde les routes payantes côté serveur — jamais côté client.',
      'Internationalisation réelle en cinq langues via fichiers ARB et localisations générées, chinois compris.',
      'Notifications en arrière-plan sur un isolate dédié, avec des règles de déclenchement et une tonalité de rappel couvertes par des tests unitaires.',
      'Gamification : badges, insights personnalisés, récapitulatif mensuel calculé côté serveur.',
      'Téléversement et traitement des reçus, exports de données, vérification par OTP, et suppression de compte conforme.',
      'Les services sensibles ont des tests : droits d’accès, notifications, facturation, règles d’annonces, réponses de profil.',
      'Thèmes construits dynamiquement, catalogues de devises et de pays séparés du code métier.',
      'Limitation de débit, CORS et authentification administrateur isolés en middlewares distincts.',
    ],
    stack: ['Flutter', 'Dart', 'Node.js', 'Express', 'PostgreSQL', 'Supabase', 'React', 'TypeScript', 'Firebase'],
    depots: [
      { nom: 'vizo_frontend', langue: 'Dart', poids: '3,3 Mo', prive: true },
      { nom: 'vizo_backend', langue: 'JavaScript', poids: '500 Ko', prive: true },
      { nom: 'frontend_globale_vizo', langue: 'TypeScript', poids: '392 Ko', prive: true },
      { nom: 'privacy-vizo', langue: 'JavaScript', prive: true },
    ],
    diagramme: {
      legende: 'Les droits payants sont vérifiés côté serveur, jamais dans l’application.',
      couches: [
        {
          titre: 'Surfaces',
          noeuds: [
            { nom: 'App Flutter', detail: 'Android · iOS · web', accent: true },
            { nom: 'Console admin', detail: 'React + Vite' },
          ],
        },
        {
          titre: 'API',
          noeuds: [
            { nom: 'Express', detail: 'auth · rate limit' },
            { nom: 'Entitlements', detail: 'requirePlus', accent: true },
          ],
        },
        {
          titre: 'Services',
          noeuds: [
            { nom: 'Notifications', detail: 'règles testées' },
            { nom: 'Récap mensuel' },
            { nom: 'Reçus & exports' },
          ],
        },
        {
          titre: 'Données',
          noeuds: [{ nom: 'PostgreSQL', detail: 'Supabase' }],
        },
        {
          titre: 'Externe',
          noeuds: [
            { nom: 'Google Play Billing', detail: 'webhooks' },
            { nom: 'Firebase', detail: 'push' },
          ],
        },
      ],
    },
  },

  {
    ref: 'WZ-04',
    nom: 'WozoLab Waste',
    categorie: 'Économie circulaire — mission freelance de bout en bout',
    annee: '2026',
    statut: 'Livré',
    statutTon: 'livre',
    accroche: 'Une seule personne sur toute la chaîne : le modèle de classification, l’application mobile, l’API et le back-office.',
    resume:
      'Plateforme de gestion des déchets et d’économie circulaire pour Wozo Lab Group. Le déchet est identifié par un modèle de classification plutôt que par une saisie manuelle — parce qu’un utilisateur ne sait pas toujours dans quelle catégorie ranger ce qu’il jette —, puis suivi jusqu’à sa valorisation. Mission freelance sur l’ensemble des couches : modèle et API Python, application mobile Flutter, service Node/Express, tableau de bord React/TypeScript.',
    role: 'Mission freelance — IA · mobile · API · back-office',
    specs: [
      { cle: 'Client', valeur: 'Wozo Lab Group' },
      { cle: 'Mission', valeur: 'Freelance, chaîne complète' },
      { cle: 'Classification', valeur: 'Python — modèle exposé en API' },
      { cle: 'Mobile', valeur: 'Flutter / Dart' },
      { cle: 'API métier', valeur: 'Node.js + Express' },
      { cle: 'Back-office', valeur: 'React + TypeScript' },
      { cle: 'Domaine', valeur: 'Déchets, économie circulaire' },
    ],
    faits: [
      'Chaîne complète livrée par un seul intervenant : le modèle, l’application mobile, l’API et le tableau de bord. Aucune couture entre les couches, et un seul interlocuteur pour le client.',
      'Le tri repose sur un modèle de classification, pas sur un formulaire : l’utilisateur n’a pas à connaître la nomenclature des déchets pour que le flux soit correctement catégorisé.',
      'Le modèle est exposé derrière une API dédiée, séparée de l’API métier — il peut être réentraîné ou remplacé sans toucher à l’application mobile.',
      'Application Flutter : une seule base de code pour Android et iOS, comme sur Vizo et LocAfrica.',
      'Tableau de bord React/TypeScript pour le suivi côté exploitant : volumes, catégories, activité.',
    ],
    stack: ['Python', 'Flutter', 'Dart', 'Node.js', 'Express', 'React', 'TypeScript'],
    depots: [],
    codeClient: 'Code propriété du client — dépôt non public.',
    lien: 'https://wozolabgroup.com',
    diagramme: {
      legende: 'Le modèle est isolé derrière sa propre API : il évolue sans toucher au mobile.',
      couches: [
        { titre: 'Utilisateur', noeuds: [{ nom: 'App mobile', detail: 'Flutter · Android · iOS', accent: true }] },
        { titre: 'Classification', noeuds: [{ nom: 'API de classification', detail: 'Python', accent: true }] },
        { titre: 'Service', noeuds: [{ nom: 'API métier', detail: 'Node.js + Express' }] },
        { titre: 'Exploitation', noeuds: [{ nom: 'Back-office', detail: 'React + TypeScript' }, { nom: 'Suivi des volumes' }] },
      ],
    },
  },

  {
    ref: 'CD-05',
    nom: 'Canada Dirt Cleaning',
    categorie: 'Plateforme de services — quatre surfaces',
    annee: '2026',
    statut: 'En production',
    statutTon: 'prod',
    accroche: 'Monorepo à quatre applications : API, client, partenaire, console. 2,7 Mo de TypeScript.',
    resume:
      'Plateforme de services de nettoyage pour le marché canadien. Quatre applications versionnées et conteneurisées ensemble : l’API, l’application cliente, l’espace partenaire destiné aux prestataires, et la console d’administration. Un client mobile Flutter accompagne l’ensemble.',
    role: 'Architecture du monorepo · API · applications web · conteneurisation',
    specs: [
      { cle: 'Applications', valeur: '4 — api · app · partenaire · console' },
      { cle: 'Web', valeur: 'TypeScript' },
      { cle: 'Mobile', valeur: 'Flutter / Dart' },
      { cle: 'Outillage', valeur: 'Python · PowerShell' },
      { cle: 'Conteneurs', valeur: 'Docker' },
      { cle: 'Intégration continue', valeur: 'GitHub Actions' },
      { cle: 'Volume', valeur: '2,7 Mo TS · 645 Ko Dart' },
    ],
    faits: [
      'Quatre surfaces distinctes dans un seul dépôt : canadadirt-api, canadadirt_app, canadadirt_patner, canadadirt_console_administration.',
      'Le prestataire partenaire a son propre espace, séparé du client final et de l’administration — trois parcours, trois jeux de permissions.',
      'Monorepo conteneurisé : un Dockerfile à la racine, un pipeline GitHub Actions commun aux quatre applications.',
      'Scripts d’exploitation en Python et PowerShell pour les tâches récurrentes.',
    ],
    stack: ['TypeScript', 'Flutter', 'Dart', 'Python', 'Docker', 'GitHub Actions'],
    depots: [{ nom: 'canadadirtcleaning', langue: 'TypeScript', poids: '2,7 Mo', prive: true }],
    diagramme: {
      legende: 'Trois parcours utilisateurs, trois jeux de permissions, une seule API.',
      couches: [
        {
          titre: 'Surfaces',
          noeuds: [
            { nom: 'App client', detail: 'web + Flutter' },
            { nom: 'Espace partenaire', detail: 'prestataires', accent: true },
            { nom: 'Console admin' },
          ],
        },
        { titre: 'Service', noeuds: [{ nom: 'canadadirt-api', detail: 'TypeScript', accent: true }] },
        { titre: 'Livraison', noeuds: [{ nom: 'Docker' }, { nom: 'GitHub Actions' }] },
      ],
    },
  },

  {
    ref: 'XV-06',
    nom: 'XVibe',
    categorie: 'Backend & cadrage de projet',
    annee: '2026',
    statut: 'Livré',
    statutTon: 'livre',
    accroche: 'Spring Boot 4 / Java 21 / MongoDB Atlas. Du cahier des charges au conteneur qui tourne.',
    resume:
      'API Spring Boot documentée en OpenAPI, livrée avec son cadrage complet : cahier des charges, modules fonctionnels et non fonctionnels, estimation de charges et budget, plan d’affaires, modélisation UML. Le dépôt contient aussi un guide d’intégration front couvrant les treize endpoints, avec un client JavaScript prêt à l’emploi.',
    role: 'Cadrage · modélisation · backend · documentation · mise en production',
    specs: [
      { cle: 'Langage', valeur: 'Java 21' },
      { cle: 'Framework', valeur: 'Spring Boot 4.1.1' },
      { cle: 'Base de données', valeur: 'MongoDB Atlas' },
      { cle: 'Build', valeur: 'Maven (wrapper fourni)' },
      { cle: 'Documentation d’API', valeur: 'springdoc OpenAPI + Swagger UI' },
      { cle: 'Conteneurs', valeur: 'Docker + Compose' },
      { cle: 'Livraison', valeur: 'GitHub Actions' },
      { cle: 'Cadrage', valeur: '4 documents + UML' },
    ],
    faits: [
      'Un guide d’intégration front complet : adresses, parcours d’authentification, les treize endpoints, schémas de données, format des erreurs, et un client JavaScript prêt à coller.',
      'Un guide de déploiement qui va du dépôt vide au conteneur qui tourne, avec une section de dépannage indexée par message d’erreur.',
      'Index MongoDB documentés explicitement, pas laissés à la découverte.',
      'Quatre documents de cadrage : cahier des charges, modules fonctionnels et non fonctionnels, estimation de charges et budget, plan d’affaires.',
      'Le workflow de déploiement est à la racine du dépôt — parce que GitHub Actions ne lit les workflows nulle part ailleurs.',
    ],
    stack: ['Java 21', 'Spring Boot', 'MongoDB', 'Maven', 'OpenAPI', 'Docker', 'GitHub Actions', 'UML'],
    depots: [{ nom: 'xvibes', langue: 'Java', poids: '151 Ko', prive: true }],
    diagramme: {
      legende: 'Le contrat d’API est écrit avant le front, pas déduit après.',
      couches: [
        { titre: 'Consommateurs', noeuds: [{ nom: 'Front', detail: 'client JS fourni' }, { nom: 'Swagger UI' }] },
        { titre: 'Service', noeuds: [{ nom: 'Spring Boot 4.1.1', detail: 'Java 21 · 13 endpoints', accent: true }] },
        { titre: 'Données', noeuds: [{ nom: 'MongoDB Atlas', detail: 'index documentés' }] },
        { titre: 'Livraison', noeuds: [{ nom: 'Docker Compose' }, { nom: 'GitHub Actions' }] },
      ],
    },
  },

  {
    ref: 'NM-07',
    nom: 'NextMakers',
    categorie: 'Plateforme éditoriale & e-commerce',
    annee: '2026',
    statut: 'En production',
    statutTon: 'prod',
    accroche: 'Next.js 16 / React 19 / Prisma 7. Back-office complet et publication sociale automatique.',
    resume:
      'Média tech francophone avec catalogue de produits, newsletter et back-office complet. Rédaction en MDX avec des composants métier dédiés — encarts, tableaux comparatifs, liens d’affiliation —, édition riche TipTap, prévisualisation du rendu réel avant publication, et diffusion automatique sur les réseaux.',
    role: 'Produit complet — front · API · back-office · SEO · e-mails',
    specs: [
      { cle: 'Front', valeur: 'Next.js 16 · React 19 · Tailwind 4' },
      { cle: 'Contenu', valeur: 'MDX (remark-gfm, rehype-slug)' },
      { cle: 'Édition', valeur: 'TipTap' },
      { cle: 'API', valeur: 'Express 5 + Prisma 7' },
      { cle: 'Base de données', valeur: 'PostgreSQL' },
      { cle: 'Médias', valeur: 'Cloudinary' },
      { cle: 'E-mails', valeur: 'Resend · Nodemailer · React Email' },
      { cle: 'Réseaux', valeur: 'Twitter API v2' },
      { cle: 'SEO', valeur: 'sitemap · robots · schema.org · OG' },
    ],
    faits: [
      'Back-office protégé par middleware : articles, catégories, produits, fournisseurs, newsletter, abonnés.',
      'Prévisualisation du rendu réel avant publication, pour les articles comme pour les fiches produit.',
      'Publication sur les réseaux depuis l’administration, via l’API Twitter v2.',
      'Newsletter complète : envoi, export des abonnés, page de désinscription, e-mail de bienvenue.',
      'Images Open Graph générées à la volée depuis du SVG, sans navigateur headless.',
      'Composants MDX métier plutôt que du HTML collé : encarts, tableaux comparatifs, liens d’affiliation.',
      'Thème clair/sombre persistant, galeries produit, barre d’achat collante.',
    ],
    stack: ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind 4', 'MDX', 'Express 5', 'Prisma 7', 'PostgreSQL', 'Cloudinary', 'Resend'],
    depots: [
      { nom: 'nextmarkers', langue: 'TypeScript', poids: '233 Ko', prive: true },
      { nom: 'nextmarkers_backend', langue: 'TypeScript', poids: '44 Ko', prive: true },
    ],
    lien: 'https://info.nextmakers.net',
    diagramme: {
      legende: 'Le contenu est du MDX typé, pas du HTML dans une colonne texte.',
      couches: [
        { titre: 'Public', noeuds: [{ nom: 'Site Next.js 16', detail: 'SSR + MDX', accent: true }] },
        {
          titre: 'Administration',
          noeuds: [
            { nom: 'Back-office', detail: 'TipTap · prévisualisation' },
            { nom: 'Publication sociale', detail: 'Twitter v2' },
          ],
        },
        { titre: 'Service', noeuds: [{ nom: 'Express 5 + Prisma 7' }] },
        { titre: 'Données', noeuds: [{ nom: 'PostgreSQL' }, { nom: 'Cloudinary', detail: 'médias' }] },
        { titre: 'Sortie', noeuds: [{ nom: 'Resend', detail: 'newsletter' }, { nom: 'Images OG', detail: 'SVG → PNG' }] },
      ],
    },
  },

  {
    ref: 'FR-08',
    nom: 'Détection de fraude',
    categorie: 'Apprentissage automatique — OSIS Group',
    annee: '2025',
    statut: 'Livré',
    statutTon: 'livre',
    accroche: 'Pipeline de classification sur données déséquilibrées, avec interface de scoring.',
    resume:
      'Détection de transactions frauduleuses développée pendant mon stage en intelligence artificielle chez OSIS Group. La difficulté réelle n’est pas le modèle mais le déséquilibre des classes : la fraude est rare, et un classifieur naïf atteint 99 % de justesse en ne détectant rien du tout. Le pipeline traite ce problème explicitement, et chaque étape est sérialisée pour être rejouée à l’identique à l’inférence.',
    role: 'Préparation des données · pipeline · entraînement · évaluation · interface',
    specs: [
      { cle: 'Langage', valeur: 'Python' },
      { cle: 'Déséquilibre', valeur: 'SMOTE (suréchantillonnage)' },
      { cle: 'Prétraitement', valeur: 'imputation + mise à l’échelle' },
      { cle: 'Sélection', valeur: 'sélecteur de variables sérialisé' },
      { cle: 'Évaluation', valeur: 'métriques persistées' },
      { cle: 'Restitution', valeur: 'application de scoring' },
    ],
    faits: [
      'Chaque étape du pipeline est sérialisée séparément — imputeur, mise à l’échelle, sélecteur de variables, SMOTE, modèle — pour que l’inférence applique exactement les transformations de l’entraînement.',
      'SMOTE appliqué au déséquilibre des classes : sur un jeu de données de fraude, la justesse brute est un indicateur trompeur.',
      'Les métriques de performance sont persistées avec le modèle, pas seulement affichées en fin d’entraînement.',
      'Interface de scoring livrée avec le modèle, pour que le résultat soit utilisable sans ouvrir un notebook.',
    ],
    stack: ['Python', 'scikit-learn', 'SMOTE', 'pandas'],
    depots: [{ nom: 'osis_projet_detection_fraude', langue: 'Python', poids: '33 Ko', prive: false }],
    diagramme: {
      legende: 'Les transformations de l’entraînement sont rejouées à l’identique à l’inférence.',
      couches: [
        { titre: 'Entrée', noeuds: [{ nom: 'Transactions', detail: 'jeu déséquilibré' }] },
        {
          titre: 'Prétraitement',
          noeuds: [{ nom: 'Imputation' }, { nom: 'Mise à l’échelle' }, { nom: 'Sélection de variables' }],
        },
        { titre: 'Rééquilibrage', noeuds: [{ nom: 'SMOTE', detail: 'classe minoritaire', accent: true }] },
        { titre: 'Modèle', noeuds: [{ nom: 'Classifieur', detail: 'métriques persistées' }] },
        { titre: 'Sortie', noeuds: [{ nom: 'Interface de scoring' }] },
      ],
    },
  },

]

/* -------------------------------------------------------------------------- */
/* MATIÈRE — la stack, avec le contexte réel d'utilisation                     */
/* -------------------------------------------------------------------------- */

export type Famille = {
  titre: string
  code: string
  entrees: { nom: string; contexte: string }[]
}

export const MATIERE: Famille[] = [
  {
    titre: 'Backend & API',
    code: 'M-01',
    entrees: [
      { nom: 'Django REST', contexte: 'LocAfrica — 14 apps, 5 rôles, workflows à états' },
      { nom: 'Spring Boot 4 · Java 21', contexte: 'XVibe — 13 endpoints documentés OpenAPI' },
      { nom: 'Node.js · Express 5', contexte: 'Vizo, NextMakers — facturation, webhooks' },
      { nom: 'NestJS', contexte: 'Afriklance — 30 modules, séquestre, audit financier' },
      { nom: 'Go', contexte: 'OSIS db-monitor — 3 binaires, service système' },
      { nom: 'Prisma 7', contexte: 'NextMakers — schéma typé, migrations' },
    ],
  },
  {
    titre: 'Interfaces',
    code: 'M-02',
    entrees: [
      { nom: 'Next.js 16 · React 19', contexte: 'NextMakers — SSR, MDX, back-office' },
      { nom: 'Angular 21 + SSR', contexte: 'Afriklance — pages indexables, NgRx Signals' },
      { nom: 'Flutter · Dart', contexte: 'Vizo, LocAfrica, Canada Dirt — Android, iOS, web' },
      { nom: 'TypeScript', contexte: 'Partout, en mode strict' },
      { nom: 'Tailwind 4 · CSS natif', contexte: 'Design systems maison' },
    ],
  },
  {
    titre: 'Données',
    code: 'M-03',
    entrees: [
      { nom: 'PostgreSQL', contexte: 'LocAfrica, Vizo, NextMakers' },
      { nom: 'MongoDB Atlas', contexte: 'XVibe — index documentés' },
      { nom: 'Redis', contexte: 'Broker Celery + canaux WebSocket' },
      { nom: 'Supabase', contexte: 'Vizo — PostgreSQL managé' },
      { nom: 'MySQL · Oracle · SQLite', contexte: 'Couverts par le collecteur db-monitor' },
    ],
  },
  {
    titre: 'Exploitation',
    code: 'M-04',
    entrees: [
      { nom: 'Docker · Compose', contexte: 'Tous les backends livrés' },
      { nom: 'GitHub Actions', contexte: 'CI/CD sur LocAfrica, XVibe, OSIS, Canada Dirt' },
      { nom: 'Celery · Celery Beat', contexte: 'Rappels, alertes, exports asynchrones' },
      { nom: 'Prometheus', contexte: 'Exposition des métriques de l’agent' },
      { nom: 'PM2 · systemd · launchd', contexte: 'Processus et services système' },
    ],
  },
  {
    titre: 'Intégrations',
    code: 'M-05',
    entrees: [
      { nom: 'Google Play Billing', contexte: 'Vizo — abonnements, webhooks, entitlements' },
      { nom: 'Firebase FCM', contexte: 'Push LocAfrica et Vizo' },
      { nom: 'Cloudinary', contexte: 'Médias NextMakers' },
      { nom: 'Resend · Nodemailer', contexte: 'Transactionnel et newsletter' },
      { nom: 'CinetPay & mobile money', contexte: 'Afriklance — Orange, MTN, Moov, Wave' },
      { nom: 'Socket.IO', contexte: 'Afriklance — messagerie temps réel' },
      { nom: 'Sentry', contexte: 'Afriklance — erreurs de production' },
      { nom: 'Twitter API v2', contexte: 'Publication sociale automatique' },
    ],
  },
  {
    titre: 'Données & IA',
    code: 'M-06',
    entrees: [
      { nom: 'scikit-learn · SMOTE', contexte: 'Détection de fraude — classes déséquilibrées' },
      { nom: 'pandas', contexte: 'Préparation et exploration' },
      { nom: 'Classification d’images', contexte: 'API de tri de déchets' },
      { nom: 'Python', contexte: 'Backend Django et pipelines de données' },
    ],
  },
]

/* -------------------------------------------------------------------------- */
/* MÉTHODE                                                                     */
/* -------------------------------------------------------------------------- */

export const METHODE = [
  {
    num: '01',
    titre: 'Cadrage',
    duree: '3 à 8 jours',
    texte:
      'Avant toute ligne de code : le périmètre fonctionnel, les rôles et leurs permissions, le modèle de données, les états des workflows. Sur XVibe, cela a donné quatre documents — cahier des charges, modules, estimation de charges, plan d’affaires — et la modélisation UML. C’est le moment où l’on découvre qu’un écran suppose une table qui n’existe pas.',
  },
  {
    num: '02',
    titre: 'Fondations',
    duree: '1 à 3 semaines',
    texte:
      'Schéma de base de données, authentification, permissions par rôle, conteneurisation et pipeline de déploiement — avant les écrans. Un projet qui n’est pas déployable à la fin de la deuxième semaine ne le sera jamais sans douleur.',
  },
  {
    num: '03',
    titre: 'Construction',
    duree: 'par incréments livrables',
    texte:
      'Module par module, chacun déployé dès qu’il est fonctionnel. Les règles sensibles — droits payants, permissions, transitions d’état — sont couvertes par des tests, parce que ce sont celles qui coûtent cher quand elles cassent. Vous voyez le produit avancer, pas un rapport d’avancement.',
  },
  {
    num: '04',
    titre: 'Passation',
    duree: 'incluse',
    texte:
      'Documentation d’intégration, guide de déploiement avec dépannage par message d’erreur, variables d’environnement d’exemple, et les décisions d’architecture écrites avec leur raison. Un projet est fini quand quelqu’un d’autre peut le reprendre sans moi.',
  },
]

/* -------------------------------------------------------------------------- */
/* PARCOURS                                                                    */
/* -------------------------------------------------------------------------- */

export const PARCOURS = [
  {
    periode: '2025 — 2026',
    titre: 'Ingénieur logiciel',
    lieu: 'Indépendant · OSIS Group',
    texte:
      'Conception et livraison de plateformes complètes : LocAfrica, OSIS db-monitor, Vizo, Canada Dirt Cleaning, XVibe, NextMakers. Backend, mobile, infrastructure et mise en production.',
    courant: true,
  },
  {
    periode: 'Février — Août 2025',
    titre: 'Stage — Intelligence artificielle',
    lieu: 'OSIS Group',
    texte:
      'Pipeline de détection de transactions frauduleuses : préparation des données, traitement du déséquilibre des classes par SMOTE, entraînement, évaluation, et interface de scoring livrée avec le modèle.',
  },
  {
    periode: 'Sept. 2023 — Avril 2024',
    titre: 'Responsable téléconseiller',
    lieu: 'IST JOB',
    texte:
      'Gestion de la relation client et encadrement d’équipe. Un an passé à traduire des besoins d’utilisateurs en demandes exploitables — ce que je fais encore, autrement.',
  },
  {
    periode: 'Avril — Sept. 2023',
    titre: 'Stage — Développement web',
    lieu: 'EXPERTISE PDCP',
    texte: 'Conception et réalisation d’un site e-learning.',
  },
  {
    periode: '2024',
    titre: 'Certifications',
    lieu: 'Udemy',
    texte: 'React + Redux · Node.js — parcours complets, certifiés.',
  },
  {
    periode: '2020 — 2022',
    titre: 'BTS Informatique — Développeur d’applications',
    lieu: 'Centre International de Formation des Cadres',
    texte: 'Brevet de technicien supérieur, option développement d’applications.',
  },
  {
    periode: '2019 — 2020',
    titre: 'Baccalauréat série D',
    lieu: 'Lycée Moderne Djédji Amondji Pierre, Adjamé',
    texte: 'Série scientifique.',
  },
]

/* -------------------------------------------------------------------------- */
/* BANDEAU DÉFILANT                                                            */
/* -------------------------------------------------------------------------- */

export const BANDEAU = [
  'Django REST',
  'Go',
  'Flutter',
  'Next.js 16',
  'Spring Boot 4',
  'PostgreSQL',
  'Celery',
  'MongoDB',
  'Docker',
  'React 19',
  'Angular 21',
  'NestJS',
  'Socket.IO',
  'Redis',
  'Prisma 7',
  'WebSocket',
  'Prometheus',
  'TypeScript',
  'Python',
  'Java 21',
  'Firebase',
  'GitHub Actions',
]
