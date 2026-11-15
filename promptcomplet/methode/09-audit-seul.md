# Audit seul d'un projet existant : on analyse, on ne touche à rien

Pour un projet déjà construit, ou en cours de construction, dont la personne veut connaître les
problèmes **avant** de décider quoi changer. Résultat : une liste claire, classée par gravité, dans
la discussion. Les corrections viennent **après**, une par une, avec l'accord de la personne.

## Règle absolue : lecture seule

Pendant tout l'audit, **le projet ne change pas d'un octet**.

| Interdit | Autorisé |
|---|---|
| Créer, modifier, renommer ou supprimer un fichier du projet | Lire les fichiers |
| Installer ou mettre à jour un paquet (`npm install`, `pip install`…) | `git status`, `git log`, `git ls-files`, `git show` (lecture) |
| `git commit`, `checkout`, `reset`, `stash`, `clean`, `pull`, `push`, ou changer la config git | Rechercher dans le code (grep) |
| Lancer un build, une migration, un script du projet, un formatage automatique | Avec l'accord de la personne, des outils en lecture seule : `npm audit` (sans `fix`), OSV-Scanner, Gitleaks. Leurs rapports vont **hors du projet** |
| Copier la méthode PromptComplet **dans** le projet | Cloner la méthode dans un dossier temporaire **en dehors** du projet |
| Corriger « au passage », même une faute de frappe | Noter le problème dans la liste |

Si un outil a besoin d'écrire (cache, rapport), il écrit dans un dossier temporaire du système, hors du
projet. En cas de doute sur une commande, ne la lance pas : demande.

## Où lire la méthode

- **Claude Code** : `git clone --depth 1 <dépôt PromptComplet> <dossier temporaire hors du projet>`,
  puis lis les fichiers de ce clone. Supprime ce dossier temporaire à la fin.
- **claude.ai (navigateur)** : la personne ajoute le dépôt PromptComplet **et** le dépôt de son projet
  aux connaissances du projet Claude, via l'intégration GitHub. Claude ne peut alors rien modifier : il
  lit seulement. Limites : il ne peut lancer ni tests ni scanners, et un très gros projet peut ne pas
  tenir en entier. Dis-le dans le rapport.

## Étape 1 — Comprendre le projet (5 minutes)

Déduis du code, sans poser de question pour ce que le code révèle déjà :
- type (site, app, les deux), technologies, hébergeur, base de données ;
- pays et langues visés (langues de l'interface, devises, mentions) ;
- comptes, modes de connexion, paiements et ce qui est vendu ;
- données personnelles collectées, services externes (SDK, API, outils d'analyse) ;
- fonctionnalités sensibles : contenu publié, fichiers envoyés, IA, mineurs, santé, abonnements,
  avis, place de marché.

Présente ce résumé en quelques lignes et fais-le **valider** : un pays oublié change tout le rapport.

## Étape 2 — Passer chaque domaine au crible

Pour chaque domaine, lis le fichier de règles correspondant, puis cherche les écarts dans le code :

| Domaine | Référence |
|---|---|
| Secrets dans le code **et dans l'historique git** | `regles/01-securite.md`, section 3 |
| Contrôle d'accès, RLS, colonnes modifiables par le client, IDOR | `regles/01-securite.md`, section 1 |
| Validation des entrées, fichiers envoyés, SSRF, opérations simultanées | `regles/01-securite.md`, section 4 |
| En-têtes de sécurité, cookies de session, CORS, CSRF | `regles/01-securite.md`, section 5 |
| Authentification, sessions, redirections, changement d'e-mail | `regles/03-authentification.md` |
| Paiements, webhooks, règles des stores | `regles/04-paiements.md` |
| Dépendances, lockfile, scripts d'installation, GitHub Actions | `regles/01-securite.md`, section 8 |
| Données personnelles, sous-traitants, transferts, durées, droits | `regles/02-donnees-personnelles.md` |
| Cookies et traceurs (SDK chargés avant le consentement) | `regles/02`, `legal/affichages-obligatoires.md`, section 2 |
| **Tout ce qui doit être affiché**, endroit par endroit | `legal/affichages-obligatoires.md` |
| Pages légales : présence, contenu, langues, à jour | `legal/modeles/`, `legal/matrice-obligations.md` |
| Lois propres à chaque pays visé | `legal/pays/<pays>.md` |
| Accessibilité (lecture du code : libellés, contrastes, clavier, alternatives) | `regles/05-accessibilite.md` |
| E-mails, notifications, SMS | `regles/10-emails-notifications.md` |
| IA dans le produit | `regles/11-ia-dans-le-produit.md` |
| Copyright et licences (polices, images, dépendances) | `regles/06-copyright-licences.md` |
| Applications mobiles (stores, manifeste de confidentialité) | `regles/01`, section 10, et `methode/06-lancement.md`, section 8 |

**Secret trouvé** : préviens la personne **tout de suite**, sans jamais afficher la valeur (seulement
le fichier et les 4 premiers caractères). Explique qu'elle doit **révoquer la clé chez le
fournisseur** : la supprimer du code ne suffit pas, elle reste dans l'historique.

## Étape 3 — Le rapport, dans la discussion

```markdown
# Audit PromptComplet — <projet> — <date>

## En bref
<3 lignes : état général, nombre de problèmes par gravité, les 3 priorités>

## Problèmes
| N° | Gravité | Problème | Où | Pourquoi (règle ou loi) | Risque concret | Correction proposée | Effort |
|---|---|---|---|---|---|---|---|
| 1 | Critique | … | `src/…:42` | … | … | … | 1 h |

## Ce qui est déjà bien
## Ce que je n'ai pas pu vérifier (et pourquoi)
## Questions pour toi (ce que le code ne dit pas : identité de l'éditeur, hébergeur…)
## Ordre de correction proposé
```

Gravités :
- **Critique** : fuite de données possible, accès non autorisé, secret exposé, paiement contournable.
  À corriger avant toute autre chose, et avant toute mise en ligne.
- **Élevée** : obligation légale non respectée (page ou mention manquante, cookies sans
  consentement…), ou faille exploitable sous conditions.
- **Moyenne** : bonne pratique de sécurité manquante, accessibilité incomplète, dette qui deviendra
  un risque.
- **Faible** : amélioration conseillée.

Sois honnête :
- chaque problème cite le fichier et la ligne ;
- ce qui n'a pas pu être vérifié est listé comme tel, pas présenté comme conforme ;
- jamais « c'est 100 % conforme » ni « c'est 100 % sécurisé ».

Le rapport reste **dans la discussion**. Ne l'écris dans un fichier que si la personne le demande, et
de préférence **hors du projet**.

## Étape 4 — Ensuite, seulement avec l'accord de la personne

1. La personne choisit ce qu'elle veut corriger, dans l'ordre proposé ou non.
2. Chaque correction est faite **une par une**, dans Claude Code :
   - explication d'abord ;
   - modification la plus petite possible ;
   - tests ;
   - vérification que rien d'autre n'a changé ;
   - commit séparé.
3. Une fois les problèmes critiques réglés, propose d'**installer la méthode** pour garder les verrous
   (`methode/08-projet-existant.md`). Préviens que les contrôles GitHub ajoutés peuvent passer au
   rouge tant que tous les problèmes ne sont pas corrigés, et qu'un ancien `CLAUDE.md` sera déplacé
   dans `projet/consignes.md`.
