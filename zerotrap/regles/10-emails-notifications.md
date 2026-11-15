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
- **Pixels de suivi d'ouverture** (France, recommandation CNIL du 14/04/2026, délibération
  2026-042) :
  - c'est un traceur, soumis au **consentement** comme un cookie, distinct de l'accord pour
    recevoir les e-mails ;
  - l'inactivité vaut refus ;
  - prévoir un lien de retrait de ce consentement en bas de chaque e-mail ;
  - un message commercial glissé dans un e-mail transactionnel reste soumis au consentement ;
  - par défaut, ZeroTrap **désactive** le suivi d'ouverture.
- **Prospection en France** :
  - **par téléphone** : consentement préalable obligatoire depuis le 11/08/2026 (loi 2025-594,
    art. 13 ; Bloctel n'est plus la règle). Consentement valable un an au plus, preuve conservée
    3 ans. Appels en semaine, de 10 h à 13 h et de 14 h à 20 h ;
  - **par e-mail vers des professionnels** : possible sans consentement préalable, seulement si le
    message concerne leur métier, avec un moyen simple de s'opposer ;
  - sources : https://www.cnil.fr/fr/demarchage-commercial et
    https://www.economie.gouv.fr/dgccrf/les-fiches-pratiques/les-regles-du-demarchage-telephonique-simposant-aux-entreprises

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
- **États-Unis** :
  - enregistrement **A2P 10DLC** de la marque et de la campagne auprès du fournisseur de SMS
    (sinon, les messages sont bloqués) ;
  - **consentement écrit préalable** pour les SMS marketing (TCPA) ;
  - horaires limités ;
  - mots-clés STOP et HELP. ⚠️ Vérifier l'état des règles de la FCC.

## Centre de notifications dans l'app

Recommandé si le produit envoie beaucoup de notifications : historique consultable, marquage lu ou
non lu.
