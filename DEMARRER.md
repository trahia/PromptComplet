# Démarrer un projet avec PromptComplet

## Ce qu'il te faut

1. **Claude Code** : l'application de bureau Claude (onglet Code) ou Claude Code dans un terminal.
2. **L'accès à ce dépôt** : accepte l'invitation GitHub reçue par e-mail.
3. **Ta connexion GitHub sur ton ordinateur**, pour que Claude puisse télécharger la méthode :
   - installe GitHub CLI (Windows : `winget install --id GitHub.cli` ; Mac : `brew install gh`) ;
   - **ferme puis rouvre ton terminal**, puis tape `gh auth login`, et choisis **GitHub.com**,
     **HTTPS**, **Yes**, **Login with a web browser**.
4. **Git** et **Node.js 22 ou plus** (version 24 LTS recommandée). Si tu ne les as pas, Claude te
   dira comment les installer.

## Les étapes

1. Crée un **dossier vide** pour ton projet (par exemple `Documents/MonProjet`).
2. Ouvre Claude Code **dans ce dossier**.
3. Copie-colle ce message :

   > Installe la méthode PromptComplet depuis https://github.com/trahia/PromptComplet dans
   > ce dossier. Clone-la dans un sous-dossier temporaire `.promptcomplet-source`, puis suis
   > exactement le fichier `promptcomplet/methode/00-installation.md` de ce clone.

4. Quand Claude te le demande, **ferme puis relance Claude Code dans le même dossier**. Cela active
   les protections automatiques. Si Claude Code te demande de faire confiance au dossier, accepte :
   c'est ton projet.
5. Tape `/demarrer` (ou écris « on commence »), puis réponds aux questions. Tu peux toujours dire
   « je ne sais pas » : Claude te proposera une option.

## Les commandes utiles ensuite

| Commande | À quoi elle sert |
|---|---|
| `/demarrer` | Lancer ou reprendre le questionnaire |
| `/verifier` | Vérifier la sécurité et la conformité du projet, avec une explication simple |
| `/nouvelle-fonctionnalite` | Ajouter une fonctionnalité en mettant à jour la sécurité et les pages légales |
| `/veille-legale` | Revérifier les lois des pays visés sur les sites officiels |
| `/lancement` | Checklist complète avant la mise en ligne ou la publication sur les stores |

## Avec une autre IA (claude.ai, ChatGPT, Cursor…)

- **Cursor, Codex, Copilot, Windsurf, Gemini CLI** : ces outils lisent `AGENTS.md`. Les règles
  s'appliquent, ainsi que les contrôles avant commit et sur GitHub, mais pas les hooks de
  Claude Code.
- **claude.ai (navigateur)** : connecte GitHub dans les réglages, puis demande à Claude de lire
  ce dépôt et de faire le questionnaire et le plan. Pour **construire** le projet, il faudra
  ensuite passer sur Claude Code.

## Confidentialité

Ton projet reste dans ton dossier. Le lien avec le dépôt PromptComplet est coupé pendant
l'installation, et un verrou empêche d'y envoyer ton travail. Pour sauvegarder ton projet en
ligne, Claude t'aidera à créer **ton propre** dépôt GitHub privé.
