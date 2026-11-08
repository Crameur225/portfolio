import type { Metadata, Viewport } from 'next'
import { Anton, Archivo, Instrument_Serif, JetBrains_Mono } from 'next/font/google'
import './atelier.css'
import { IDENTITE } from '@/data/contenu'

/* Les familles sont chargées par next/font : pas de requête vers Google au
   runtime, les fichiers sont servis depuis le même domaine. */

const archivo = Archivo({
  subsets: ['latin'],
  display: 'swap',
  variable: '--f-corps',
})

const anton = Anton({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--f-titre',
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--f-mono',
})

const serif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: 'italic',
  display: 'swap',
  variable: '--f-serif',
})

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://agbe.dev'

const description =
  'Ingénieur logiciel à Abidjan. Huit plateformes livrées : Django REST, Go, Flutter, Spring Boot, Next.js. Obtenez une estimation chiffrée de votre projet en deux minutes.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: `${IDENTITE.nomComplet} — ${IDENTITE.titre}`,
    template: `%s — ${IDENTITE.nom}`,
  },
  description,
  applicationName: 'Atelier',
  authors: [{ name: IDENTITE.nomComplet, url: IDENTITE.github }],
  creator: IDENTITE.nomComplet,
  keywords: [
    'ingénieur logiciel',
    'développeur fullstack',
    'Abidjan',
    'Côte d’Ivoire',
    'Django REST',
    'Go',
    'Flutter',
    'Spring Boot',
    'Next.js',
    'développeur freelance',
    'devis développement',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: SITE,
    siteName: IDENTITE.nomComplet,
    title: `${IDENTITE.nomComplet} — ${IDENTITE.titre}`,
    description,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${IDENTITE.nomComplet} — ${IDENTITE.titre}`,
    description,
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#dfe6ee' },
    { media: '(prefers-color-scheme: dark)', color: '#081726' },
  ],
}

/* Applique le thème enregistré avant le premier rendu, pour éviter
   le clignotement clair → sombre au chargement. */
const AVANT_PEINTURE = `
(function(){try{var t=localStorage.getItem('atelier-theme');
if(t==='clair')document.documentElement.setAttribute('data-theme','light');
else if(t==='sombre')document.documentElement.setAttribute('data-theme','dark');
}catch(e){}})();
`

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: IDENTITE.nomComplet,
  jobTitle: IDENTITE.titre,
  email: `mailto:${IDENTITE.email}`,
  url: SITE,
  sameAs: [IDENTITE.github, IDENTITE.siteMedia],
  address: {
    '@type': 'PostalAddress',
    addressLocality: IDENTITE.ville,
    addressCountry: 'CI',
  },
  knowsAbout: [
    'Django REST Framework',
    'Go',
    'Flutter',
    'Spring Boot',
    'Next.js',
    'PostgreSQL',
    'Docker',
    'Celery',
    'MongoDB',
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fr"
      className={`${archivo.variable} ${anton.variable} ${mono.variable} ${serif.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: AVANT_PEINTURE }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
