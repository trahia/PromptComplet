# Démarrer un projet avec ZeroTrap

## Ce qu'il te faut

1. **Claude Code** : l'application de bureau Claude (onglet Code) ou Claude Code dans un terminal.
   Il faut un abonnement Claude qui inclut Claude Code, par exemple Pro ou Max.
2. **Git** et **Node.js 22 ou plus** (version 24 LTS recommandée). Si tu ne les as pas, Claude te
   dira comment les installer.

**Pas besoin de compte GitHub** : la méthode est publique, Claude la télécharge tout seul.

## Les étapes

1. Crée un **dossier vide** pour ton projet (par exemple `Documents/MonProjet`).
2. Ouvre Claude Code **dans ce dossier**.
3. Copie-colle ce message :

   > Installe la méthode ZeroTrap depuis https://github.com/trahia/ZeroTrap dans
   > ce dossier. Clone-la dans un sous-dossier temporaire `.zerotrap-source`, puis suis
   > exactement le fichier `zerotrap/methode/00-installation.md` de ce clone.

4. Quand Claude te le demande, **ferme puis relance Claude Code dans le même dossier**. Cela active
   les protections automatiques. Si Claude Code te demande de faire confiance au dossier, accepte :
   c'est ton projet.
5. Tape `/demarrer` (ou écris « on commence »), puis réponds aux questions. Tu peux toujours dire
   « je ne sais pas » : Claude te proposera une option.

## Tu as déjà un projet ? Fais d'abord un audit, sans rien modifier

Claude analyse ton projet en **lecture seule**. Il te donne dans la discussion la liste des problèmes,
classée par gravité, avec pour chacun le fichier, la règle ou la loi concernée et la correction
proposée. Il ne modifie, n'installe et ne commite **rien**. Vous décidez ensuite ensemble quoi corriger,
point par point.

> **Attention** : n'utilise pas le message d'installation (plus haut) sur un projet existant si tu
> veux seulement savoir où tu en es. L'installation **ajoute des fichiers** à ton projet ; l'audit,
> lui, ne touche à rien.

**Avec Claude Code :**

1. Ouvre une **nouvelle discussion** dans le dossier de ton projet, même si tu en as déjà une en
   cours. Ton code est sur le disque : rien n'est perdu. Dans une discussion où Claude a lui-même écrit
   le code, il a tendance à le juger avec indulgence, et l'audit risque de manquer de place.
2. Choisis un mode où Claude **te demande la permission** avant d'agir (le mode par défaut), ou le
   **mode Plan**, qui bloque les modifications. Évite les modes qui acceptent tout seuls (« Accept
   edits », « Auto », « Bypass permissions ») : « sans rien modifier » est une consigne donnée à
   Claude, pas un verrou. Dis oui seulement au téléchargement de la méthode dans le dossier
   temporaire. Si le mode Plan bloque aussi ce téléchargement, repasse en mode par défaut juste pour
   ça.
3. Colle :

> Fais un audit ZeroTrap de ce projet **sans rien modifier**. Clone la méthode
> https://github.com/trahia/ZeroTrap dans un dossier temporaire **en dehors** de ce projet,
> puis suis exactement `zerotrap/methode/09-audit-seul.md` de ce clone. Donne-moi la liste
> des problèmes dans la discussion.

**Avec claude.ai (navigateur)**, dans un projet Claude : ajoute aux connaissances du projet, via
l'intégration GitHub, le dépôt ZeroTrap **et** celui de ton projet. Il faut pour cela un compte
GitHub. Coller seulement le lien ne suffit pas : par un lien, Claude ne peut pas lire tout un dépôt.
Ouvre ensuite une **nouvelle discussion** dans ce projet Claude, puis colle :

> Suis le fichier `zerotrap/methode/09-audit-seul.md` du dépôt ZeroTrap pour auditer mon
> projet, sans rien modifier. Donne-moi la liste des problèmes classée par gravité.

Sur claude.ai, Claude ne peut de toute façon rien modifier dans ton code. En revanche, il ne peut ni
lancer les tests ni les scanners, et un très gros projet peut ne pas tenir en entier. Pour les
corrections, Claude Code est plus adapté.

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

Ton projet reste dans ton dossier. Le lien avec le dépôt ZeroTrap est coupé pendant
l'installation, et un verrou empêche d'y envoyer ton travail. Pour sauvegarder ton projet en
ligne, Claude t'aidera à créer **ton propre** dépôt GitHub privé.
