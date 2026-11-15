# Politique de sécurité de PromptComplet

Ce fichier concerne **la méthode PromptComplet elle-même**. La politique de sécurité de ton projet
est créée à l'installation, à partir de `promptcomplet/legal/modeles/politique-securite-projet.md`.

## Signaler une faille

Une faille dans PromptComplet peut toucher **tous les projets** qui l'utilisent. Merci de **ne pas la
publier** : pas d'issue publique, pas de message public.

Signale-la en privé avec le bouton **« Report a vulnerability »** de l'onglet **Security** du
dépôt : https://github.com/trahia/PromptComplet/security/advisories/new

Exemples de ce qui nous intéresse :

- un moyen de contourner un verrou : hook Claude Code, contrôle avant commit, vérification de
  conformité, intégrité ;
- un script de la méthode (`promptcomplet/scripts/`, `.claude/hooks/`) qui pourrait être détourné ;
- une règle ou un composant du kit (`promptcomplet/kit/`) qui pousserait l'IA à produire du code
  vulnérable ;
- un workflow GitHub qui exposerait des secrets ou des droits.

Indique, si possible :

- le problème et son impact ;
- les étapes pour le reproduire ;
- la version concernée, indiquée dans `promptcomplet/VERSION`.

PromptComplet est maintenu bénévolement. Nous accusons réception dès que possible, en général sous
quelques jours, et nous te tenons informé de la correction.

## Versions prises en charge

Seule la **dernière version** reçoit des corrections. Pour mettre à jour la méthode dans un projet,
suis `promptcomplet/methode/07-mise-a-jour.md`.

## Ce qui n'est pas une faille de sécurité

Une information juridique fausse ou dépassée, ou une page légale incomplète, n'est pas une faille de
sécurité. C'est tout de même important : ouvre une issue avec la source officielle, comme expliqué
dans [CONTRIBUTING.md](CONTRIBUTING.md).
