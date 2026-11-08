/* ============================================================================
   PLANCHES — l'illustration de chaque projet.
   ---------------------------------------------------------------------------
   Pas d'images matricielles, pas de captures d'écran : chaque projet reçoit
   une planche dessinée qui montre quelque chose de VRAI sur son architecture.
   Le schéma de fraude montre réellement le déséquilibre des classes, celui de
   LocAfrica ses vrais états, celui d'OSIS ses six moteurs.

   Les couleurs passent par les variables CSS : les planches suivent donc le
   thème clair et le thème sombre sans duplication.

   Chaque fonction rend une chaîne SVG. Le même fichier sert au site Next.js
   et à la version publiée en ligne, pour que les deux soient identiques.
   ========================================================================== */

const VB = { l: 400, h: 240 }

/** Générateur déterministe : la même planche à chaque rendu, serveur compris. */
function alea(graine: number) {
  let s = graine
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
}

const grille = () => {
  let d = ''
  for (let x = 0; x <= VB.l; x += 20) d += `M${x} 0V${VB.h}`
  for (let y = 0; y <= VB.h; y += 20) d += `M0 ${y}H${VB.l}`
  return `<path d="${d}" stroke="var(--trait)" stroke-width=".5" opacity=".55" fill="none"/>`
}

const cartouche = (ref: string, titre: string) =>
  `<text x="10" y="${VB.h - 9}" font-family="var(--mono)" font-size="7.5" letter-spacing="1.4" fill="var(--sourd)">${ref}</text>` +
  `<text x="${VB.l - 10}" y="${VB.h - 9}" text-anchor="end" font-family="var(--mono)" font-size="7.5" letter-spacing="1.4" fill="var(--sourd)">${titre}</text>` +
  `<path d="M10 ${VB.h - 22}H${VB.l - 10}" stroke="var(--trait)" stroke-width=".75"/>`

const boite = (
  x: number,
  y: number,
  l: number,
  h: number,
  texte: string,
  accent = false,
) =>
  `<rect x="${x}" y="${y}" width="${l}" height="${h}" fill="${accent ? 'var(--signal-pale)' : 'var(--papier)'}" stroke="${accent ? 'var(--signal)' : 'var(--trait-fort)'}" stroke-width="1"/>` +
  `<text x="${x + l / 2}" y="${y + h / 2 + 2.6}" text-anchor="middle" font-family="var(--mono)" font-size="7.5" letter-spacing=".6" fill="${accent ? 'var(--signal)' : 'var(--encre-2)'}">${texte}</text>`

const fleche = (x1: number, y1: number, x2: number, y2: number, accent = false) => {
  const c = accent ? 'var(--signal)' : 'var(--trait-fort)'
  const a = Math.atan2(y2 - y1, x2 - x1)
  const p = 4
  return (
    `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${c}" stroke-width="1" fill="none"/>` +
    `<path d="M${x2} ${y2}L${x2 - p * Math.cos(a - 0.5)} ${y2 - p * Math.sin(a - 0.5)}M${x2} ${y2}L${x2 - p * Math.cos(a + 0.5)} ${y2 - p * Math.sin(a + 0.5)}" stroke="${c}" stroke-width="1" fill="none"/>`
  )
}

const etiquette = (x: number, y: number, t: string, ancre = 'start') =>
  `<text x="${x}" y="${y}" text-anchor="${ancre}" font-family="var(--mono)" font-size="7" letter-spacing=".9" fill="var(--sourd)">${t}</text>`

/* -------------------------------------------------------------------------- */
/* 1. WORKFLOW — des états, des transitions, une bifurcation.                 */
/* -------------------------------------------------------------------------- */

function workflow(ref: string): string {
  let s = grille()
  s += etiquette(10, 22, 'VALIDATION DU PROPRIÉTAIRE')

  s += boite(10, 32, 80, 26, 'EN ATTENTE')
  s += fleche(90, 45, 110, 45)
  s += boite(110, 32, 92, 26, 'DOCUMENTS')
  s += fleche(202, 45, 222, 45)
  s += boite(222, 32, 70, 26, 'ENQUÊTE')

  // Bifurcation : le seul endroit où le flux se divise.
  s += `<path d="M292 45H306" stroke="var(--trait-fort)" stroke-width="1" fill="none"/>`
  s += `<path d="M306 45V24M306 45V66" stroke="var(--trait-fort)" stroke-width="1" fill="none"/>`
  s += fleche(306, 24, 318, 24, true)
  s += fleche(306, 66, 318, 66)
  s += boite(318, 12, 72, 24, 'VALIDÉ', true)
  s += boite(318, 54, 72, 24, 'REJETÉ')

  s += etiquette(10, 104, 'ENQUÊTE TERRAIN')
  s += boite(10, 114, 76, 26, 'AFFECTÉ')
  s += fleche(86, 127, 106, 127)
  s += boite(106, 114, 86, 26, 'TERMINÉE')
  s += fleche(192, 127, 212, 127)
  s += boite(212, 114, 80, 26, 'VALIDÉE', true)

  // Les trois canaux de notification partent du même point.
  s += etiquette(10, 176, 'NOTIFICATION — 3 CANAUX')
  const canaux = ['IN-APP', 'WEBSOCKET', 'PUSH FCM']
  canaux.forEach((c, i) => {
    const x = 10 + i * 100
    s += `<rect x="${x}" y="184" width="88" height="20" fill="none" stroke="var(--trait-fort)" stroke-width=".75" stroke-dasharray="3 2"/>`
    s += `<text x="${x + 44}" y="197" text-anchor="middle" font-family="var(--mono)" font-size="7" letter-spacing=".6" fill="var(--sourd)">${c}</text>`
  })
  s += `<circle cx="340" cy="194" r="7" fill="var(--signal-pale)" stroke="var(--signal)" stroke-width="1"/>`
  s += `<path d="M322 194h-12" stroke="var(--signal)" stroke-width="1"/>`

  return s + cartouche(ref, 'États & transitions')
}

/* -------------------------------------------------------------------------- */
/* 2. TÉLÉMÉTRIE — trois relevés, six moteurs.                                */
/* -------------------------------------------------------------------------- */

function telemetrie(ref: string): string {
  let s = grille()
  const r = alea(2026)
  const pistes = [
    { y: 46, nom: 'CPU', accent: true },
    { y: 92, nom: 'IOPS', accent: false },
    { y: 138, nom: 'LATENCE', accent: false },
  ]

  for (const p of pistes) {
    s += etiquette(10, p.y - 20, p.nom)
    s += `<path d="M58 ${p.y + 14}H${VB.l - 12}" stroke="var(--trait)" stroke-width=".75"/>`
    let d = ''
    for (let i = 0; i <= 56; i++) {
      const x = 58 + i * ((VB.l - 70) / 56)
      const base = Math.sin(i / 4.4 + p.y) * 0.5 + 0.5
      const y = p.y + 13 - (base * 0.62 + r() * 0.38) * 26
      d += (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1)
    }
    s += `<path d="${d}" stroke="${p.accent ? 'var(--signal)' : 'var(--encre-2)'}" stroke-width="${p.accent ? 1.4 : 1}" fill="none" stroke-linejoin="round"/>`
  }

  // Six moteurs : des cylindres, la forme universelle d'une base de données.
  s += etiquette(10, 184, 'MOTEURS COUVERTS')
  const moteurs = ['PG', 'MY', 'MG', 'RD', 'SQ', 'OR']
  moteurs.forEach((m, i) => {
    const x = 12 + i * 64
    s += `<ellipse cx="${x + 22}" cy="196" rx="22" ry="5" fill="var(--papier)" stroke="var(--trait-fort)" stroke-width=".9"/>`
    s += `<path d="M${x} 196v14" stroke="var(--trait-fort)" stroke-width=".9"/>`
    s += `<path d="M${x + 44} 196v14" stroke="var(--trait-fort)" stroke-width=".9"/>`
    s += `<ellipse cx="${x + 22}" cy="210" rx="22" ry="5" fill="none" stroke="var(--trait-fort)" stroke-width=".9"/>`
    s += `<text x="${x + 22}" y="206" text-anchor="middle" font-family="var(--mono)" font-size="7.5" letter-spacing=".6" fill="var(--encre-2)">${m}</text>`
  })

  return s + cartouche(ref, 'Relevés multi-moteurs')
}

/* -------------------------------------------------------------------------- */
/* 3. SURFACES — plusieurs clients, une seule API.                            */
/* -------------------------------------------------------------------------- */

function surfaces(ref: string, noms: string[], hub: string): string {
  let s = grille()
  const n = noms.length
  const pas = (VB.l - 24) / n

  noms.forEach((nom, i) => {
    const cx = 12 + pas * i + pas / 2
    const l = Math.min(66, pas - 14)
    const x = cx - l / 2
    // Un cadre d'appareil : écran, encoche, socle.
    s += `<rect x="${x}" y="24" width="${l}" height="74" rx="4" fill="var(--papier)" stroke="var(--trait-fort)" stroke-width="1"/>`
    s += `<rect x="${x + 5}" y="34" width="${l - 10}" height="52" fill="var(--papier-2)" stroke="var(--trait)" stroke-width=".75"/>`
    s += `<path d="M${cx - 7} 29h14" stroke="var(--trait-fort)" stroke-width="1.4"/>`
    // Quelques lignes de contenu, pour que l'écran ne soit pas vide.
    for (let k = 0; k < 3; k++) {
      s += `<path d="M${x + 10} ${44 + k * 11}h${l - 20 - k * 6}" stroke="var(--trait-fort)" stroke-width="1" opacity=".5"/>`
    }
    s += `<text x="${cx}" y="112" text-anchor="middle" font-family="var(--mono)" font-size="7" letter-spacing=".8" fill="var(--sourd)">${nom}</text>`
    s += fleche(cx, 118, cx, 148)
  })

  s += `<path d="M20 150H${VB.l - 20}" stroke="var(--trait-fort)" stroke-width="1"/>`
  s += boite(VB.l / 2 - 76, 162, 152, 30, hub, true)
  s += `<path d="M${VB.l / 2} 150v12" stroke="var(--signal)" stroke-width="1"/>`

  return s + cartouche(ref, `${n} surfaces, une API`)
}

/* -------------------------------------------------------------------------- */
/* 4. NUAGE — le déséquilibre des classes, montré tel qu'il est.              */
/* -------------------------------------------------------------------------- */

function nuage(ref: string): string {
  let s = grille()
  const r = alea(7)
  const x0 = 40, y0 = 186, l = 320, h = 150

  s += `<path d="M${x0} ${y0 - h}V${y0}H${x0 + l}" stroke="var(--trait-fort)" stroke-width="1" fill="none"/>`
  s += etiquette(x0 - 6, y0 - h + 4, 'MONTANT', 'end')
  s += etiquette(x0 + l, y0 + 14, 'FRÉQUENCE', 'end')

  // Classe majoritaire : les transactions normales, très nombreuses.
  let normales = ''
  for (let i = 0; i < 150; i++) {
    const g1 = (r() + r() + r()) / 3
    const g2 = (r() + r() + r()) / 3
    const x = x0 + 14 + g1 * (l * 0.62)
    const y = y0 - 12 - g2 * (h * 0.52)
    normales += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.9" fill="var(--sourd)" opacity=".5"/>`
  }
  s += normales

  // Classe minoritaire : la fraude. Rare — c'est tout le problème.
  const fraudes: [number, number][] = []
  for (let i = 0; i < 7; i++) {
    const x = x0 + 170 + r() * 128
    const y = y0 - 78 - r() * 56
    fraudes.push([x, y])
    s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.4" fill="var(--signal)"/>`
  }

  // Points synthétiques SMOTE : interpolés ENTRE deux fraudes réelles.
  for (let i = 0; i < fraudes.length - 1; i++) {
    const t = 0.35 + r() * 0.3
    const x = fraudes[i][0] + (fraudes[i + 1][0] - fraudes[i][0]) * t
    const y = fraudes[i][1] + (fraudes[i + 1][1] - fraudes[i][1]) * t
    s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.4" fill="none" stroke="var(--signal)" stroke-width="1.1" stroke-dasharray="2 1.6"/>`
  }

  s += `<path d="M${x0 + 150} ${y0 - 6}Q${x0 + 196} ${y0 - 96} ${x0 + l - 4} ${y0 - 116}" stroke="var(--signal)" stroke-width="1" stroke-dasharray="5 3" fill="none" opacity=".75"/>`

  s += `<circle cx="${x0 + 6}" cy="30" r="3" fill="var(--sourd)" opacity=".6"/>`
  s += etiquette(x0 + 14, 33, 'NORMALES — 150')
  s += `<circle cx="${x0 + 140}" cy="30" r="3.4" fill="var(--signal)"/>`
  s += etiquette(x0 + 148, 33, 'FRAUDES — 7')
  s += `<circle cx="${x0 + 238}" cy="30" r="3.4" fill="none" stroke="var(--signal)" stroke-width="1.1" stroke-dasharray="2 1.6"/>`
  s += etiquette(x0 + 246, 33, 'SMOTE — SYNTHÉTIQUES')

  return s + cartouche(ref, 'Classes déséquilibrées')
}

/* -------------------------------------------------------------------------- */
/* 5. CONTRAT — les endpoints écrits avant le front.                          */
/* -------------------------------------------------------------------------- */

function contrat(ref: string, n: number, points: string[]): string {
  let s = grille()
  s += etiquette(10, 22, `CONTRAT D’API — ${n} ENDPOINTS`)

  // Les endpoints nommés sont détaillés, les autres restent des barres.
  for (let i = 0; i < n; i++) {
    const y = 32 + i * 13
    const nomme = i < points.length
    s += `<path d="M10 ${y}h6" stroke="${nomme ? 'var(--signal)' : 'var(--trait-fort)'}" stroke-width="${nomme ? 1.6 : 1}"/>`
    if (nomme) {
      s += `<text x="22" y="${y + 2.6}" font-family="var(--mono)" font-size="7.5" letter-spacing=".5" fill="var(--encre-2)">${points[i]}</text>`
    } else {
      s += `<path d="M22 ${y}h${48 + ((i * 29) % 56)}" stroke="var(--trait-fort)" stroke-width="3" opacity=".3"/>`
    }
  }

  s += fleche(188, 108, 224, 108, true)

  // Le conteneur, dessiné comme une pile de couches.
  s += `<rect x="234" y="42" width="152" height="132" fill="var(--papier-2)" stroke="var(--trait-fort)" stroke-width="1"/>`
  s += `<text x="310" y="58" text-anchor="middle" font-family="var(--mono)" font-size="7.5" letter-spacing="1" fill="var(--sourd)">CONTENEUR</text>`
  const couches = ['SPRING BOOT 4', 'JAVA 21 / JVM', 'MONGODB ATLAS']
  couches.forEach((c, i) => {
    s += boite(246, 68 + i * 32, 128, 24, c, i === 0)
    if (i < couches.length - 1) {
      s += `<path d="M310 ${92 + i * 32}v8" stroke="var(--trait-fort)" stroke-width="1"/>`
    }
  })
  s += `<text x="310" y="168" text-anchor="middle" font-family="var(--mono)" font-size="7" letter-spacing=".8" fill="var(--sourd)">OPENAPI · SWAGGER UI</text>`

  return s + cartouche(ref, 'Contrat avant code')
}

/* -------------------------------------------------------------------------- */
/* 6. PILE — front, service, données, sortie.                                 */
/* -------------------------------------------------------------------------- */

function pile(ref: string, bandes: { nom: string; detail: string }[], branche?: string): string {
  let s = grille()
  const h = 30
  const depart = 28

  bandes.forEach((b, i) => {
    const y = depart + i * (h + 16)
    s += `<rect x="10" y="${y}" width="268" height="${h}" fill="${i === 0 ? 'var(--signal-pale)' : 'var(--papier)'}" stroke="${i === 0 ? 'var(--signal)' : 'var(--trait-fort)'}" stroke-width="1"/>`
    s += `<text x="22" y="${y + 13}" font-family="var(--mono)" font-size="8" letter-spacing=".7" fill="${i === 0 ? 'var(--signal)' : 'var(--encre-2)'}">${b.nom}</text>`
    s += `<text x="22" y="${y + 24}" font-family="var(--mono)" font-size="6.8" letter-spacing=".6" fill="var(--sourd)">${b.detail}</text>`
    if (i < bandes.length - 1) s += fleche(144, y + h, 144, y + h + 16)
  })

  if (branche) {
    const ym = depart + h / 2
    s += `<path d="M278 ${ym}h34" stroke="var(--trait-fort)" stroke-width="1" stroke-dasharray="3 2"/>`
    s += `<rect x="312" y="${ym - 18}" width="78" height="36" fill="var(--papier-2)" stroke="var(--trait-fort)" stroke-width="1"/>`
    s += `<text x="351" y="${ym + 2.6}" text-anchor="middle" font-family="var(--mono)" font-size="7" letter-spacing=".6" fill="var(--sourd)">${branche}</text>`
  }

  return s + cartouche(ref, 'Chaîne de bout en bout')
}

/* -------------------------------------------------------------------------- */
/* 7. CIRCUIT — une boucle : collecte, tri, valorisation, récompense.         */
/* -------------------------------------------------------------------------- */

function circuit(ref: string, etapes: string[]): string {
  let s = grille()
  const cx = 150, cy = 112, rx = 108, ry = 72

  s += `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="var(--trait-fort)" stroke-width="1" stroke-dasharray="4 3"/>`

  etapes.forEach((e, i) => {
    const a = (i / etapes.length) * Math.PI * 2 - Math.PI / 2
    const x = cx + Math.cos(a) * rx
    const y = cy + Math.sin(a) * ry
    const accent = i === 0
    s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="7" fill="${accent ? 'var(--signal)' : 'var(--papier)'}" stroke="${accent ? 'var(--signal)' : 'var(--trait-fort)'}" stroke-width="1.2"/>`
    s += `<text x="${x.toFixed(1)}" y="${(y + 2.6).toFixed(1)}" text-anchor="middle" font-family="var(--mono)" font-size="7" fill="${accent ? '#fff' : 'var(--encre-2)'}">${i + 1}</text>`
    const ancre = Math.cos(a) < -0.3 ? 'end' : Math.cos(a) > 0.3 ? 'start' : 'middle'
    const dx = ancre === 'end' ? -12 : ancre === 'start' ? 12 : 0
    const dy = Math.sin(a) > 0.5 ? 18 : Math.sin(a) < -0.5 ? -12 : 3
    s += etiquette(x + dx, y + dy, e, ancre)
  })

  s += `<text x="${cx}" y="${cy - 4}" text-anchor="middle" font-family="var(--mono)" font-size="8" letter-spacing="1.2" fill="var(--sourd)">ÉCONOMIE</text>`
  s += `<text x="${cx}" y="${cy + 9}" text-anchor="middle" font-family="var(--mono)" font-size="8" letter-spacing="1.2" fill="var(--sourd)">CIRCULAIRE</text>`

  s += `<rect x="286" y="52" width="104" height="120" fill="var(--papier-2)" stroke="var(--trait-fort)" stroke-width="1"/>`
  s += `<text x="338" y="68" text-anchor="middle" font-family="var(--mono)" font-size="7" letter-spacing=".9" fill="var(--sourd)">TRI ASSISTÉ</text>`
  // Une grille de vignettes : la classification d'images, une case reconnue.
  for (let i = 0; i < 9; i++) {
    const x = 298 + (i % 3) * 28
    const y = 78 + Math.floor(i / 3) * 28
    const vu = i === 4
    s += `<rect x="${x}" y="${y}" width="22" height="22" fill="${vu ? 'var(--signal-pale)' : 'var(--papier)'}" stroke="${vu ? 'var(--signal)' : 'var(--trait-fort)'}" stroke-width="${vu ? 1.3 : '.8'}"/>`
  }
  s += `<text x="338" y="168" text-anchor="middle" font-family="var(--mono)" font-size="6.8" letter-spacing=".6" fill="var(--sourd)">CLASSIFICATION</text>`

  return s + cartouche(ref, 'Boucle de valorisation')
}

/* -------------------------------------------------------------------------- */
/* 8. PLACE DE MARCHÉ — deux parties, un séquestre entre les deux.            */
/* -------------------------------------------------------------------------- */

function place(ref: string, moyens: string[]): string {
  let s = grille()

  s += etiquette(10, 20, 'DEUX CÔTÉS, UN TIERS DE CONFIANCE')

  s += boite(10, 30, 104, 34, 'ENTREPRISE')
  s += boite(286, 30, 104, 34, 'FREELANCE')

  // Le parcours de la mission, au-dessus du flux d'argent.
  const jalons = ['PROJET', 'CANDIDATURE', 'CONTRAT']
  jalons.forEach((j, i) => {
    const x = 126 + i * 50
    s += `<circle cx="${x}" cy="47" r="3" fill="var(--trait-fort)"/>`
    s += `<text x="${x}" y="36" text-anchor="middle" font-family="var(--mono)" font-size="6" letter-spacing=".4" fill="var(--sourd)">${j}</text>`
    if (i < jalons.length - 1) s += `<path d="M${x + 4} 47h42" stroke="var(--trait-fort)" stroke-width=".9"/>`
  })
  s += fleche(230, 47, 282, 47)
  s += `<path d="M114 47h8" stroke="var(--trait-fort)" stroke-width=".9"/>`

  // Le séquestre : le cœur du dispositif.
  s += boite(130, 104, 140, 42, '', true)
  s += `<text x="200" y="120" text-anchor="middle" font-family="var(--mono)" font-size="8" letter-spacing="1" fill="var(--signal)">SÉQUESTRE</text>`
  s += `<text x="200" y="133" text-anchor="middle" font-family="var(--mono)" font-size="6.4" letter-spacing=".5" fill="var(--sourd)">PORTEFEUILLE · AUDIT</text>`

  s += `<path d="M62 64v41h62" stroke="var(--signal)" stroke-width="1" fill="none"/>`
  s += fleche(124, 105, 130, 105, true)
  s += etiquette(66, 98, 'FONDS BLOQUÉS')

  s += `<path d="M270 125h68V64" stroke="var(--signal)" stroke-width="1" fill="none" stroke-dasharray="4 3"/>`
  s += fleche(338, 70, 338, 64, true)
  s += etiquette(334, 140, 'À LA LIVRAISON', 'end')

  // Les moyens de paiement réellement utilisés sur le marché visé.
  s += etiquette(10, 172, 'ENCAISSEMENT')
  const l = (VB.l - 20 - (moyens.length - 1) * 6) / moyens.length
  moyens.forEach((m, i) => {
    const x = 10 + i * (l + 6)
    s += `<rect x="${x}" y="180" width="${l}" height="22" fill="var(--papier)" stroke="var(--trait-fort)" stroke-width=".9"/>`
    s += `<text x="${x + l / 2}" y="194" text-anchor="middle" font-family="var(--mono)" font-size="6.6" letter-spacing=".4" fill="var(--encre-2)">${m}</text>`
    s += `<path d="M${x + l / 2} 180v-14" stroke="var(--trait)" stroke-width=".8"/>`
  })
  s += `<path d="M20 166h${VB.l - 40}" stroke="var(--trait)" stroke-width=".8"/>`
  s += `<path d="M200 146v20" stroke="var(--signal)" stroke-width="1"/>`

  return s + cartouche(ref, 'Flux de mission & d’argent')
}

/* -------------------------------------------------------------------------- */
/* Assemblage                                                                  */
/* -------------------------------------------------------------------------- */

const CORPS: Record<string, string> = {
  'LA-01': workflow('LA-01'),
  'OS-02': telemetrie('OS-02'),
  'VZ-03': surfaces('VZ-03', ['ANDROID', 'IOS', 'WEB', 'ADMIN'], 'EXPRESS · ENTITLEMENTS'),
  'CD-05': surfaces('CD-05', ['CLIENT', 'PARTENAIRE', 'CONSOLE'], 'CANADADIRT-API'),
  'XV-06': contrat('XV-06', 13, ['POST /auth/login', 'POST /auth/refresh', 'GET /users/me']),
  'NM-07': pile(
    'NM-07',
    [
      { nom: 'NEXT.JS 16 · REACT 19', detail: 'SSR · MDX · SEO' },
      { nom: 'EXPRESS 5 · PRISMA 7', detail: 'back-office · médias' },
      { nom: 'POSTGRESQL', detail: 'articles · produits · abonnés' },
    ],
    'TWITTER v2 RESEND',
  ),
  'FR-08': nuage('FR-08'),
  'AF-09': place('AF-09', ['CINETPAY', 'ORANGE', 'MTN', 'MOOV', 'WAVE']),
  'WZ-04': circuit('WZ-04', ['COLLECTE', 'TRI', 'VALORISATION', 'RÉCOMPENSE']),
}

/** Renvoie le SVG complet de la planche d'un projet, ou null s'il n'en a pas. */
export function planche(ref: string): string | null {
  const corps = CORPS[ref]
  if (!corps) return null
  return (
    `<svg viewBox="0 0 ${VB.l} ${VB.h}" width="100%" role="img" aria-label="Schéma illustratif du projet ${ref}" preserveAspectRatio="xMidYMid meet">` +
    corps +
    `</svg>`
  )
}
