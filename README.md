# ZeroTrap

*Zéro piège : sécurité, lois des pays, accessibilité.*

**Une méthode de travail imposée à l'IA pour créer un site, une app ou une entreprise de A à Z, sécurisé, conforme aux lois et vraiment adapté à toi, même sans rien connaître au développement.**

Tu donnes ce dépôt à Claude Code. Claude te pose des questions simples, construit avec toi un plan
concret, puis réalise le projet en respectant des règles strictes. Ces règles, c'est l'IA qui les
applique, pas toi : sécurité, données personnelles, lois de chaque pays, accessibilité, copyright,
qualité du design.

> Gratuit et open source ([licence MIT](LICENSE)). ZeroTrap **ne remplace ni un avocat, ni un
> expert en sécurité** : lis « [Ce que ZeroTrap n'est pas](#ce-que-zerotrap-nest-pas) ».

---

## Ce que ZeroTrap fait pour toi

- **Un questionnaire guidé** : nom, type de projet (site, app web, app des stores, entreprise…), iOS/Android,
  pays, description, modèle économique, comptes utilisateurs (avec le prix de chaque mode de
  connexion), paiements adaptés à ton pays.
- **Des idées auxquelles tu n'aurais pas pensé** : Claude pousse ton idée (catégories, filtres,
  recherche, notifications, back-office, e-mails, page 404, sauvegardes…) et tu choisis.
- **Un plan concret** : étapes, outils, budget mensuel estimé, arborescence des dossiers,
  pages légales nécessaires, checklist de lancement.
- **La sécurité au plus haut niveau** : contrôle d'accès strict, chiffrement, aucun secret dans le
  code, paiements uniquement via des prestataires reconnus, scans automatiques.
- **Le respect des lois de chaque pays** : vérification sur les sites officiels, pages légales
  créées puis **tenues à jour** à chaque nouvelle fonctionnalité (confidentialité, mentions légales,
  CGU/CGV, cookies, déclaration d'accessibilité…).
- **L'accessibilité intégrée** : un module unique (taille du texte, contrastes, lecture de la page à
  voix haute…) appelé une seule fois pour tout le site, plus un code accessible dans chaque composant.
- **Un rendu qui ne « fait pas IA »** : skills de design et de qualité professionnels, imposés selon
  le type de projet.

## Démarrer

Suis le guide [DEMARRER.md](DEMARRER.md). Pas besoin de compte GitHub. Compte 5 minutes
d'installation, puis 10 à 15 minutes de questions.

**Tu as déjà un projet ?** Commence par un **audit sans rien modifier** : Claude lit ton code et te
donne la liste des problèmes (sécurité, lois, pages obligatoires, accessibilité, règles d'Apple et de
Google), classée par gravité. Le message à copier est dans [DEMARRER.md](DEMARRER.md).

## Comment les règles sont imposées (3 verrous)

Un simple fichier de consignes ne suffit pas à forcer une IA. ZeroTrap ajoute des verrous
automatiques qui s'exécutent **en dehors de l'IA** :

| Verrou | Où | Ce qu'il fait |
|---|---|---|
| 1. Constitution | `CLAUDE.md`, `AGENTS.md`, `zerotrap/regles/` | L'IA les lit à chaque session et doit les suivre. |
| 2. Hooks Claude Code | `.claude/settings.json`, `.claude/hooks/` | Exécutés par Claude Code lui-même. Ils bloquent l'écriture d'un secret, la lecture d'un `.env`, la modification des règles, le contournement des tests, l'envoi du projet vers ce dépôt modèle… Ils rappellent l'état du projet à chaque session et empêchent l'IA de s'arrêter si une page légale n'est plus à jour. |
| 3. Contrôles automatiques | `.githooks/`, `.github/workflows/`, `zerotrap/scripts/` | Avant chaque commit et sur GitHub : recherche de secrets, analyse de sécurité du code et des dépendances, vérification de conformité (pages légales, accessibilité, base de données…). Si une règle est cassée, le contrôle échoue. |

Ces verrous sont solides, mais aucun système n'est infaillible. Le verrou 2 ne fonctionne qu'avec
Claude Code. Les verrous 1 et 3 fonctionnent avec toutes les IA.

## Confidentialité de ton projet

- Ce dépôt ne contient **que la méthode**. Il ne contient aucune donnée de projet.
- Ton projet est créé **dans ton propre dossier**, sur ton ordinateur. Le lien avec ce dépôt est
  coupé à l'installation, et un verrou empêche d'y envoyer ton projet.
- Tes réponses au questionnaire restent dans ton dossier (`projet/`). Elles ne sont envoyées nulle
  part, en dehors du fonctionnement normal de l'IA que tu utilises.

## Ce que ZeroTrap n'est pas

- **Pas un avocat.** L'IA vérifie les textes officiels et cite ses sources, mais fais relire tes
  pages légales par un professionnel avant un lancement commercial.
- **Pas une garantie.** ZeroTrap est fourni « en l'état », sans garantie (licence MIT). Il
  réduit fortement les risques, mais tu restes responsable de ton projet.
- **Pas figé.** Les lois et les prix changent. L'IA doit revérifier les sources officielles, au
  moins tous les 90 jours et avant chaque lancement.

## Contribuer, signaler un problème

- Une loi a changé, une information est fausse, une idée : [CONTRIBUTING.md](CONTRIBUTING.md).
  Chaque changement légal doit citer une **source officielle**.
- Une faille de sécurité dans la méthode : **en privé**, voir [SECURITY.md](SECURITY.md).

## Structure du dépôt

```
CLAUDE.md                 Constitution lue par Claude à chaque session
AGENTS.md                 La même chose pour les autres IA
DEMARRER.md               Guide de démarrage
.claude/                  Hooks (verrous) et commandes : /demarrer, /verifier, /nouvelle-fonctionnalite…
.githooks/                Contrôle avant chaque commit
.github/                  Contrôles automatiques sur GitHub
zerotrap/
  methode/                Étapes : installation, questionnaire, veille légale, plan, construction…
  regles/                 Règles non négociables : sécurité, données, paiements, accessibilité…
  legal/                  Obligations par pays et modèles de pages légales
  catalogue/              Skills, outils de sécurité, connexions, paiements, services, technologies
  structures/             Arborescences types : site, app, app + site, entreprise
  kit/                    Composants prêts à l'emploi : accessibilité, cookies, pages légales…
  scripts/                Vérification de conformité, recherche de secrets, installation
projet/                   (vide ici) Rempli chez toi : brief, plan, journal, veille légale…
```

## Mettre à jour la méthode

Quand une nouvelle version de ZeroTrap sort, demande à Claude :
« Mets à jour la méthode ZeroTrap ». Il suivra `zerotrap/methode/07-mise-a-jour.md`.
Les fichiers protégés ne sont remplacés qu'après ton accord.
