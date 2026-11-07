# Atelier — portfolio d'ingénierie

Portfolio de **Agbé Yavo Gaël Borromée**, ingénieur logiciel.
Next.js 16 · React 19 · TypeScript strict · CSS natif, aucune dépendance d'interface.

---

## Démarrer

```bash
npm install
cp .env.example .env.local   # puis remplir (voir plus bas)
npm run dev                  # http://localhost:3000
```

Mise en production :

```bash
npm run build
npm start
```

---

## Où modifier quoi

Tout le contenu est séparé du rendu. Dans la quasi-totalité des cas, tu n'as
qu'un seul fichier à toucher.

| Tu veux changer… | Fichier |
|---|---|
| Ton nom, ton titre, l'accroche, le manifeste, les coordonnées | `src/data/contenu.ts` → `IDENTITE` |
| Les quatre grands chiffres du relevé | `src/data/contenu.ts` → `RELEVE` |
| **Ajouter ou modifier un projet** | `src/data/contenu.ts` → `PROJETS` |
| L'illustration d'un projet | `src/lib/planches.ts` (voir plus bas) |
| La stack et son contexte d'emploi | `src/data/contenu.ts` → `MATIERE` |
| Les quatre étapes de la méthode | `src/data/contenu.ts` → `METHODE` |
| Formation et expérience | `src/data/contenu.ts` → `PARCOURS` |
| Le bandeau défilant | `src/data/contenu.ts` → `BANDEAU` |
| **Les tarifs du devis** | `src/lib/estimation.ts` → `TARIFS` |
| Les types de projet, modules, coefficients | `src/lib/estimation.ts` |
| Les couleurs, la typographie, les espacements | `src/app/atelier.css` → section `1. JETONS` |

### Ajouter un projet

Copie un bloc existant dans `PROJETS` et renseigne-le. Le schéma d'architecture
se dessine tout seul à partir de `diagramme.couches` : chaque couche est une
rangée, chaque nœud une boîte, et `accent: true` met un nœud en évidence.

Deux champs facultatifs :
- `codeClient` — remplace la liste des dépôts quand le code appartient au client
  (c'est le cas de WozoLab Waste).
- `lien` — ajoute un bouton « Voir en production ».

### Les illustrations

Chaque projet a une **planche dessinée**, pas une capture d'écran. Elles sont
dans `src/lib/planches.ts`, générées en SVG et pilotées par les variables CSS :
elles suivent donc le thème clair et le thème sombre toutes seules.

Huit types de planche existent (`workflow`, `telemetrie`, `surfaces`, `nuage`,
`contrat`, `pile`, `circuit`, `place`). Chacune montre quelque chose de **vrai** sur le
projet : la planche de la détection de fraude dessine le vrai déséquilibre des
classes (150 points normaux contre 7 fraudes, plus les points SMOTE
interpolés entre deux fraudes réelles), celle de LocAfrica ses vrais états.

Pour illustrer un nouveau projet, ajoute une entrée dans `CORPS` à la fin du
fichier, en réutilisant un des types existants :

```ts
'XX-10': surfaces('XX-10', ['WEB', 'MOBILE'], 'MON API'),
```

Un projet sans entrée dans `CORPS` s'affiche simplement sans planche — rien ne
casse.

Chaque planche apparaît à deux endroits : en **vignette** dans l'index (le texte
du SVG y est masqué par CSS, illisible à cette taille), et en grand dans la
fiche. Dans la fiche, la planche est un **bouton** : le schéma d'architecture
est masqué au départ et se révèle au clic.

### Numérotation

Les numéros affichés (01, 02, …) sont calculés à partir de la **position** dans
le tableau `PROJETS`, pas stockés. Réordonner les projets suffit : il n'y a
jamais rien à renuméroter. Les `ref` (`LA-01`, `AF-09`, …) sont des codes
d'identité stables, indépendants de l'ordre — ce sont eux qui lient un projet à
sa planche dans `planches.ts`.

---

## ⚠️ À régler avant la mise en ligne

### 1. Les tarifs

Les taux dans `src/lib/estimation.ts` sont **des hypothèses de départ**, pas tes
tarifs :

```ts
export const TARIFS = {
  tjmMin: 180,  // euros / jour
  tjmMax: 280,
  ...
}
```

Ajuste-les à ta réalité commerciale. Les charges en jours de `NATURES` et
`MODULES` méritent aussi une relecture : ce sont des ordres de grandeur
cohérents avec tes projets, à affiner avec ton expérience réelle.

### 2. L'adresse du site

`NEXT_PUBLIC_SITE_URL` alimente les métadonnées, le sitemap et robots.txt.
Sans elle, le site retombe sur `https://agbe.dev` — remplace par ton domaine.

---

## Le devis

Parcours en cinq étapes (nature → périmètre → contraintes → coordonnées →
récapitulatif) avec un bordereau qui recalcule la charge, le planning et la
fourchette de budget à chaque clic. Montants affichés en euros et en francs CFA.

**Le calcul est rejoué côté serveur.** `POST /api/devis` ne retient du corps de
la requête que des identifiants présents au catalogue, puis appelle le même
`estimer()` que le navigateur. Un montant envoyé par le client n'est jamais
retenu. La route applique aussi une limitation de débit (5 demandes par IP et
par 10 minutes, en mémoire — à remplacer par Redis si tu passes sur plusieurs
instances).

### Acheminement des demandes

| Configuration | Comportement |
|---|---|
| `RESEND_API_KEY` **et** `DEVIS_EXPEDITEUR` renseignés | E-mail envoyé à `DEVIS_DESTINATAIRE`, avec `replyTo` sur le demandeur |
| L'un des deux manque, ou l'envoi échoue | La demande est écrite dans `./demandes/devis.log` |

Une demande n'est jamais perdue : si l'e-mail échoue, le journal prend le
relais, et si le journal échoue, la console. Pense tout de même à configurer
Resend avant la mise en ligne — personne ne lit les logs d'un serveur.

`DEVIS_EXPEDITEUR` doit être un domaine vérifié chez Resend, au format
`Devis <devis@tondomaine.com>`.

---

## Déploiement

### Vercel (le plus direct)

```bash
npx vercel
```

Déclare les variables d'environnement dans l'interface Vercel. Attention : sur
Vercel, le système de fichiers est en lecture seule — le repli vers
`demandes/devis.log` ne fonctionnera pas. Configure Resend.

### Serveur autonome

```bash
npm ci && npm run build
npm start   # écoute sur $PORT, 3000 par défaut
```

Place-le derrière Nginx ou Caddy pour le TLS.

---

## Choix techniques, et pourquoi

- **CSS natif, pas Tailwind.** Le design repose sur des détails que les classes
  utilitaires rendent pénibles : grille de calque en arrière-plan fixe, cotes de
  mesure en pseudo-éléments, conducteurs pointillés, marques de repérage dans
  les angles. Un fichier de jetons CSS donne plus de contrôle et zéro poids de
  dépendance.
- **`next/font`, pas de lien vers Google Fonts.** Les quatre familles (Anton,
  Archivo, JetBrains Mono, Instrument Serif) sont servies depuis le même
  domaine : pas de requête tierce, pas de décalage de mise en page.
- **Thème appliqué avant la première peinture.** Un petit script en `<head>`
  lit le thème enregistré pour éviter le clignotement clair → sombre.
- **Accessibilité.** Navigation au clavier, `aria-expanded` sur les fiches,
  `aria-pressed` sur les options du devis, contraste conforme dans les deux
  thèmes, et `prefers-reduced-motion` respecté (animations coupées).
- **Les composants serveur restent serveur.** Seuls `Chrome`, `Primitives`,
  `Travaux` et `Devis` sont `'use client'` — le reste est rendu côté serveur.

---

## Structure

```
src/
├── app/
│   ├── layout.tsx         métadonnées, polices, JSON-LD, thème
│   ├── page.tsx           assemblage des sections
│   ├── atelier.css        tout le style, en 21 sections numérotées
│   ├── icon.svg           favicon
│   ├── robots.ts  sitemap.ts
│   └── api/devis/route.ts validation, recalcul, acheminement
├── components/
│   ├── Chrome.tsx         rail latéral, barre haute, thème, suivi de section
│   ├── Primitives.tsx     révélation, compteurs, tête de section, schémas
│   ├── Seuil.tsx          accroche, bandeau, relevé
│   ├── Travaux.tsx        index + fiches techniques
│   ├── Atelier.tsx        matière, méthode, parcours
│   ├── Devis.tsx          parcours en cinq étapes + bordereau
│   └── Pied.tsx           contact
├── data/contenu.ts        ← tout le contenu
└── lib/estimation.ts      ← tous les tarifs
```
