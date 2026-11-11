# Ajouter PromptComplet à un projet qui existe déjà

## Installation

1. Fais une sauvegarde : vérifie que tout est commité (`git status`), sinon propose un commit.
2. Clone la méthode dans `.promptcomplet-source/`, puis lance
   `node .promptcomplet-source/promptcomplet/scripts/installer.mjs --source .promptcomplet-source`.
   Le script **n'écrase rien**. Il liste les fichiers en conflit (ex. un `CLAUDE.md` existant).
3. Si un ancien `CLAUDE.md` existe, son contenu va dans `projet/consignes.md`, avec l'accord de la
   personne. La constitution PromptComplet devient le `CLAUDE.md`.
4. Demande à la personne de taper `/clear` pour activer les verrous.

## Questionnaire en mode « audit »

Déduis du code tout ce que tu peux : type, technologies, pays visés (langues, devises),
fonctionnalités, comptes, paiements, données collectées, services externes. Ne pose que les
questions auxquelles le code ne répond pas. Fais valider le résultat, puis crée `projet/config.json`.

## Audit de sécurité et de conformité

Produis `projet/audit-initial.md`, classé par gravité (critique, élevée, moyenne, faible) :
- secrets dans le code ou dans l'historique git. Si c'est le cas : **révocation immédiate des
  clés** par la personne, puis nettoyage ;
- contrôle d'accès, RLS, validation des entrées, en-têtes, dépendances vulnérables ;
- pages légales manquantes ou obsolètes, cookies déposés sans consentement ;
- accessibilité (axe-core sur les pages principales) ;
- résultat de `node promptcomplet/scripts/verifier-conformite.mjs`.

Puis propose un **plan de mise en conformité** : les points critiques d'abord. Fais-le valider, et
suis `04-construction.md` pour chaque correction.
