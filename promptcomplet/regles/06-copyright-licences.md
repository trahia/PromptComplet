# Règle 06 — Copyright, marques et licences (non négociable)

## Ce que tu ne fais jamais

- Reproduire du code, un design, des textes, des images, des icônes, des polices, de la musique, des
  vidéos ou des marques **protégés** sans licence qui l'autorise.
- Recréer à l'identique l'apparence d'un produit existant : sa charte, son logo, ses écrans
  caractéristiques, son nom. **S'inspirer** de bonnes pratiques générales est permis ; **copier**
  une identité ne l'est pas.
- Récupérer automatiquement (« scraper ») le contenu d'un autre site pour le republier.
- Utiliser une marque dans le nom ou le logo du produit (« l'Instagram des plantes »), ou utiliser
  le logo d'une entreprise hors de sa charte officielle.
- Utiliser des captures d'écran d'autres apps dans le marketing.

## Code et dépendances

| Licence | Utilisable ? |
|---|---|
| MIT, BSD, ISC, Apache-2.0, Unlicense, 0BSD | Oui. Garder la mention de copyright, et le fichier NOTICE pour Apache-2.0. |
| MPL-2.0, LGPL | Oui avec précautions : modifications du fichier ou de la bibliothèque à redistribuer. Le signaler. |
| GPL, AGPL | **À éviter** dans un produit non open source. L'AGPL impose de publier le code même pour un service en ligne. Seulement avec l'accord éclairé de la personne. |
| Aucune licence | **Interdit** : sans licence, rien n'est autorisé par défaut. |
| Licences « non commerciales » (CC BY-NC…) | Interdites si le projet est ou peut devenir commercial. |

- Vérifie la licence avant d'ajouter une dépendance.
- Avant le lancement, génère l'inventaire avec un outil reconnu, par exemple
  `npx license-checker --summary` côté npm, ou l'équivalent de l'écosystème.
- Liste les licences dans `projet/licences.md`.
- Si des licences exigent une attribution, ajoute une page ou un écran « Licences tierces »
  (réglages de l'app, pied de page du site).
- Quand tu reprends un exemple de documentation ou un extrait open source, respecte sa licence et
  cite-le. Ne recopie pas de longs passages de code d'un projet connu.

## Polices

- Uniquement des polices sous licence libre (SIL Open Font License, par exemple la plupart des polices
  de Google Fonts) ou achetées avec une licence couvrant l'usage (web, app, nombre de vues).
- Polices **hébergées avec le projet** (règle 02 : pas d'appel à un CDN tiers).

## Images, icônes, illustrations, sons, vidéos

- Sources autorisées :
  - créations de la personne ;
  - banques sous licence claire (Unsplash, Pexels…, en respectant leurs conditions) ;
  - jeux d'icônes open source (Lucide : ISC ; Heroicons : MIT ; Phosphor : MIT…) ;
  - achats sous licence.
- Pour chaque ressource : source, licence, date et preuve dans `projet/licences.md`.
- Images générées par IA : vérifier les conditions de l'outil. Prévenir la personne que leur
  protection par le droit d'auteur est incertaine selon les pays. Ne jamais demander « dans le style
  de » un artiste vivant identifiable.
- Cartes : OpenStreetMap exige une attribution visible (« © contributeurs OpenStreetMap ») et sa
  licence ODbL.

## Boutons et logos des fournisseurs

« Continuer avec Google », « Sign in with Apple », badges App Store et Google Play, logos des moyens de
paiement : utilise **les ressources officielles**, en respectant leurs chartes (taille, couleurs,
espace). Ne les redessine pas.

## Contenu publié par les utilisateurs

- Les CGU prévoient la licence que l'utilisateur accorde sur ses contenus, et interdisent de publier
  des contenus dont il n'a pas les droits.
- Une procédure de signalement et de retrait est en place : formulaire de signalement (DSA en
  Europe). Aux États-Unis, enregistrer un « agent DMCA » donne droit à la protection de l'hébergeur.

## Protéger la création de la personne

Propose, dans le plan :
- de vérifier puis **déposer** le nom et le logo comme marque (INPI, EUIPO, WIPO) ;
- de garder la preuve de création des contenus ;
- de prévoir un contrat de cession de droits si des prestataires (designers, développeurs)
  interviennent.
