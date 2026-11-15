# Structure — Application + site web (monorepo)

Une seule base, du code partagé, une seule source pour les pages légales et les textes.

```
mon-projet/
├── CLAUDE.md · AGENTS.md · zerotrap/ · .claude/ · .githooks/ · .github/   ← méthode (protégé)
├── projet/
├── legal/<langue>/              ← SOURCE UNIQUE des pages légales, pour le web ET l'app
├── apps/
│   ├── web/                     ← Next.js (voir structures/site-web.md, sans legal/ ni projet/)
│   └── mobile/                  ← Expo (voir structures/app-mobile.md, sans legal/ ni projet/)
├── packages/
│   ├── core/                    ← types, schémas Zod (validation partagée), constantes
│   ├── i18n/                    ← traductions partagées
│   ├── tokens/                  ← design tokens communs (couleurs, typographie, espacements)
│   ├── legal/                   ← lecture de legal/<langue>/*.md pour les deux apps
│   └── config/                  ← tsconfig, ESLint et Prettier partagés
├── supabase/
│   ├── migrations/              ← RLS sur chaque table
│   └── functions/
├── tests/                       ← e2e web, e2e mobile, sécurité
├── .env.example
├── pnpm-workspace.yaml · turbo.json · package.json · pnpm-lock.yaml
└── README.md
```

La page web de suppression de compte (exigée par Google Play) est une page de `apps/web`.

## Preuves (chemins par défaut)

| Preuve | Chemin |
|---|---|
| `composant_accessibilite` | `apps/web/src/app/layout.tsx` (et `apps/mobile/app/_layout.tsx`, en liste) |
| `liens_legaux` | `apps/web/src/components/legal/LegalLinks.tsx` |
| `suppression_compte` | `apps/mobile/app/settings/privacy.tsx` |
| `page_web_suppression_compte` | `apps/web/src/app/compte/supprimer/page.tsx` |

Une preuve peut être une **liste** de chemins : `"composant_accessibilite": ["apps/web/src/app/layout.tsx", "apps/mobile/app/_layout.tsx"]`.
