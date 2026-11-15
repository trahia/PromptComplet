# Affichages obligatoires : quoi, où, quand

Tout ce qui **doit être visible** pour l'utilisateur, rangé selon **l'endroit** où il doit
apparaître. Un oubli suffit à mettre l'éditeur en tort, même si tout le reste est parfait.

- À relire pendant le plan (`03-plan-projet.md`), à chaque nouvelle fonctionnalité
  (`05-evolution.md`) et avant le lancement (`06-lancement.md`).
- La colonne « Contrôle » indique ce que `verifier-conformite.mjs` vérifie seul. **Tout le reste est
  à vérifier à la main**, page ouverte.
- Les bases légales sont celles de la France et de l'UE, sauf mention contraire. Les fiches pays
  ajoutent les obligations locales.

> Fiche mise à jour le 2026-11-15. Revérifier selon `methode/02-veille-legale.md`.

## 1. Sur toutes les pages (pied de page) et dans les réglages de l'app

| Quoi | Quand | Base | Contrôle |
|---|---|---|---|
| Lien « Mentions légales » | Europe | LCEN art. 1-1 | page exigée, preuve `liens_legaux` |
| Lien « Politique de confidentialité » | Toujours | RGPD art. 12-13 ; CalOPPA (lien visible depuis l'accueil) | idem |
| Lien « CGU » / « CGV » | Comptes, contenu publié / paiement | Code conso L221-5 | idem |
| Lien « Gérer mes cookies », accessible en permanence | Cookies non essentiels | CNIL, lignes directrices 2020 | preuve `bandeau_cookies` |
| Lien « Accessibilité : [non / partiellement / totalement] conforme » | France, entités soumises au RGAA ; recommandé partout | Loi 2005-102 art. 47 | page `declaration-accessibilite` exigée |
| Lien « Do Not Sell or Share My Personal Information » | Publicité ciblée + États-Unis | CCPA | preuve `opt_out_vente_partage` |
| Lien « Limit the Use of My Sensitive Personal Information » | Données sensibles utilisées au-delà du nécessaire + Californie | CCPA | à la main |

## 2. Bandeau cookies (premier niveau) et page cookies (second niveau)

| Quoi | Où | Base | Contrôle |
|---|---|---|---|
| Finalités en clair, boutons « Tout accepter » et « Tout refuser » au même niveau, fermer = refuser | Bandeau | CNIL 2020 ; art. 82 loi Informatique et Libertés | kit `CookieConsent` |
| **Liste exhaustive des partenaires** (responsables de traitement), accessible depuis le bandeau et en permanence | Bandeau puis page cookies | CNIL 2020 | **chaque `config.cookies[].fournisseur` doit apparaître dans la page cookies** |
| **Chaque cookie** : nom, fournisseur, finalité, durée, catégorie | Page cookies | RGPD art. 13 (durée) ; exigé par plusieurs autorités (Belgique notamment) | **chaque `config.cookies[].nom` doit apparaître dans la page cookies** |
| Conséquences d'un refus, durée de conservation du choix (6 mois conseillés) | Page cookies | CNIL | mot-clé contrôlé |
| Signal GPC respecté (refus de la vente/du partage) | Technique | CCPA et autres États américains | kit `consent.ts` |

## 3. Chaque formulaire qui collecte des données (inscription, contact, newsletter, commande)

| Quoi | Base | Contrôle |
|---|---|---|
| **Mention d'information courte sous le formulaire** : qui, pourquoi, lien vers la politique, droits (modèle `modeles/mention-formulaire.md`) | RGPD art. 13 | preuve `mention_formulaire` (comptes ou newsletter) |
| Champs facultatifs signalés comme tels (sinon, ils sont présumés obligatoires) | RGPD art. 13(2)(e) | à la main |
| Case de consentement **non pré-cochée** pour la newsletter, distincte des CGU | RGPD art. 7 ; CPCE L34-5 | à la main |
| Âge minimum, et consentement parental en dessous de 15 ans en France | Loi I&L art. 45 | preuve `verification_age` |

## 4. Fiche produit ou fiche offre (vente aux consommateurs)

| Quoi | Quand | Base | Contrôle |
|---|---|---|---|
| Caractéristiques essentielles, prix **TTC**, frais en plus (livraison…) | Toujours | Code conso L111-1, L112-1 | à la main |
| Prix à l'unité de mesure (kg, litre) | Produits alimentaires et assimilés | Arrêté du 16/11/1999 | à la main |
| **Annonce de réduction** : le prix de référence est le **prix le plus bas des 30 derniers jours** | Promotions | Code conso L112-1-1 (directive Omnibus) | à la main |
| Délai de livraison ou d'exécution | Toujours | L111-1, L216-1 | à la main |
| **Sécurité du produit** : nom et adresse du fabricant, personne responsable dans l'UE s'il est hors UE, identifiant du produit (modèle, lot), avertissements et consignes | Produits physiques vendus dans l'UE | Règlement GPSR 2023/988, art. 19 (depuis le 13/12/2024) | avertissement automatique |
| Garanties légales et commerciales, service après-vente | Toujours | L111-1 | à la main |
| Vendeur professionnel ou particulier (et droits qui en découlent) | Place de marché | L111-7 | avertissement automatique |

## 5. Avis clients

| Quoi | Base | Contrôle |
|---|---|---|
| Dire **si les avis sont contrôlés et comment** (page ou encadré accessible depuis les avis) | Code conso L111-7-2, D111-16 à D111-19 ; directive Omnibus | page CGU : mot-clé contrôlé si `avis_clients` |
| Date de chaque avis ; critères de classement des avis | D111-17 | à la main |
| Motif communiqué à l'auteur d'un avis refusé | D111-18 | à la main |
| **Jamais** de faux avis, d'avis achetés ou d'avis négatifs masqués | L121-4 (pratiques trompeuses) ; États-Unis : FTC 16 CFR 465 (depuis le 21/10/2024) | à la main |

## 6. Panier et tunnel de commande

| Quoi | Base | Contrôle |
|---|---|---|
| Moyens de paiement acceptés et restrictions de livraison, **dès le début** de la commande | L221-14 | à la main |
| **Récapitulatif** de la commande (articles, prix total, frais) avec possibilité de corriger les erreurs avant de valider | L221-14 ; Code civil art. 1127-2 | à la main |
| Acceptation des CGV (lien + case ou mention claire) | L221-5 | à la main |
| **Bouton de validation : « Commande avec obligation de paiement »** ou formule sans ambiguïté (« Payer », « Acheter maintenant »). Jamais « Valider » ni « Continuer » seuls | L221-14, à peine de nullité ; directive 2011/83 art. 8(2) | preuve `bouton_commande` |
| Contenu numérique fourni tout de suite : **case** d'accord exprès et de renonciation au droit de rétractation | L221-28 13° | à la main |
| Aucune case pré-cochée qui ajoute un supplément payant | Directive 2011/83 art. 22 | à la main |
| Aucun faux compte à rebours ni fausse rareté | Pratiques déloyales, annexe I directive 2005/29 | à la main |
| Pas de blocage ni de redirection selon le pays ou la nationalité dans l'UE, cartes des autres pays de l'UE acceptées | Règlement géoblocage 2018/302 | à la main |

## 7. Après la commande

| Quoi | Base | Contrôle |
|---|---|---|
| **E-mail de confirmation** sur support durable : récapitulatif, CGV, informations sur la rétractation et **formulaire type de rétractation** | L221-13, L221-5 7° et annexe R221-1 | preuve `email_confirmation_commande` |
| Fonction « Se rétracter du contrat » en ligne | Directive 2023/2673, depuis le 19/06/2026 | preuve `retractation_en_ligne` |
| Archivage du contrat pendant **10 ans** quand le montant atteint 120 €, avec accès pour le client | L213-1, D213-1 | à la main |
| Facture avec les mentions obligatoires (et facturation électronique entre entreprises) | Code de commerce L441-9 ; CGI | à la main |

## 8. Abonnements

| Quoi | Base | Contrôle |
|---|---|---|
| Prix, durée, renouvellement automatique et date du prochain prélèvement, **avant** l'engagement | L221-5 ; Californie : Automatic Renewal Law | à la main |
| **Résiliation en ligne en quelques clics** (« Résilier mon abonnement »), aussi simple que la souscription | France L215-1-1 (depuis le 01/06/2023) ; Allemagne § 312k BGB ; Californie ARL (AB 2863, depuis le 01/07/2025) | preuve `resiliation_abonnement` |
| **Rappel avant reconduction tacite** d'un contrat à durée déterminée (1 à 3 mois avant la date limite pour résilier) | L215-1 (loi Chatel) | mot-clé contrôlé dans les CGV |
| Rappel annuel et preuve du consentement conservée 3 ans | Californie ARL | à la main |
| ⚠️ Royaume-Uni : nouveau régime des abonnements (DMCC Act), entrée en vigueur annoncée pour 2027 | DMCC Act 2024 | à vérifier |

## 9. Contenus publiés par les utilisateurs, places de marché

| Quoi | Base | Contrôle |
|---|---|---|
| **Point de contact unique** (pour les utilisateurs et pour les autorités), publié et facile à trouver | DSA art. 11 et 12 (toutes tailles) | mot-clé contrôlé dans les CGU |
| Règles de modération dans les CGU, bouton de signalement, motivation des décisions | DSA art. 14, 16 et 17 | preuve `signalement_contenu` |
| Mention « Publicité » sur les contenus sponsorisés | DSA art. 26 ; LCEN art. 20 | à la main |
| Critères de classement des offres, vendeur pro ou particulier | L111-7 ; P2B art. 5 | mot-clé contrôlé si place de marché |
| Royaume-Uni : évaluation des risques de contenus illégaux et d'accès des enfants | Online Safety Act (depuis le 17/03/2025) | fichier exigé (voir `royaume-uni.md`) |

## 10. Publicité, influence et e-mails

| Quoi | Base | Contrôle |
|---|---|---|
| E-mails commerciaux : expéditeur identifiable, lien de désinscription dans chaque e-mail | CPCE L34-5 ; CAN-SPAM | preuve `desinscription_emails` |
| **Pixels de suivi d'ouverture** dans les e-mails : soumis au consentement, l'inactivité vaut refus. Lien de retrait de ce consentement en pied d'e-mail | CNIL, recommandation du 14/04/2026 (délibération 2026-042) | avertissement automatique (newsletter + France) |
| SMS commerciaux : identification et moyen gratuit de se désinscrire (« STOP ») | CPCE L34-5 ; États-Unis : TCPA | à la main |
| Publications d'influenceurs : « Publicité » ou « Collaboration commerciale » | Loi 2023-451 | avertissement automatique |
| Interaction avec une IA signalée, contenus générés marqués | AI Act art. 50 | preuve `mention_ia` |

## 11. Applications mobiles

| Quoi | Base | Contrôle |
|---|---|---|
| Lien vers la politique de confidentialité dans la fiche du store **et** dans l'app | Apple 5.1.1 ; Google Play | preuve `liens_legaux` |
| Suppression du compte depuis l'app (et page web pour Google Play) | Apple 5.1.1(v) ; Google Play | preuves `suppression_compte`, `page_web_suppression_compte` |
| Texte clair pour chaque autorisation (caméra, position…) au moment où elle est demandée | Apple, Android ; RGPD art. 13 | à la main |
| Demande App Tracking Transparency avant tout suivi publicitaire | Apple 5.1.2 | à la main |
| **Écran « Licences open source »** (mentions de copyright des bibliothèques) | Licences MIT, BSD, Apache-2.0 | preuve `licences_tierces` |
| Fiche de confidentialité (Apple) et « Sécurité des données » (Google) fidèles | Règles des stores | à la main |

## 12. Dans la politique de confidentialité (selon le pays)

| Quoi | Quand | Contrôle |
|---|---|---|
| Droit de déposer une **réclamation** auprès de l'autorité, avec son nom | Toujours | mot-clé contrôlé |
| Durées de conservation | Toujours | mot-clé contrôlé |
| **Directives post-mortem** : droit de dire ce que deviennent ses données après son décès | France (loi I&L art. 48 et 85) | mot-clé contrôlé |
| Pixels de suivi des e-mails, s'il y en a | Newsletter | à la main |
| Réponse aux signaux « Do Not Track » et GPC, date d'entrée en vigueur | États-Unis (CalOPPA, CCPA) | mot-clé contrôlé (page en anglais) |
| Titre et coordonnées du **responsable de la protection des renseignements personnels** | Québec (Loi 25) | mot-clé contrôlé (page en français) |
| Identité et contact de l'**encarregado** (DPO) | Brésil (LGPD art. 41) | à la main |
| Décisions automatisées qui affectent les personnes | Australie (depuis le 10/12/2026), RGPD art. 22 | avertissement automatique |

## 13. Clients professionnels (B2B)

| Quoi | Base | Contrôle |
|---|---|---|
| CGV : conditions de paiement, **pénalités de retard** et **indemnité forfaitaire de 40 €** pour frais de recouvrement | Code de commerce L441-10, D441-5 | mot-clé contrôlé si clientèle pro + France |
| Logiciel qui traite les données des clients du client : **contrat de sous-traitance (DPA)** et liste des sous-traitants | RGPD art. 28 | voir `regles/02-donnees-personnelles.md` |

## Sources officielles

- Code de la consommation : https://www.legifrance.gouv.fr/codes/texte_lc/LEGITEXT000006069565/
- DGCCRF, e-commerce : https://www.economie.gouv.fr/dgccrf/les-fiches-pratiques/e-commerce-les-regles-entre-professionnels-et-consommateurs
- CNIL, cookies : https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies/comment-mettre-mon-site-web-en-conformite
- CNIL, pixels de suivi dans les e-mails : https://www.cnil.fr (recommandation du 14/04/2026)
- CNIL, mort numérique : https://www.cnil.fr/fr/mort-numerique-effacement-informations-personne-decedee
- Règlement GPSR : https://eur-lex.europa.eu/eli/reg/2023/988/oj
- Règlement géoblocage : https://eur-lex.europa.eu/eli/reg/2018/302/oj
- FTC, faux avis : https://www.ecfr.gov/current/title-16/chapter-I/subchapter-D/part-465
- Californie, Automatic Renewal Law (AB 2863) : https://leginfo.legislature.ca.gov/faces/billTextClient.xhtml?bill_id=202320240AB2863
