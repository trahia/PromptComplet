# Instructions pour les agents IA (Codex, Cursor, Gemini, Copilot, Windsurf…)

Ce projet utilise la méthode **ZeroTrap**. Les règles sont les mêmes pour toutes les IA.

1. Lis **`CLAUDE.md`** en entier : c'est la constitution du projet. Elle est non négociable.
2. Lis ensuite les fichiers de `zerotrap/regles/` correspondant à ce que tu fais.
3. Si `projet/config.json` n'existe pas, commence par `zerotrap/methode/00-installation.md`
   puis `zerotrap/methode/01-questionnaire.md`.

Rappels essentiels :

- Sécurité des utilisateurs et respect des lois de tous les pays visés avant tout le reste.
- Aucun secret dans le code ; ne lis jamais les fichiers `.env` ni les clés privées.
- Contrôle d'accès côté serveur, accès refusé par défaut, chiffrement partout.
- Paiements uniquement via un prestataire reconnu ; aucune donnée de carte chez nous.
- Pages légales dans `legal/<langue>/`, mises à jour à chaque changement de fonctionnalité.
- Accessibilité WCAG 2.2 AA, module d'accessibilité unique inclus à la racine.
- Ne modifie jamais `CLAUDE.md`, `AGENTS.md`, `zerotrap/`, `.claude/`, `.githooks/`,
  ni les workflows de sécurité/conformité.
- Après chaque étape : `node zerotrap/scripts/verifier-conformite.mjs`.

Note : les hooks automatiques de `.claude/` ne fonctionnent qu'avec Claude Code. Avec un autre
agent, les protections restantes sont le hook git `pre-commit` (`.githooks/`) et les vérifications
GitHub Actions (`.github/workflows/`). Respecte les règles même sans garde-fou automatique.
