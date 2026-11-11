# Paiements : prestataires par pays et règles des stores

> **Prix approximatifs vérifiés le 2026-11-11.** Revérifie avant de présenter s'ils datent de plus de
> 3 mois. Règle absolue : `regles/04-paiements.md`. Toujours un prestataire reconnu, jamais de
> données de carte chez nous.

## Le « vendeur officiel » (merchant of record), expliqué simplement

C'est un prestataire qui devient **le vendeur légal** à ta place :
- il encaisse ;
- il calcule et reverse la TVA de chaque pays ;
- il gère les factures et les remboursements ;
- puis il te reverse le reste.

C'est plus cher, mais cela évite de gérer la fiscalité internationale. Idéal pour vendre un logiciel
ou un produit numérique dans le monde entier.

## Par pays (selon le pays d'établissement de la personne)

| Pays | Recommandé | Alternatives | Prix indicatifs | Moyens locaux à proposer |
|---|---|---|---|---|
| **France / UE** | **Stripe** | Mollie, Adyen (grands volumes), PayPal (en complément), GoCardless (prélèvement SEPA) | Stripe : cartes UE environ 1,5 % + 0,25 € ; SEPA 0,35 €. Mollie : cartes environ 1,8 % + 0,25 €. | Carte, Apple Pay, Google Pay, SEPA |
| **Belgique** | Stripe ou Mollie | | Bancontact chez Mollie : environ 1,4 % + 0,25 € | **Bancontact**, Wero |
| **Pays-Bas** | Mollie ou Stripe | | iDEAL chez Mollie : environ 0,32 € | **iDEAL / Wero** |
| **Suisse** | Stripe | Mollie (TWINT) | Stripe : cartes suisses environ 2,9 % + 0,30 CHF | **TWINT** |
| **Royaume-Uni** | Stripe | GoCardless (Bacs) | Stripe : cartes UK environ 1,5 % + 0,20 £ | Bacs |
| **Canada** | Stripe | | environ 2,9 % + 0,30 $ CA | |
| **États-Unis** | Stripe | | environ 2,9 % + 0,30 $ (⚠️ à revérifier) | ACH, Apple Pay |
| **Israël** | ⚠️ **Stripe n'est pas disponible pour les entreprises israéliennes.** Prestataires locaux agréés : **Cardcom**, **Tranzila**. | PayPlus, Grow (Meshulam), Bit | Frais à demander aux prestataires | **Bit**, cartes locales |
| **Maroc** | **CMI** (passerelle principale) | Agrégateurs agréés par Bank Al-Maghrib | environ 2,5 à 3 % (indicatif) | Cartes CMI, paiement à la livraison |
| **Tunisie** | **ClicToPay**, Konnect | Flouci | à demander | Paiement à la livraison très courant |
| **Algérie** | **SATIM** (CIB / Edahabia), via une banque ou Algérie Poste | Slick-Pay, PayPart.dz | à demander. Entité locale et compte en dinars exigés. Agrément de 1 à 3 mois. | CIB, Edahabia |
| **Sénégal / Côte d'Ivoire** | **Wave**, Orange Money via **PayDunya** ou **CinetPay** | Stripe via Paystack (Côte d'Ivoire seulement) | environ 1 à 3,5 % selon le moyen (sources contradictoires) | Wave, Orange Money, MTN Money |

Pour le Maghreb et l'Afrique de l'Ouest, aucune solution mondiale simple n'existe. Utilise un
prestataire local pour les clients locaux. Ouvrir un compte Stripe via une société étrangère pour les
clients internationaux est une décision **juridique et fiscale** : à faire valider par un professionnel.

## Vendeurs officiels (produits numériques, monde entier)

| Prestataire | Prix indicatif |
|---|---|
| Paddle | 5 % + 0,50 $ par transaction |
| Lemon Squeezy | 5 % + 0,50 $ (désormais lié à Stripe : vérifier les conditions) |

## Règles des stores (apps iOS et Android)

| Sujet | Règle (au 2026-11-11, ⚠️ évolue souvent) |
|---|---|
| Apple 3.1.1 | Contenu ou fonctionnalité **numérique** débloqué dans l'app = **achat intégré Apple** obligatoire, sauf exceptions ci-dessous. |
| Apple 3.1.3(e) | **Produits physiques et services consommés hors de l'app** = paiement classique autorisé (Stripe, Apple Pay…). |
| Apple 3.1.3(d) | Services en direct **individuels** (cours particulier, consultation) = paiement hors achat intégré possible. |
| Commission Apple | 30 %. **15 %** avec le Small Business Program (moins de 1 M$ de revenus par an), et pour les abonnements après la première année. |
| Apple dans l'UE (DMA, depuis le 01/10/2026) | Conditions européennes uniques. Commission de 26 % (15 % réduit) avec l'achat intégré Apple, 20 % (10 %) avec un autre moyen de paiement dans l'app, 15 % (10 %) pour un lien vers une offre externe. |
| Apple aux États-Unis | Liens vers des achats externes autorisés, sans commission pour l'instant. ⚠️ Recours devant la Cour suprême en cours (décision attendue d'ici juin 2027). |
| Google Play | Facturation Google Play exigée pour le numérique. Frais historiques de 15 % jusqu'à 1 M$, puis 30 %. Aux États-Unis, liens externes et facturation alternative autorisés depuis le 29/10/2025, avec des frais de service. ⚠️ Barèmes à revérifier. |
| RevenueCat | Gratuit jusqu'à 2 500 $ de revenus suivis par mois, puis 1 %. Simplifie les achats intégrés iOS et Android. |

## Sources

- Disponibilité de Stripe par pays : https://stripe.com/global
- Tarifs Stripe : https://stripe.com/fr/pricing
- Tarifs Mollie : https://www.mollie.com/pricing
- Adyen : https://www.adyen.com/pricing
- GoCardless : https://gocardless.com/pricing/
- Paddle : https://www.paddle.com/pricing
- Lemon Squeezy : https://www.lemonsqueezy.com/pricing
- Règles de l'App Store : https://developer.apple.com/app-store/review/guidelines/
- Apple dans l'UE : https://developer.apple.com/support/dma-and-apps-in-the-eu/
- Small Business Program : https://developer.apple.com/app-store/small-business-program/
- Google Play (paiements) : https://support.google.com/googleplay/android-developer/answer/15582165
- RevenueCat : https://www.revenuecat.com/pricing/
