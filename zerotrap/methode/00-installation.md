# Étape 0 — Installation de la méthode dans le dossier de la personne

Objectif : le dossier de la personne contient la méthode, les verrous sont actifs, et **aucun
lien** ne subsiste avec le dépôt modèle ZeroTrap.

Annonce d'abord à la personne : « J'installe la méthode : 4 petites étapes, environ 2 minutes. »

## 0.1 Vérifier les prérequis

Lance ces vérifications et explique simplement ce qui manque :

| Outil | Commande | Si absent |
|---|---|---|
| Git | `git --version` | Windows : `winget install --id Git.Git` · Mac : `xcode-select --install` |
| Node.js 22.20+ (24 LTS recommandé) | `node --version` | Windows : `winget install OpenJS.NodeJS.LTS` · Mac : `brew install node`. Les scripts de ZeroTrap fonctionnent dès Node 18, mais l'outil d'installation des skills demande Node 22.20 ou plus. |

Après une installation, la personne doit **fermer et rouvrir son terminal** pour que la commande
soit reconnue. Ne tente jamais de te connecter à la place de la personne et ne lui demande jamais
son mot de passe.

## 0.2 Vérifier le dossier

- Le dossier doit être vide, ou ne contenir que des fichiers que la personne veut garder.
- **N'écrase jamais un fichier existant.** S'il y a des fichiers, liste-les et demande quoi faire.

## 0.3 Copier la méthode

Deux cas.

**Cas A — la méthode a été clonée dans `.zerotrap-source/`** (cas normal, voir `DEMARRER.md`) :

```bash
node .zerotrap-source/zerotrap/scripts/installer.mjs --source .zerotrap-source
```

**Cas B — la personne a cloné le dépôt directement comme dossier de projet** :

```bash
node zerotrap/scripts/installer.mjs --sur-place
```

Le script :
1. copie la méthode (sans l'historique git du modèle) et n'écrase rien ;
2. retire les fichiers propres au dépôt modèle (`README.md` et `DEMARRER.md` de présentation, `LICENSE`,
   `SECURITY.md` et `CONTRIBUTING.md` du modèle), puis crée le `SECURITY.md` du projet à partir de
   `zerotrap/legal/modeles/politique-securite-projet.md`. La licence de la méthode reste dans
   `zerotrap/LICENSE` ;
3. crée un dépôt git neuf (`git init -b main`) si besoin, sans aucun lien vers le modèle ;
4. active le contrôle avant commit (`git config core.hooksPath .githooks`) ;
5. crée `projet/journal.md` et le marqueur `zerotrap/.installe` ;
6. supprime le dossier temporaire `.zerotrap-source/`.

En cas B, le script supprime l'historique git **du modèle** (pas celui de la personne). Demande
d'abord confirmation : « Je vais retirer l'historique du modèle pour que ton projet reparte d'une
page blanche et ne soit plus relié à ZeroTrap. D'accord ? »

Si le script affiche une erreur, montre-la à la personne avec une explication simple. Ne
contourne pas le problème à la main.

## 0.4 Activer les protections et installer les skills de base

1. Demande à la personne de taper `/clear`, ou de fermer puis relancer Claude Code dans le dossier.
   Cela recharge `CLAUDE.md` et lance le hook de début de session. Si Claude Code demande de faire
   confiance au dossier, la personne peut accepter : c'est son projet.
2. Après le redémarrage, propose d'installer les **skills de base** listés dans
   `zerotrap/catalogue/skills.md`, section « Socle installé dès le départ ». Explique en une
   phrase à quoi ils servent. Les installations se font **avec l'accord de la personne**, et
   uniquement depuis les sources indiquées dans le catalogue.
3. Enchaîne avec le questionnaire : `zerotrap/methode/01-questionnaire.md`.

## Si quelque chose bloque

| Problème | Explication à donner | Solution |
|---|---|---|
| `Repository not found` ou échec du clonage | L'adresse est mal recopiée, ou internet est coupé | Vérifier l'adresse `https://github.com/trahia/ZeroTrap` et la connexion, puis réessayer |
| `git` ou `node` « n'est pas reconnu » | Le terminal a été ouvert avant l'installation | Fermer et rouvrir le terminal |
| Le dossier contient déjà un projet | La méthode peut s'ajouter à un projet existant | Suivre `zerotrap/methode/08-projet-existant.md` |
