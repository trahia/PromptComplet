# Règle 07 — Design et qualité : un rendu professionnel qui ne « fait pas IA »

## Ce qu'on évite (signes d'un design générique)

- Dégradés violet-bleu partout, effet verre dépoli sur tout, ombres floues uniformes.
- Section d'accueil générique : grand titre centré, sous-titre vague, deux boutons, illustration
  passe-partout.
- Émojis en guise d'icônes ou de puces. Une seule police partout, sans hiérarchie.
- Espacements irréguliers, styles de boutons différents d'une page à l'autre.
- Texte provisoire (« lorem ipsum »), images de démonstration et textes creux (« la solution
  innovante qui révolutionne… ») au moment de la livraison.

## La méthode

1. **Comprendre la marque** :
   - 3 adjectifs de personnalité ;
   - le public ;
   - 2 ou 3 concurrents ou références, pour s'en **distinguer**, pas pour les copier.
2. **Proposer 2 ou 3 directions artistiques**, décrites simplement : palette, association de polices,
   formes (arrondies ou nettes), style d'images, personnalité des animations. La personne en choisit une.
3. **Poser les fondations (design tokens)** dans un seul fichier :
   - couleurs, avec des paires de contraste vérifiées (règle 05) ;
   - échelle typographique ;
   - échelle d'espacements (base 4 ou 8) ;
   - rayons ;
   - ombres ;
   - durées et courbes d'animation ;
   - thème clair et thème sombre.
4. **Construire une bibliothèque de composants** cohérente, réutilisée partout :
   - web : shadcn/ui personnalisé ;
   - mobile : composants Expo / natifs.
5. **Construire les pages** à partir de ces composants uniquement.

## Skills obligatoires (détail et installation : `catalogue/skills.md`)

| Projet | Skills à utiliser |
|---|---|
| Tout projet avec interface | `frontend-design` (Anthropic) pour la création. `web-design-guidelines` (Vercel) et `frontend-ui-engineering` (Addy Osmani) pour la revue. |
| Animations | Skills d'Emil Kowalski (`emil-design-eng`, `animate`, `review-animations`). GSAP skills pour les animations au défilement. |
| iOS / sensation « Apple » | `apple-design`, `write-swift` (Emil Kowalski). SwiftUI : skill d'Antoine van der Lee ou de Paul Hudson. |
| App Expo / React Native | Expo skills (officiels), `animate-expo`, Callstack, Software Mansion (Reanimated). |
| Maquettes Figma existantes | Plugin Figma officiel. |
| 3D, WebGL | Bundle 3D du catalogue (optionnel, à relire avant usage). |
| Vérification visuelle | `webapp-testing` (Anthropic), Playwright, Chrome DevTools MCP. |

## Contrôle qualité visuel (à chaque page)

- Captures d'écran à 375, 768, 1280 et 1920 px de large, en thème clair et sombre, puis
  vérification de :
  - l'alignement ;
  - les débordements ;
  - la hiérarchie ;
  - la cohérence.
- **Régression visuelle** : comparaison automatique des captures avec Playwright
  (`toHaveScreenshot`) pour détecter les changements involontaires.
- Revue avec les skills de revue (`web-design-guidelines`, `review-animations`).

## Contenus et textes

- Textes réels et utiles. Phrases courtes, à la voix active. Un même mot pour une même chose
  partout.
- Micro-textes soignés : boutons qui disent ce qu'ils font, messages d'erreur qui disent quoi faire,
  états vides qui guident.
- Aucun texte écrit en dur dans le code : tout passe par les fichiers de traduction (i18n), même pour
  une seule langue au départ.

## Tous les états prévus

Chargement (squelettes plutôt que roues qui tournent), vide, erreur, succès, hors ligne, accès refusé,
première utilisation.

## Identité complète

Logo en SVG, favicon et icônes d'app dans toutes les tailles, écran de démarrage, images de partage
(Open Graph), page 404 et e-mails à l'image de la marque.

## Internationalisation

- Bibliothèque i18n.
- Dates, nombres et devises au format local (`Intl`).
- Mise en page qui supporte des textes 30 % plus longs.
- Langues de droite à gauche supportées (règle 05).
