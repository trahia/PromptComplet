# Règle 04 — Paiements (non négociable)

## La règle d'or

**On passe toujours par un prestataire de paiement externe reconnu.** C'est lui qui reçoit et
protège les données de carte, gère l'authentification forte (3-D Secure, exigée en Europe par la
DSP2) et la conformité PCI DSS. **Aucune donnée de carte** (numéro, date, cryptogramme) ne transite
par nos serveurs, n'est stockée ni n'apparaît dans les journaux.

## Choisir l'intégration la plus sûre

1. **Page de paiement hébergée par le prestataire** (ex. Stripe Checkout, Payment Links) : la plus
   sûre, avec le périmètre PCI le plus réduit (SAQ A). À privilégier.
2. **Composants intégrés** du prestataire (ex. Stripe Payment Element, dans un iframe) : à utiliser
   seulement si l'expérience l'exige. Avec une CSP adaptée aux domaines du prestataire, et une
   protection contre l'injection de scripts sur la page de paiement.
3. **Jamais** de formulaire de carte fait maison.

## Côté serveur

- Les **montants et les prix sont calculés côté serveur**, jamais repris du client. Les montants
  sont des entiers dans la plus petite unité (centimes).
- La confirmation de paiement vient des **webhooks du prestataire**, avec :
  - **signature vérifiée** ;
  - traitement idempotent (un même événement reçu deux fois ne crée pas deux commandes) ;
  - gestion des réessais.
  Ne crois jamais un « paiement réussi » envoyé par le navigateur ou l'app.
- On ne stocke que les **identifiants** du prestataire (client, paiement, abonnement) et le
  strict nécessaire (montant, statut, date).
- Clés : mode test en développement. Clés réelles saisies par la personne au lancement. Clés
  restreintes quand c'est possible.
- Outils anti-fraude du prestataire activés (ex. Stripe Radar).

## Ce qui est vendu : les règles des stores

| Ce qui est vendu | Dans une app iOS / Android | Sur le web |
|---|---|---|
| Contenu ou fonctionnalité **numérique** (premium, abonnement, crédits) | En principe, les **achats intégrés d'Apple et de Google** (StoreKit 2 / Google Play Billing), gérés idéalement avec RevenueCat. Les règles évoluent (UE : DMA ; États-Unis : liens externes autorisés) : revérifie au lancement. | Prestataire de paiement (Stripe…) ou vendeur officiel (Paddle…) |
| **Produit physique** | Prestataire de paiement (Stripe, Apple Pay, Google Pay…) | Prestataire de paiement |
| **Service réel** (rendez-vous, livraison, cours individuel en direct) | Prestataire de paiement | Prestataire de paiement |

Voir `catalogue/paiements.md` pour les commissions et les prestataires par pays.

## Obligations commerciales (à confirmer dans la fiche de chaque pays)

- **Prix clairs** TTC pour les consommateurs, frais de livraison et durée d'engagement affichés
  avant le paiement.
- **Droit de rétractation** de 14 jours dans l'UE pour la vente à distance, avec ses exceptions
  (contenu numérique fourni immédiatement avec accord exprès…). Depuis le 19 juin 2026, la fonction
  de rétractation en ligne doit être facile d'accès : à confirmer pendant la veille légale.
- **Abonnements** : résiliation aussi simple que la souscription (en France, résiliation « en
  3 clics »), rappel avant reconduction quand la loi l'exige.
- **Factures** conformes aux mentions obligatoires du pays. France : la facturation électronique
  entre entreprises devient obligatoire, d'abord en réception, avec un calendrier selon la taille
  de l'entreprise. À vérifier pendant la veille légale.
- **TVA** : à collecter selon le pays du client (guichet OSS dans l'UE). Un **vendeur officiel**
  (merchant of record, ex. Paddle) peut s'en charger pour les produits numériques.
- **Place de marché** (vente entre utilisateurs) :
  - paiements via une solution prévue pour cela (ex. Stripe Connect), qui vérifie l'identité des
    vendeurs ;
  - obligations DSA de traçabilité des vendeurs professionnels ;
  - déclaration fiscale des revenus des vendeurs (DAC7 dans l'UE).
  Signale-le clairement dans le plan.
- **Affichages obligatoires** (fiche produit, panier, bouton de commande, confirmation,
  abonnements, avis) : voir `legal/affichages-obligatoires.md`, point par point.
- **Pratiques interdites** :
  - fausse réduction : le prix de référence est le plus bas des 30 derniers jours ;
  - supplément payant pré-coché ;
  - faux compte à rebours ou fausse rareté ;
  - faux avis ou avis achetés (UE : directive Omnibus ; États-Unis : FTC 16 CFR 465 ; ⚠️ Royaume-Uni :
    DMCC Act) ;
  - blocage ou redirection selon le pays dans l'UE (règlement géoblocage 2018/302).
- **Abonnements hors de France** : Californie (Automatic Renewal Law modifiée par AB 2863, depuis le
  01/07/2025) : consentement exprès, résiliation en ligne, rappel annuel, preuve du consentement
  conservée 3 ans. ⚠️ Règle fédérale « click-to-cancel » de la FTC : annulée en justice le
  08/07/2025, nouvelle procédure ouverte en mars 2026, à suivre. ⚠️ Royaume-Uni : nouveau régime des
  abonnements (DMCC Act) annoncé pour 2027.
- **Places de marché** :
  - **DAC7** : collecter les informations fiscales des vendeurs, les vérifier et faire la
    déclaration annuelle à l'administration fiscale. Sont exclus les vendeurs sous 30 ventes et
    2 000 € par an (https://www.impots.gouv.fr) ;
  - **encaisser l'argent pour le compte des vendeurs**, ou proposer une cagnotte, un porte-monnaie
    ou des cartes cadeaux, est un service de paiement réglementé (DSP2, directive 2015/2366). On
    passe **toujours** par un prestataire agréé qui le fait pour nous (Stripe Connect, Mangopay…).
    Jamais de fonds détenus par le projet lui-même.
- **TVA hors UE**, si aucun prestataire ne la gère à ta place (Paddle, ou d'autres plateformes qui
  vendent en ton nom) :
  - Royaume-Uni : immatriculation dès la première vente de service numérique pour un vendeur non
    établi, sans seuil ;
  - Suisse : immatriculation dès 100 000 CHF de chiffre d'affaires mondial, s'il y a des ventes en
    Suisse ;
  - ⚠️ États-Unis (sales tax par État) et Canada (TPS/TVH) : à vérifier.
- **Sanctions internationales** : ne pas vendre à des pays ou des personnes sous sanctions
  (carte des sanctions de l'UE : https://www.sanctionsmap.eu ; États-Unis : OFAC). Le prestataire
  de paiement filtre en partie, mais pas tout.

## Moyen de paiement « Autre » proposé par la personne

Évalue-le avec ces critères et donne ton avis dans le plan :
1. Est-ce un **établissement agréé** (établissement de paiement ou de monnaie électronique,
   banque) ? Avec une licence vérifiable ?
2. Est-il conforme PCI DSS ? Gère-t-il l'authentification forte ?
3. Est-il disponible dans le pays d'établissement et pour les clients visés ? Quels sont ses frais ?
4. Réputation, incidents connus, qualité de l'API et de la documentation.

Si un critère essentiel n'est pas rempli, explique le risque simplement et propose une alternative.
Cryptomonnaies : déconseillées, sauf demande expresse et via un prestataire régulé. Paiement à la
livraison : possible, avec une procédure claire.

## Tests

- Paiement réussi, refusé, authentification 3-D Secure, remboursement, litige, échec de webhook,
  abonnement (création, renouvellement, échec, résiliation). Le tout en mode test, avec les cartes
  de test publiées par le prestataire.
- Concurrence : 20 utilisations simultanées d'un même code promo, crédit ou stock limité. Une
  seule doit réussir (règle 01, section 4).
