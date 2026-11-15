# Mettre à jour la méthode ZeroTrap

Les fichiers de la méthode sont protégés : l'IA ne peut pas les modifier. La mise à jour est donc
**lancée par la personne elle-même**, dans son terminal. Le script demande une confirmation au
clavier et refuse de s'exécuter depuis l'IA.

## Étapes (l'IA guide, la personne exécute)

1. L'IA explique : « Une mise à jour remplace les règles, les verrous et les modèles par la nouvelle
   version. Ton code, ton dossier `projet/` et tes pages `legal/` ne sont pas touchés. »
2. La personne télécharge la nouvelle version dans un dossier temporaire :

   ```bash
   git clone --depth 1 https://github.com/trahia/ZeroTrap .zerotrap-source
   ```

3. La personne lance, **dans son propre terminal** :

   ```bash
   node .zerotrap-source/zerotrap/scripts/installer.mjs --mise-a-jour --source .zerotrap-source
   ```

   Le script affiche la liste des fichiers modifiés et demande de taper `oui`.
4. Ensuite, l'IA :
   - lit `zerotrap/CHANGEMENTS.md` et résume les nouveautés ;
   - lance `node zerotrap/scripts/verifier-conformite.mjs` ;
   - applique au projet les nouvelles règles qui le concernent (en suivant `05-evolution.md`).
