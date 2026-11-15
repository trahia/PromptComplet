# Ajouter ZeroTrap à un projet qui existe déjà

> **Si la personne veut d'abord savoir où elle en est sans rien changer**, utilise
> `09-audit-seul.md` : analyse en lecture seule, liste des problèmes dans la discussion, aucune
> installation. L'installation ci-dessous, elle, **ajoute des fichiers au projet**.

## Ce que l'installation change dans le projet (à annoncer avant)

- Elle ajoute `zerotrap/`, `CLAUDE.md`, `AGENTS.md`, `.claude/`, `.githooks/`, `.gitleaks.toml`,
  `projet/` et 3 workflows GitHub (sécurité, conformité, ZAP). Elle n'écrase aucun fichier existant.
- Les crochets git existants (Husky, Lefthook…) ne sont **pas** remplacés : l'installateur explique
  comment y ajouter le contrôle ZeroTrap.
- Les workflows de sécurité peuvent **passer au rouge** sur un code existant, tant que les problèmes ne
  sont pas corrigés. C'est voulu, mais il faut le dire avant.

## Installation

1. Fais une sauvegarde : vérifie que tout est commité (`git status`), sinon propose un commit.
2. Clone la méthode dans `.zerotrap-source/`, puis lance
   `node .zerotrap-source/zerotrap/scripts/installer.mjs --source .zerotrap-source`.
   Le script **n'écrase rien**. Il liste les fichiers en conflit (ex. un `CLAUDE.md` existant).
3. Si un ancien `CLAUDE.md` existe, son contenu va dans `projet/consignes.md`, avec l'accord de la
   personne. La constitution ZeroTrap devient le `CLAUDE.md`.
4. Demande à la personne de taper `/clear` pour activer les verrous.

## Questionnaire en mode « audit »

Déduis du code tout ce que tu peux : type, technologies, pays visés (langues, devises),
fonctionnalités, comptes, paiements, données collectées, services externes. Pose les questions
auxquelles le code ne répond pas, et fais **toujours confirmer** la forme du projet avec les questions
de `regles/12-stores-applications.md`, section 1 : site seul ou app, app web ou app des stores, iPhone
et/ou Android, site simplement affiché dans une app ou vraie app. Fais valider le résultat, puis crée
`projet/config.json`.

## Audit de sécurité et de conformité

Produis `projet/audit-initial.md`, classé par gravité (critique, élevée, moyenne, faible) :
- secrets dans le code ou dans l'historique git. Si c'est le cas : **révocation immédiate des
  clés** par la personne, puis nettoyage ;
- contrôle d'accès, RLS, validation des entrées, en-têtes, dépendances vulnérables ;
- pages légales manquantes ou obsolètes, cookies déposés sans consentement ;
- accessibilité (axe-core sur les pages principales) ;
- résultat de `node zerotrap/scripts/verifier-conformite.mjs`.

Puis propose un **plan de mise en conformité** : les points critiques d'abord. Fais-le valider, et
suis `04-construction.md` pour chaque correction.
