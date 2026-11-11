# Règle 10 — E-mails, SMS et notifications

## E-mails transactionnels (confirmation, mot de passe oublié, reçu…)

- **Fournisseur spécialisé**, avec hébergement des données dans l'UE pour des utilisateurs
  européens (voir `catalogue/services.md`). Jamais d'envoi depuis une boîte personnelle.
- Envoi depuis un **sous-domaine** dédié (ex. `mail.mon-domaine.fr`), avec :
  - **SPF** et **DKIM** configurés et vérifiés ;
  - **DMARC** : commencer par `p=none` avec rapports, puis passer à `quarantine`, puis à `reject` ;
  - adresse de retour personnalisée.
- Les e-mails transactionnels et marketing utilisent des **flux séparés** (sous-domaines ou flux
  distincts) pour protéger la délivrabilité.
- **Modèles** :
  - React Email ;
  - lisibles et accessibles : structure sémantique, `alt` sur les images, contrastes, **version
    texte** ;
  - compatibles mode sombre ;
  - traduits.
- **Contenu** :
  - jamais de mot de passe ;
  - le minimum de données personnelles ;
  - liens avec jeton à usage unique et à durée courte.
- Suivi d'ouverture (pixels) **désactivé par défaut**. S'il est activé, il est soumis au
  consentement en Europe (position de la CNIL).
- Gestion des rebonds et des plaintes : les adresses en échec sont retirées automatiquement.

## E-mails marketing et newsletter

- **Consentement préalable** (case non cochée) dans l'UE, au Royaume-Uni et au Canada (CASL). Sauf
  exception « client existant, produits similaires » là où elle existe. Double confirmation
  (double opt-in) recommandée.
- Lien de **désinscription** dans chaque e-mail, en un clic (en-tête `List-Unsubscribe`, exigé par
  Gmail et Yahoo pour les envois en volume).
- États-Unis (CAN-SPAM) :
  - adresse postale de l'expéditeur ;
  - objet non trompeur ;
  - désinscription traitée sous 10 jours ouvrés.
- Preuve du consentement conservée (date, source, texte accepté).

## Notifications push

- Permission demandée **au bon moment**, après avoir expliqué l'intérêt. Jamais au premier lancement
  sans contexte.
- Types de notifications réglables séparément par l'utilisateur.
- Aucune donnée sensible visible sur l'écran verrouillé.
- Jetons d'appareil stockés côté serveur, protégés, supprimés à la déconnexion et à la suppression
  du compte.

## SMS

- Seulement quand c'est vraiment utile : codes de connexion, alertes critiques.
- SMS marketing :
  - consentement préalable ;
  - mention « STOP » ;
  - horaires et jours d'envoi autorisés selon le pays (voir la fiche pays).
- Protections anti-fraude obligatoires (règle 01, « SMS pumping »).

## Centre de notifications dans l'app

Recommandé si le produit envoie beaucoup de notifications : historique consultable, marquage lu ou
non lu.
