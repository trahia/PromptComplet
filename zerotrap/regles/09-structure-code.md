# Règle 09 — Structure du code et organisation

## Arborescence

Suis **exactement** l'arborescence de `zerotrap/structures/<type>.md`. Tout nouveau dossier
doit avoir une raison, notée dans `projet/consignes.md`.

## Conventions

- **Code en anglais** : noms de variables, fonctions, fichiers, commentaires techniques. C'est le
  standard des outils et des bibliothèques. Les textes affichés passent par les fichiers de traduction.
- **Documentation du projet** (`projet/`, `legal/`) dans la langue de la personne.
- Noms de fichiers :
  - `kebab-case` pour les fichiers et dossiers ;
  - `PascalCase` pour les composants React si le framework l'attend ;
  - un nom = une responsabilité.
- **TypeScript strict** (`"strict": true`, pas de `any`), linter (ESLint, avec les règles
  d'accessibilité et de sécurité) et formateur (Prettier).
- Fichiers courts et lisibles. Au-delà d'environ 300 lignes, découpe.

## Séparation des couches

```
ui/          composants visuels réutilisables, sans logique métier
features/    un dossier par fonctionnalité (écrans, logique, hooks, tests)
server/      tout ce qui touche aux secrets, à la base de données, aux paiements, à l'IA
lib/         utilitaires partagés (validation, formatage, constantes)
```

- Le code `server/` n'est **jamais** importé côté client. Utilise `server-only` en Next.js.
- La base de données n'est accessible qu'à travers la couche serveur ou les règles RLS.
- Les schémas de validation (Zod…) sont partagés entre le client (confort) et le serveur (sécurité).
- La configuration est centralisée : les variables d'environnement sont lues et **validées au
  démarrage**. L'app refuse de démarrer s'il en manque une.

## Ne jamais dupliquer

Les éléments transverses existent **en un seul exemplaire** et sont inclus à la racine ou importés :
- module d'accessibilité ;
- bandeau de consentement ;
- liens légaux du pied de page ;
- en-têtes de sécurité ;
- gestion des erreurs ;
- traductions ;
- design tokens.

## Scripts standard (`package.json`)

| Script | Rôle |
|---|---|
| `dev` | lancer en local |
| `build` | construire |
| `lint` | linter |
| `typecheck` | vérification des types |
| `test` | tests unitaires |
| `test:e2e` | tests de bout en bout (Playwright) |
| `test:a11y` | tests d'accessibilité (Playwright + axe-core) |
| `verifier` | `node zerotrap/scripts/verifier-conformite.mjs` |

Les contrôles GitHub (`.github/workflows/`) appellent ces scripts s'ils existent.

## Tests

- **Tests unitaires** : à côté du code (`*.test.ts`) ou dans `tests/unit/`.
- **Tests de bout en bout et d'accessibilité** : dans `tests/e2e/`.
- **Tests de droits d'accès** : dans `tests/security/`, au minimum « A ne voit pas les données de B ».

## Git

- Commits petits et clairs au format Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`…).
- Une branche par fonctionnalité, quand le projet a un dépôt distant.
- Les décisions importantes sont consignées dans `projet/journal.md`, avec la raison du choix.

## Documentation du projet

Le `README.md` du projet (créé pendant la construction) explique :
- comment le lancer ;
- la liste des variables d'environnement (noms seulement) ;
- l'architecture en quelques lignes ;
- où se trouvent les pages légales.
