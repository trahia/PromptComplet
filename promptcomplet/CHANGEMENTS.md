# Historique des versions de PromptComplet

## 1.2.0 — 2026-11-15

Forme du projet (site, app web, app des stores) toujours confirmée, règles d'Apple et de Google, et
audit depuis une discussion déjà en cours.

### Forme du projet et règles des stores
- **Nouvelle règle `regles/12-stores-applications.md`**, vérifiée le 2026-11-15 sur les pages
  officielles :
  - quatre formes de projet : site seul, app web (icône sur l'écran d'accueil, hors stores), site
    affiché dans une app des stores (« enveloppe »), vraie app ;
  - le piège du site dans une app : Apple 4.2, règles WebView de Google Play ;
  - l'app web : aucune règle de store, mais un manifeste et pas de données personnelles en cache ;
  - Apple : connexion 4.8, suppression de compte, achats 3.1.1 (exception États-Unis), contenu des
    utilisateurs 1.2, nouvelles classes d'âge, questions sur les réseaux sociaux depuis septembre
    2026, statut de professionnel DSA ;
  - Google Play : 12 testeurs pendant 14 jours, API 36 depuis le 31/08/2026, suppression de compte
    dans l'app et sur le web, statut de professionnel avant le 01/02/2027 (coordonnées affichées à
    partir du 01/03/2027), vérification des développeurs Android à partir du 30/09/2026 ;
  - lois américaines sur l'âge dans les stores, à vérifier pendant la veille ;
  - liste des pages officielles à revérifier.
- **Questionnaire (Q3)** : « Comment les gens installeront l'app ? » (app web ou stores), puis
  iPhone, Android ou les deux, avec les avantages et les contraintes de chaque option.
- **Audit seul et projet existant** : après la lecture du code, la forme du projet et les pays sont
  **toujours** confirmés par la personne.
- **Veille légale** : les règles des stores sont revérifiées, avec une section « Stores » dans
  `projet/veille-legale.md`.
- **Lancement** : checklist des stores complétée (forme de l'app, app web, questionnaire d'âge,
  statut de professionnel, test fermé).
- **Contrôles automatiques** :
  - nouveau champ `projet.forme_app` (`aucune`, `pwa`, `enveloppe`, `native`), avec un refus des
    combinaisons incohérentes ;
  - preuve `manifeste_app_web` pour une app web ;
  - avertissements sur le site affiché dans une app (Apple 4.2, Google WebView) ;
  - message 4.8 corrigé : la règle exige une connexion équivalente, et Sign in with Apple est le
    moyen le plus sûr d'y répondre.
- `CLAUDE.md` : nouvelle section « Applications et stores ».

### Audit depuis une discussion déjà en cours
- `DEMARRER.md` : ouvrir une nouvelle discussion pour l'audit ; choisir le mode par défaut ou le
  mode Plan, jamais un mode qui accepte tout seul ; sur claude.ai, un simple lien vers le dépôt privé
  ne suffit pas ; avertissement : le message d'installation ajoute des fichiers, contrairement à
  l'audit.
- `methode/09-audit-seul.md`, nouvelle section « Avant de commencer » :
  - pas d'accès aux fichiers = pas d'audit, jamais de méthode reconstituée de mémoire ;
  - proposer une nouvelle discussion si celle-ci contient déjà un autre travail sur le projet ;
  - les consignes de l'audit l'emportent sur celles données plus tôt dans la discussion ;
  - faire vérifier le mode de permission avant la première commande ;
  - auditer le code avec impartialité, même si l'IA l'a écrit elle-même.

## 1.1.0 — 2026-11-15

Comble des manques relevés lors d'un audit de la méthode.

- **Légal (UE)** :
  - responsabilité du fait des produits défectueux (directive 2024/2853) : le logiciel devient un
    produit à partir du 9 décembre 2026 ;
  - Data Act : SaaS et objets connectés ;
  - règlement P2B : places de marché avec vendeurs professionnels ;
  - préparation de la SBOM exigée par le CRA.
- **Légal (France)** : loi sur l'influence commerciale ; état de la transposition de la directive
  2024/2853.
- **Nouvelle fiche Asie-Pacifique** : Inde (DPDP), Chine (PIPL), Japon (APPI, réforme 2026),
  Australie (décisions automatisées depuis le 10/12/2026), Corée du Sud (PIPA).
- **Sécurité** :
  - fichiers envoyés par les utilisateurs : liste blanche, SVG refusé, antivirus, en-têtes de
    téléchargement. Nouveau `kit/web/security/upload-validation.ts` ;
  - calendrier de rotation des clés ;
  - test d'intrusion humain, obligatoire pour les projets sensibles ;
  - nouvelle section 13 : durée de support, délais de correction, historique des versions, SBOM.
- **Contrôles automatiques** :
  - nouveaux champs de configuration : `televersement_fichiers`, `logiciel_saas`,
    `objets_connectes`, `influenceurs` ;
  - nouvelle preuve `controle_fichiers` ;
  - fichiers exigés : `projet/maintenance-securite.md` (construction), `projet/sbom.cdx.json`
    (lancement), `projet/test-intrusion.md` (projets sensibles) ;
  - avertissements Data Act, P2B, influence, Chine, Australie et Inde, et langues d'Asie-Pacifique.
- **Affichages obligatoires** : nouvelle liste `legal/affichages-obligatoires.md`, qui indique quoi
  afficher, où et quand. Elle couvre le pied de page, le bandeau et la page cookies, chaque formulaire,
  la fiche produit (dont GPSR), les avis, le panier, le bouton « Commande avec obligation de
  paiement », la confirmation, les abonnements, les places de marché, les e-mails (pixels de suivi,
  CNIL 2026), l'app et le B2B.
- **Modèles** :
  - CGV : formulaire type de rétractation, encadré officiel des garanties légales, récapitulatif et
    bouton de commande, prix de référence, reconduction, archivage, clients professionnels
    (indemnité de 40 €) ;
  - CGU : point de contact DSA, avis, classement des offres ;
  - politique : directives post-mortem, pixels, pays hors UE ;
  - cookies : partenaires et conséquences d'un refus ;
  - nouveaux modèles `mention-formulaire.md` et `dpa-clients.md` (le projet comme sous-traitant,
    RGPD art. 28).
- **Contrôles automatiques** :
  - mentions obligatoires vérifiées dans les pages en fr et en ;
  - `config.cookies` : chaque cookie et chaque fournisseur doit apparaître dans la page cookies ;
  - nouvelles preuves `bouton_commande`, `email_confirmation_commande`, `resiliation_abonnement`,
    `licences_tierces`, `mention_formulaire` ;
  - page `dpa-clients` ;
  - fichier `projet/evaluation-risques-uk.md` ;
  - avertissements GPSR, pixels, santé, conservation légale, abonnements aux États-Unis, et
    réglages npm/pnpm.
- **Kit** :
  - **correction de sécurité** : `supabase-socle.sql` limite désormais la modification du profil aux
    colonnes autorisées. Avant, un utilisateur pouvait modifier toutes les colonnes de son profil, dont
    sa date de consentement, puisque la RLS filtre les lignes et non les colonnes. Cette date est
    maintenant posée par le serveur ;
  - `consent.ts` respecte le signal Global Privacy Control.
- **Règles** :
  - chaîne d'approvisionnement : scripts d'installation bloqués, délai de 7 jours avant d'adopter une
    nouvelle version ;
  - opérations simultanées (codes promo, crédits) ;
  - redirections après connexion et changement d'e-mail ;
  - DNS et continuité si la personne n'est plus disponible ;
  - durée des journaux ;
  - sous-traitance B2B ;
  - dispositifs médicaux ;
  - conservation légale des hébergeurs de contenus ;
  - DAC7 et fonds de tiers, TVA au Royaume-Uni et en Suisse, sanctions ;
  - prospection en France (téléphone : consentement depuis le 11/08/2026) ;
  - SMS aux États-Unis ;
  - maîtrise de l'IA.
- **Projets existants** :
  - nouveau mode **audit seul** (`methode/09-audit-seul.md`) : analyse en lecture seule, liste des
    problèmes par gravité dans la discussion, aucune modification ;
  - l'installateur ne remplace plus les crochets git existants (Husky, Lefthook) ;
  - `08-projet-existant.md` annonce ce que l'installation ajoute.
- **Fiches pays** :
  - UE : GPSR, géoblocage, Omnibus ;
  - France : vente en ligne détaillée, hébergement de contenus, mort numérique ;
  - Royaume-Uni : Online Safety Act détaillé, TVA, DMCC ;
  - Suisse : TVA ;
  - États-Unis : abonnements, faux avis, santé, SMS, âge dans les stores.

## 1.0.0 — 2026-11-11

Première version.

- **Méthode** : 9 étapes, de l'installation au lancement :
  - installation ;
  - questionnaire guidé (nom, type, plateformes, pays, description, modèle économique, propositions de
    fonctionnalités, comptes et connexions avec prix, paiements par pays, questions « auxquelles on ne
    pense pas ») ;
  - veille légale sur les sources officielles ;
  - plan chiffré ;
  - construction par petites étapes ;
  - évolution ;
  - lancement ;
  - mise à jour ;
  - projet existant.
- **Règles** non négociables : sécurité (OWASP ASVS 5.0 / MASVS 2.1), données personnelles (socle
  RGPD), authentification, paiements, accessibilité (WCAG 2.2 AA), copyright et licences, design,
  performance, structure, e-mails, IA.
- **Légal** : matrice d'obligations, 15 fiches pays/zones vérifiées au 2026-11-11, modèles de pages
  légales et de documents internes.
- **Catalogue** : skills et plugins vérifiés (avec liste de ceux qui n'existent pas), outils de
  sécurité, connexions et paiements avec prix approximatifs, services, technologies.
- **Verrous** :
  - hooks Claude Code (écriture, commandes, début de session, fin de tour) ;
  - pre-commit git ;
  - GitHub Actions (Gitleaks, Semgrep, OSV-Scanner, audit, conformité, ZAP), avec des actions
    figées par SHA ;
  - empreintes d'intégrité de la méthode.
- **Kit** : module d'accessibilité unique (web et mobile), bandeau cookies conforme CNIL, pages
  légales, en-têtes de sécurité, socle Supabase avec RLS.
