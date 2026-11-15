# Structure — Site web (Next.js + Supabase)

Pour un site vitrine sans comptes, Astro peut remplacer Next.js. Garde alors la même logique :
`legal/`, `projet/`, composants du kit inclus une seule fois dans le layout racine.

```
mon-projet/
├── CLAUDE.md · AGENTS.md · zerotrap/ · .claude/ · .githooks/ · .github/   ← méthode (protégé)
├── projet/                      ← suivi du projet (brief, config.json, plan, journal, veille légale,
│                                   registre des traitements, licences, consignes)
├── legal/
│   └── fr/                      ← SOURCE UNIQUE des pages légales (une sous-dossier par langue)
│       ├── politique-confidentialite.md
│       ├── mentions-legales.md
│       ├── cgu.md · cgv.md · cookies.md        (selon la matrice d'obligations)
│       └── declaration-accessibilite.md
├── public/
│   ├── .well-known/security.txt
│   ├── favicon.ico · icon.svg · apple-touch-icon.png · og-image.png
│   └── fonts/                   ← polices hébergées avec le projet
├── src/
│   ├── app/                     ← routes
│   │   ├── layout.tsx           ← inclut UNE fois : AccessibilityProvider, CookieConsent, LegalLinks
│   │   ├── page.tsx
│   │   ├── (marketing)/         ← pages publiques
│   │   ├── (app)/               ← pages connectées
│   │   ├── compte/              ← profil, sécurité, confidentialité (export, suppression)
│   │   ├── legal/[page]/page.tsx  ← affiche legal/<langue>/<page>.md
│   │   ├── api/webhooks/        ← webhooks signés (paiement…)
│   │   ├── not-found.tsx · error.tsx
│   │   └── sitemap.ts · robots.ts
│   ├── components/
│   │   ├── ui/                  ← composants de base (shadcn/ui personnalisé)
│   │   ├── accessibility/       ← kit/web/accessibility
│   │   ├── consent/             ← kit/web/consent
│   │   └── legal/               ← kit/web/legal
│   ├── features/<fonctionnalite>/ ← composants, actions serveur, schémas, requêtes, tests
│   ├── server/                  ← « server-only » : db, auth, paiements, e-mails, IA
│   ├── lib/                     ← env.ts (variables validées au démarrage), i18n, utilitaires
│   ├── messages/                ← traductions (fr.json, en.json…)
│   ├── styles/                  ← tokens.css (design tokens), globals.css
│   └── proxy.ts                 ← (ou middleware.ts selon la version de Next.js) en-têtes de
│                                   sécurité et CSP via kit/web/security
├── emails/                      ← modèles React Email
├── supabase/
│   ├── migrations/              ← RLS activée sur CHAQUE table (vérifié par le script)
│   └── seed.sql                 ← données FICTIVES uniquement
├── tests/
│   ├── unit/ · e2e/ · security/ ← « A ne voit pas les données de B »
├── .env.example                 ← noms des variables, sans valeurs
├── package.json · pnpm-lock.yaml · tsconfig.json · eslint.config.mjs · playwright.config.ts
└── README.md
```

## Preuves à déclarer dans `config.preuves` (chemins par défaut)

| Preuve | Chemin |
|---|---|
| `composant_accessibilite` | `src/app/layout.tsx` |
| `liens_legaux` | `src/components/legal/LegalLinks.tsx` |
| `bandeau_cookies` | `src/app/layout.tsx` |
| `suppression_compte` | `src/app/compte/supprimer/page.tsx` |
| `export_donnees` | `src/features/compte/export-donnees.ts` |
| `signalement_contenu` | `src/features/moderation/signalement.tsx` |
| `retractation_en_ligne` | `src/app/compte/commandes/retractation/page.tsx` |
