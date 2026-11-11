---
name: demarrer
description: Lance ou reprend le projet PromptComplet (installation, questionnaire de démarrage, ou reprise du travail en cours). À utiliser quand la personne dit « on commence », « démarrer », « nouveau projet » ou « on reprend ».
---

# /demarrer — Lancer ou reprendre le projet

1. Lis `CLAUDE.md` si ce n'est pas déjà fait dans cette session.
2. Détermine où en est le projet :
   - `promptcomplet/.installe` absent → suis `promptcomplet/methode/00-installation.md`.
   - `projet/config.json` absent → suis `promptcomplet/methode/01-questionnaire.md` **à la lettre**. Si
     `projet/brief.md` existe, reprends à la première question sans réponse.
   - `projet/config.json` présent → lis `projet/config.json`, `projet/plan.md` et la fin de
     `projet/journal.md`. Résume en 3 lignes où en est le projet, puis propose la prochaine étape.
3. Avant une tâche longue : annonce le nombre d'étapes et une durée approximative. Ensuite, écris une
   ligne d'avancement à chaque étape.
