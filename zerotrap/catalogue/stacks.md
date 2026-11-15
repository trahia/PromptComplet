# Technologies recommandées par type de projet

Choisis des technologies **répandues, bien documentées, maintenues**, et adaptées au budget. Explique
le choix en une phrase simple dans le plan. Les versions exactes sont choisies au moment de
l'installation (dernière version stable). Vérifie-les avec la documentation officielle ou Context7.

| Projet | Technologies par défaut | Pourquoi | Alternatives |
|---|---|---|---|
| **Site vitrine, blog, contenu** | Astro + TypeScript + Tailwind CSS | Très rapide, excellent SEO, peu de JavaScript | Next.js. CMS headless si la personne veut modifier ses textes elle-même (Keystatic, Payload, Sanity). |
| **Site web avec comptes, SaaS, réservation** | Next.js (App Router) + TypeScript + Tailwind + shadcn/ui + Supabase (PostgreSQL, Auth, stockage, RLS) | Standard du marché, sûr par défaut avec RLS, coût de départ nul | Better Auth + Neon, Firebase |
| **Boutique en ligne** | Next.js + Stripe Checkout + Supabase | Sur mesure, périmètre PCI minimal | Si c'est un catalogue classique de produits physiques, propose aussi honnêtement une solution hébergée (Shopify…) : moins chère à maintenir |
| **Place de marché** | Next.js + Supabase + Stripe Connect | Stripe Connect vérifie l'identité des vendeurs | |
| **App mobile iOS + Android** | Expo (React Native) + TypeScript + Expo Router + Supabase + EAS | Une seule base de code pour les deux stores, compilation iOS sans Mac | Flutter |
| **App iOS seule, expérience très native** | SwiftUI + Swift | Rendu Apple parfait | Expo si Android est prévu plus tard |
| **App Android seule, très native** | Kotlin + Jetpack Compose | | Expo |
| **App + site web** | Monorepo pnpm + Turborepo : `apps/web` (Next.js), `apps/mobile` (Expo), `packages/*` partagés, Supabase | Code, types, validations et textes partagés | |
| **Logiciel de bureau** (type « Autre ») | Tauri (léger, sûr) | | Electron |
| **Expérience 3D / animations avancées** | Three.js / React Three Fiber, GSAP, Motion, Rive, Lottie | | Spline pour des scènes simples |

## Socle commun à tous les projets JavaScript/TypeScript

- TypeScript strict.
- ESLint, avec les règles d'accessibilité (`jsx-a11y`) et de sécurité.
- Prettier.
- **Tests** : Vitest (unitaires) ; Playwright + `@axe-core/playwright` (bout en bout et
  accessibilité).
- **Données** : Zod (validation), i18n (next-intl, i18next ou expo-localization).
- Gestionnaire de paquets : pnpm (ou npm). Lockfile versionné.
