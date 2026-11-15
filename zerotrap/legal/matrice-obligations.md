# Matrice des obligations

Cette matrice est appliquée automatiquement par `zerotrap/scripts/lib/obligations.mjs`. Elle
donne un **minimum**. La veille légale peut ajouter des obligations, jamais en retirer.

Zones utilisées :
- **EEE** = les 27 pays de l'UE, plus l'Islande, le Liechtenstein et la Norvège ;
- **EUROPE** = EEE + Suisse + Royaume-Uni.

## Pages légales

| Page | Exigée quand… |
|---|---|
| Politique de confidentialité | **Toujours.** Tout service traite au moins des données techniques (adresse IP, journaux). |
| Déclaration d'accessibilité | **Toujours.** Obligatoire dans de nombreux cas (UE/EAA, France, Israël) et bonne pratique ailleurs. |
| Mentions légales | Pays d'établissement ou pays visé dans EUROPE. |
| CGU | Comptes utilisateurs, contenu publié par les utilisateurs, ou place de marché. |
| CGV | Paiement actif. |
| Politique cookies | Cookies non essentiels, publicité, ou mesure d'audience soumise à consentement. Chaque cookie et chaque fournisseur de `config.cookies` doit y figurer. |
| Accord de traitement des données (`dpa-clients`) | Logiciel SaaS (`logiciel_saas`) vendu à des professionnels, en Europe (RGPD art. 28). |

Chaque page existe dans **chaque langue** de `config.langues`.

## Preuves (fonctionnalités à intégrer, déclarées dans `config.preuves`)

| Preuve | Exigée quand… | Ce que c'est |
|---|---|---|
| `composant_accessibilite` | Toujours | Fichier racine (layout) qui inclut le module d'accessibilité |
| `liens_legaux` | Toujours | Composant du pied de page / des réglages qui liste les pages légales |
| `bandeau_cookies` | Page cookies exigée | Fichier qui inclut le bandeau de consentement |
| `suppression_compte` | Comptes utilisateurs | Écran ou page de suppression du compte |
| `export_donnees` | Comptes utilisateurs | Fonction « Télécharger mes données » |
| `page_web_suppression_compte` | Comptes + Android | Page web publique de demande de suppression (Google Play) |
| `verification_age` | Public mineur possible | Contrôle d'âge et consentement parental |
| `signalement_contenu` | Contenu utilisateur ou place de marché | Bouton ou formulaire de signalement |
| `mention_ia` | IA dans le produit | Indication visible qu'il s'agit d'une IA |
| `desinscription_emails` | Newsletter | Désinscription en un clic |
| `retractation_en_ligne` | Paiement + vente aux consommateurs dans l'EEE | Fonction de rétractation en ligne (depuis le 19/06/2026) |
| `opt_out_vente_partage` | Publicité + États-Unis | Lien « Do Not Sell or Share My Personal Information » |
| `bouton_commande` | Vente aux consommateurs dans l'EEE (hors achat intégré seul) | Bouton « Commande avec obligation de paiement » ou équivalent (L221-14) |
| `email_confirmation_commande` | Vente aux consommateurs dans l'EEE | Modèle d'e-mail de confirmation avec CGV et rétractation (L221-13) |
| `resiliation_abonnement` | Abonnement + particuliers | Bouton « Résilier mon abonnement » (L215-1-1, Allemagne, Californie) |
| `licences_tierces` | App iOS ou Android | Écran « Licences open source » |
| `mention_formulaire` | Comptes ou newsletter | Composant qui affiche la mention d'information sous les formulaires |
| `controle_fichiers` | Fichiers envoyés par les utilisateurs | Code serveur qui appelle `validateUpload` (`kit/web/security/upload-validation.ts`) |

## Fichiers du projet exigés en plus

| Fichier | Exigé à partir de… | Quand |
|---|---|---|
| `projet/maintenance-securite.md` | construction | Toujours : durée de support, délais de correction, rotation des clés, historique des versions |
| `projet/sbom.cdx.json` | lancement | Toujours : liste des composants de la version publiée |
| `projet/evaluation-risques-uk.md` | construction | Contenus échangés entre utilisateurs + Royaume-Uni (Online Safety Act) |
| `projet/test-intrusion.md` | lancement | Données sensibles, place de marché avec paiement, ou public principalement mineur |

## Mentions contrôlées dans les pages (mots-clés, pages en fr et en)

Le détail est dans `legal/affichages-obligatoires.md`. Mentions contrôlées, page par page :
- **politique de confidentialité** : droit de réclamation, durées de conservation, directives
  post-mortem (France), « Do Not Track » et GPC (États-Unis), responsable de la protection des
  renseignements personnels (Québec) ;
- **mentions légales** : hébergeur ;
- **CGV** : formulaire type de rétractation, bouton de commande, garanties légales, médiateur,
  reconduction, indemnité de 40 € ;
- **CGU** : point de contact DSA, avis, classement des offres ;
- **cookies** : partenaires, conséquences d'un refus.

## Contrôles de cohérence

| Contrôle | Règle |
|---|---|
| Sign in with Apple | iOS + connexion sociale (Google, Facebook, Microsoft, GitHub, X, LinkedIn…) ⇒ `apple` doit être dans `config.connexions` (règle 4.8). |
| Achats intégrés | iOS/Android + vente de contenu numérique ⇒ `config.paiement.achats_integres_app` doit être `true`, ou la dérogation justifiée dans `config.paiement.autre`. |
| Données dans la politique | Chaque `config.donnees[].nom` et chaque `config.sous_traitants[].nom` doit apparaître dans la politique de confidentialité (langue principale). |
| Registre | `projet/registre-traitements.md` exigé dès la construction. |
| Veille légale | Obligatoire dès le plan. Plus de 90 jours : avertissement, et bloquant en mode lancement (`--release`). |
| Langue | Avertissement si une langue officielle d'un pays visé manque (fr pour FR/QC, he pour IL…). |
| Données de santé + FR | Avertissement : hébergeur certifié HDS obligatoire. |
| Lien ODR | Erreur si une page légale contient encore un lien vers la plateforme européenne de règlement en ligne des litiges (supprimée le 20/07/2025). |
| SaaS + EEE | Avertissement : Data Act, changement de fournisseur et export des données. |
| Objets connectés + EEE | Avertissement : Data Act, accès de l'utilisateur à ses données. |
| Place de marché + EEE | Avertissement : règlement P2B si des vendeurs sont des professionnels. |
| Influenceurs | Avertissement : loi 2023-451 en France, publicité toujours signalée ailleurs. |
| Chine | Avertissement : PIPL, avis d'un avocat local indispensable. |
| Australie + IA | Avertissement : transparence des décisions automatisées depuis le 10/12/2026. |
| Inde + mineurs | Avertissement : consentement parental vérifiable en dessous de 18 ans. |
| Produits physiques + EEE | Avertissement : GPSR, informations de sécurité sur chaque fiche produit. |
| Newsletter + France | Avertissement : pixels de suivi soumis à consentement (CNIL, 2026). |
| Santé | Avertissement : dispositif médical si finalité médicale. |
| Contenus publiés + France | Avertissement : conservation légale des données de connexion (décret 2021-1362). |
| Abonnement + États-Unis | Avertissement : Automatic Renewal Law de Californie. |
| Dépendances JavaScript | Avertissement si pnpm sans `minimumReleaseAge`, ou npm sans `ignore-scripts=true`. |
| Langues Asie-Pacifique | Avertissement si ja (JP), zh (CN), ko (KR), en (AU) ou en/hi (IN) manque. |
