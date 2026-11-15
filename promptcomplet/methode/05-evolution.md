# Étape 5 — Faire évoluer le projet sans casser la sécurité ni la conformité

À chaque nouvelle fonctionnalité ou modification, **avant** d'écrire le code, passe cette checklist.
Elle est aussi déclenchée par la commande `/nouvelle-fonctionnalite`.

## Checklist d'impact

| Question | Si oui, à faire |
|---|---|
| Collecte-t-elle une **nouvelle donnée personnelle**, ou un nouvel usage d'une donnée existante ? | Ajouter à `config.donnees` (finalité, base légale, durée) ; mettre à jour la politique de confidentialité dans **toutes** les langues ; mettre à jour `projet/registre-traitements.md`. Évaluer si une AIPD (analyse d'impact) est nécessaire. |
| Utilise-t-elle un **nouveau service externe** (API, SDK, hébergeur, outil d'analyse) ? | Ajouter à `config.sous_traitants` (rôle, pays, garanties) ; vérifier le contrat de sous-traitance (DPA) et les transferts hors UE ; mettre à jour la politique de confidentialité. |
| Ajoute-t-elle des **cookies ou traceurs** non essentiels, un contenu tiers intégré (vidéo, carte, réseau social), un pixel ? | Bloquer avant consentement ; mettre à jour le bandeau et la page cookies ; `config.cookies_non_essentiels = true`. |
| Touche-t-elle aux **paiements**, aux prix, aux abonnements ? | Mettre à jour les CGV ; vérifier les règles des stores ; tester les webhooks ; vérifier le droit de rétractation et la résiliation. |
| Ouvre-t-elle un **nouveau pays** ou une **nouvelle langue** ? | Veille légale pour ce pays (`02-veille-legale.md`) ; pages légales dans la langue ; moyens de paiement locaux. |
| Ajoute-t-elle de l'**IA** ? | Suivre `regles/11-ia-dans-le-produit.md` ; `config.ia_dans_le_produit = true` ; mention de transparence. |
| Concerne-t-elle des **mineurs** ? | Vérification d'âge ou consentement parental selon le pays ; pas de publicité ciblée. |
| Permet-elle aux utilisateurs de **publier du contenu** ? | Modération, bouton de signalement, CGU ; `config.contenu_utilisateurs = true`. |
| Permet-elle d'**envoyer des fichiers** (photo de profil, document, pièce jointe) ? | Suivre `regles/01-securite.md`, section 4 (signature, taille, liste blanche, réencodage, antivirus) ; utiliser `kit/web/security/upload-validation.ts` ; `config.televersement_fichiers = true` et `config.preuves.controle_fichiers`. |
| Ajoute-t-elle un **objet connecté**, une offre **SaaS** pour des clients, des **vendeurs professionnels** ou des **influenceurs** ? | Mettre à jour `config` (`objets_connectes`, `logiciel_saas`, `place_de_marche`, `influenceurs`) ; suivre les fiches UE et France (Data Act, P2B, influence commerciale) ; mettre à jour les CGU/CGV. |
| Crée-t-elle un **nouveau rôle** ou de nouveaux droits ? | Mettre à jour le tableau des droits, les règles RLS, et les tests « A ne voit pas les données de B ». |
| Touche-t-elle à l'**authentification**, aux fichiers envoyés, aux paiements, aux droits ? | Lancer `/security-review` après le développement. |
| Corrige-t-elle une **faille de sécurité** ou change-t-elle de version ? | Noter la version et le correctif dans l'historique de `projet/maintenance-securite.md` ; régénérer la SBOM si c'est une version publiée. |
| Change-t-elle quelque chose d'**important pour les utilisateurs** (nouvelles données, nouveau partenaire, prix) ? | Prévenir les utilisateurs (e-mail ou bannière) avant l'entrée en vigueur ; versionner la page légale. |
| Ajoute-t-elle ou modifie-t-elle un **endroit affiché** (formulaire, fiche produit, panier, e-mail, écran d'abonnement, avis) ? | Reprendre la section correspondante de `legal/affichages-obligatoires.md` ; mettre à jour `config.cookies` si un cookie ou un traceur est ajouté ; `config.avis_clients = true` si des avis sont affichés. |

## Versionner les pages légales

Chaque page légale porte en haut : `Dernière mise à jour : <date>`, et en bas un court historique des
versions (date et résumé du changement). Garde les anciennes versions dans l'historique git.

## Puis

- Suis la boucle de travail de `04-construction.md`.
- Lance `node promptcomplet/scripts/verifier-conformite.mjs`. Il vérifie notamment que chaque donnée
  et chaque sous-traitant de `config.json` est bien mentionné dans la politique de confidentialité.
- Note le changement dans `projet/journal.md`.
