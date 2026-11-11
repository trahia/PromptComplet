# Matrice des obligations

Cette matrice est appliquée automatiquement par `promptcomplet/scripts/lib/obligations.mjs`. Elle
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
| Politique cookies | Cookies non essentiels, publicité, ou mesure d'audience soumise à consentement. |

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
