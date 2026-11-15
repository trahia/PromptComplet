# Kit PromptComplet — composants prêts à l'emploi

Ces composants sont **inclus une seule fois**, à la racine de l'application, puis réutilisés. On ne les
recopie jamais page par page. Copie-les dans le projet (voir les chemins de `structures/`), adapte les
couleurs aux design tokens et les textes aux traductions, puis déclare leur chemin dans
`config.preuves`.

| Dossier | Contenu | Dépendances |
|---|---|---|
| `web/accessibility/` | `AccessibilityProvider` : lien « Aller au contenu », icône et menu d'accessibilité (taille du texte, contraste, police lisible, espacement, liens soulignés, animations réduites, grand curseur, **lecture à voix haute**), lien vers la déclaration | React 18+. Police lisible conseillée : Atkinson Hyperlegible (licence OFL, à héberger avec le projet, par ex. `@fontsource/atkinson-hyperlegible`) |
| `web/consent/` | `CookieConsent` (bandeau conforme CNIL : « Tout refuser » aussi visible que « Tout accepter », fermer = refuser, choix gardé 6 mois), `ConsentGate` (bloque un contenu tiers avant consentement), `useConsent`, `openConsentSettings` | React 18+ |
| `web/legal/` | `LegalPage` (affiche `legal/<langue>/<page>.md`, liste blanche des pages, sans HTML brut), `LegalLinks` (liens du pied de page + « Gérer mes cookies ») | `react-markdown`, `remark-gfm` |
| `web/security/` | `buildCsp`, `securityHeaders`, `generateNonce` (en-têtes de sécurité et CSP à nonce) et un exemple de `proxy.ts` pour Next.js. `upload-validation.ts` : `validateUpload`, `detectFileType` et `downloadHeaders` (contrôle côté serveur des fichiers envoyés par les utilisateurs) | aucune |
| `mobile/accessibility/` | `AccessibilityProvider`, `useA11y`, `A11yText`, `AccessibilitySettings` (React Native / Expo) : réglages système respectés, taille du texte, contraste | `@react-native-async-storage/async-storage`, `expo-web-browser` |
| `mobile/legal/` | `LegalLinks` : ouvre les pages légales publiées sur le web (URL demandée par les stores) | `expo-web-browser` |
| `base-de-donnees/` | `supabase-socle.sql` : profils, RLS sur chaque table, journal d'audit, export des données, stockage privé par utilisateur, modèle de table | Supabase |

## Utilisation type (Next.js)

```tsx
// src/app/layout.tsx
import { AccessibilityProvider } from "@/components/accessibility/AccessibilityProvider";
import { CookieConsent } from "@/components/consent/CookieConsent";
import { LegalLinks } from "@/components/legal/LegalLinks";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <AccessibilityProvider declarationHref="/legal/declaration-accessibilite" />
        <main id="contenu">{children}</main>
        <footer>
          <LegalLinks pages={["mentions-legales", "politique-confidentialite", "cookies", "declaration-accessibilite"]} showCookieSettings />
        </footer>
        <CookieConsent
          categories={[{ id: "mesure", label: "Mesure d'audience", description: "Nous aide à comprendre l'utilisation du site." }]}
        />
      </body>
    </html>
  );
}
```

Puis dans `projet/config.json` :

```json
"preuves": {
  "composant_accessibilite": "src/app/layout.tsx",
  "bandeau_cookies": "src/app/layout.tsx",
  "liens_legaux": "src/components/legal/LegalLinks.tsx"
}
```

## Rappel

Le module d'accessibilité **complète** l'accessibilité du code (règle 05), il ne la remplace pas. Le
bandeau ne sert à rien si des traceurs sont chargés sans passer par `useConsent` / `ConsentGate`.
