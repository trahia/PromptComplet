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
