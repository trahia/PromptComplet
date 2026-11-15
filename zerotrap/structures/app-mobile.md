# Structure — Application mobile (Expo / React Native + Supabase)

```
mon-projet/
├── CLAUDE.md · AGENTS.md · zerotrap/ · .claude/ · .githooks/ · .github/   ← méthode (protégé)
├── projet/                      ← suivi du projet
├── legal/fr/                    ← SOURCE UNIQUE des pages légales (affichées dans l'app ET sur le web)
├── app/                         ← routes Expo Router
│   ├── _layout.tsx              ← inclut UNE fois : AccessibilityProvider, thème, i18n, providers
│   ├── (auth)/                  ← connexion, inscription, mot de passe oublié
│   ├── (tabs)/                  ← écrans principaux
│   ├── settings/
│   │   ├── index.tsx            ← réglages
│   │   ├── privacy.tsx          ← consentements, export des données, SUPPRESSION DU COMPTE
│   │   ├── security.tsx         ← mot de passe, passkeys, double authentification, appareils
│   │   ├── legal/[page].tsx     ← affiche legal/<langue>/<page>.md
│   │   └── licenses.tsx         ← licences tierces
│   └── +not-found.tsx
├── src/
│   ├── components/ui/           ← composants de base
│   ├── components/accessibility/ ← kit/mobile/accessibility
│   ├── features/<fonctionnalite>/
│   ├── services/                ← client Supabase (clé publique uniquement), API
│   ├── lib/                     ← env.ts, i18n, secure-storage.ts (expo-secure-store)
│   ├── theme/                   ← tokens.ts (couleurs, typographie, espacements, animations)
│   └── locales/                 ← traductions
├── assets/                      ← icônes, écran de démarrage, polices, images
├── supabase/
│   ├── migrations/              ← RLS sur chaque table
│   └── functions/               ← Edge Functions : tout ce qui demande un secret
├── web-legal/                   ← mini-site statique obligatoire : politique de confidentialité
│                                   (URL demandée par les stores) et PAGE WEB DE SUPPRESSION DE
│                                   COMPTE (exigée par Google Play)
├── tests/                       ← unitaires, e2e (Maestro ou Detox), sécurité
├── app.config.ts                ← permissions avec texte de justification, AUCUN secret
├── eas.json                     ← profils development / preview / production
├── .env.example
└── package.json · tsconfig.json · eslint.config.mjs
```

## À ne pas oublier

- L'app est **publique** : aucun secret dans le code ni dans `app.config.ts`. Tout ce qui demande
  une clé secrète passe par une Edge Function ou un serveur.
- Jetons dans `expo-secure-store`, jamais dans AsyncStorage.
- Fiche de confidentialité Apple et formulaire « Sécurité des données » de Google Play remplis à
  partir de `config.donnees`.

## Preuves (chemins par défaut)

| Preuve | Chemin |
|---|---|
| `composant_accessibilite` | `app/_layout.tsx` |
| `liens_legaux` | `app/settings/index.tsx` |
| `suppression_compte` | `app/settings/privacy.tsx` |
| `export_donnees` | `app/settings/privacy.tsx` |
| `page_web_suppression_compte` | `web-legal/suppression-compte.html` |
