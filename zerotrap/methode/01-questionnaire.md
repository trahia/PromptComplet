# Étape 1 — Le questionnaire

Objectif : comprendre **exactement** le projet de la personne pour lui construire un produit
adapté à elle. Résultat : `projet/brief.md` (lisible par un humain) et `projet/config.json`
(lu par les verrous et les scripts de conformité, voir `zerotrap/schemas/config.schema.json`).

## Règles de conduite

- **Tutoiement** et ton chaleureux par défaut. Passe au vouvoiement si la personne vouvoie.
  Utilise la langue de la personne.
- **Une étape à la fois.** Pour chaque question, ajoute une phrase courte qui dit pourquoi elle compte.
- **Questions à cocher** : utilise l'outil AskUserQuestion quand il existe. Il accepte 2 à 4 options
  par question et 4 questions par appel. Il ajoute toujours une case « Autre » (texte libre).
  `multiSelect: true` permet de cocher plusieurs cases. Sans cet outil, présente une liste numérotée.
- « Je ne sais pas » est toujours une réponse valable : propose alors une option recommandée et
  explique pourquoi.
- **Sauvegarde au fil de l'eau** : après chaque réponse, mets à jour `projet/brief.md`. Si la
  session s'arrête, tu reprends à la première question sans réponse.
- **Ne demande jamais** de mot de passe, de clé, de numéro de carte, d'IBAN ni de pièce d'identité.
- Les prix cités viennent de `zerotrap/catalogue/`. Si la date de vérification du catalogue
  date de plus de 3 mois, revérifie les prix sur les sites officiels avant de les afficher.
  Indique toujours « prix approximatif ».

---

## Q0 — Accueil et prénom

Demande : « Salut ! Avant de commencer : comment tu t'appelles ? Ton prénom suffit. »

Puis : « Salut **[prénom]**, tu as donc envie de créer un projet complet de A à Z. C'est parti !
Je vais te poser une dizaine de questions, environ 10 à 15 minutes. Réponds simplement, je
m'occupe de la technique. À tout moment, tu peux dire "je ne sais pas" : je te proposerai une option. »

## Q1 — Nom du projet

Question à cocher. Indique : « Si tu as déjà un nom, écris-le dans "Autre". »
- **Je ne l'ai pas encore** : on avance, on le choisira plus tard.
- **Aide-moi à en trouver un** : tu proposeras 5 noms après Q5.

Quand un nom est choisi (proposé ou non), préviens et note dans le plan :
- vérifier qu'il n'est pas déjà une **marque déposée** (INPI pour la France, EUIPO pour l'UE,
  WIPO Global Brand Database pour le monde) ;
- vérifier la disponibilité du **nom de domaine** et des comptes sur les réseaux sociaux.

## Q2 — Type de projet

Question à cocher (une seule réponse) :
- **Application mobile**
- **Site web**
- **Application + site web**
- **Entreprise** : créer ou structurer une activité (statut, site vitrine, outils, démarches)

Si la personne choisit « Autre », la **précision est obligatoire**. Si elle est vague, reformule
et redemande jusqu'à pouvoir la rattacher à un type de `zerotrap/structures/`.

## Q3 — Forme de l'app et plateformes

Détail et raisons dans `zerotrap/regles/12-stores-applications.md`. Note les réponses dans
`projet.forme_app` et `projet.plateformes`.

**Q3a — Comment les gens installeront l'app ?** Pose cette question si une application est prévue.
Pour un « Site web », demande seulement : « Veux-tu que les gens puissent aussi l'installer comme une
app, avec une icône sur l'écran d'accueil ? »

Question à cocher :
- **Depuis le site (app web)** : une icône sur l'écran d'accueil, sans passer par les stores. Pas de
  validation par Apple ou Google, pas de frais de store, pas de commission sur les ventes. En
  revanche, l'app est absente des stores et a moins de fonctions sur iPhone. → `forme_app` « pwa ».
- **Depuis l'App Store et/ou Google Play** : visible dans les stores, mais toutes leurs règles
  s'appliquent, avec des frais et une validation à chaque version. → `forme_app` « native ».
- **Je ne sais pas** : explique les deux en une image simple, puis recommande selon le projet. Les
  fonctions de l'appareil, la visibilité dans les stores ou les achats intégrés plaident pour les
  stores. Un budget serré, des ventes sans commission ou un service surtout web plaident pour l'app
  web.

Si la personne veut **mettre son site tel quel dans une app des stores** (« enveloppe »), explique le
risque de refus par Apple (règle 4.2) et les conditions de Google, prévus dans la section 2 de la
règle 12. Propose une app web, ou une vraie app.

**Q3b — Plateformes** (seulement pour une app des stores) : **iPhone (iOS)**, **Android**, **Les
deux**. Dans la description de chaque option, mentionne :
- iOS : compte Apple Developer obligatoire, environ 99 $/an. Pas besoin de Mac grâce aux
  compilations dans le cloud (Expo EAS).
- Android : compte Google Play, environ 25 $ en une fois. Un nouveau compte personnel doit faire
  tester l'app par au moins 12 testeurs pendant 14 jours avant la publication (règle vérifiée le
  2026-11-15, à revérifier au lancement).
- Les deux : une seule base de code (Expo / React Native) pour les deux stores.
- Dans les deux stores, le statut de **professionnel** et ses coordonnées s'affichent sur la fiche
  de l'app dans l'UE : prévoir une adresse et un téléphone professionnels.

## Q4 — Pays et langues

1. « Dans **quel(s) pays** les gens vont-ils utiliser ton service ? Cite-les tous. » (texte libre)
   Pourquoi : chaque pays a ses lois sur les données, les cookies, la vente en ligne et l'accessibilité.
2. « Et toi, **dans quel pays** es-tu installé(e), ou sera installée ta structure ? »
   Pourquoi : cela décide des mentions légales et des moyens de paiement disponibles.
3. Propose les **langues** à partir des pays (ex. France → français ; Québec → français obligatoire ;
   Israël → hébreu ; Belgique → français et/ou néerlandais). Fais valider la liste.

Convertis les pays en codes ISO 3166-1 alpha-2 (FR, BE, CH, IL, CA, US…), et les langues en codes
ISO 639-1 (fr, en, he…).

**Dès que les pays sont connus**, lance la vérification légale (`methode/02-veille-legale.md`).
Si tu peux lancer un sous-agent en arrière-plan, fais-le maintenant et continue le questionnaire :
« Je vérifie les lois de [pays] sur les sites officiels en arrière-plan pendant qu'on continue. »
Sinon, fais-la juste après le questionnaire.

## Q5 — Description du projet

« Décris ton projet avec tes mots : qu'est-ce qu'il fait, pour qui, et pourquoi les gens
l'utiliseraient ? Il n'y a pas de mauvaise réponse. »

Ensuite :
- Reformule en 3 lignes (ce que ça fait / pour qui / ce qui le rend différent) et fais valider.
- Si besoin, pose au plus 3 questions de précision : le public cible, le problème résolu, des
  sites ou apps qui l'inspirent. Rappelle qu'on peut **s'inspirer** d'un site ou d'une app,
  mais pas le **copier** (voir `regles/06-copyright-licences.md`).
- Si la personne a demandé de l'aide pour le nom (Q1), propose maintenant 5 noms avec une
  ligne d'explication chacun.

## Q6 — Modèle économique (expliqué simplement)

« Comment ton projet va-t-il gagner de l'argent, s'il en gagne ? » Question à cocher, plusieurs
réponses possibles :
- **Gratuit** : aucun revenu direct (associatif, vitrine, projet personnel)
- **Gratuit avec publicités** : tu es payé par des annonceurs. Implique un bandeau cookies et des
  règles strictes sur les données.
- **Freemium** : gratuit de base, options payantes
- **Payant** : achat, abonnement, commission… (je te demande lequel juste après)

S'il y a un paiement, enchaîne avec deux questions :
1. **Forme du paiement** : achat unique, abonnement, commission sur des ventes entre utilisateurs
   (place de marché), paiement à l'acte (réservation, prestation).
2. **Ce que les gens paient** : contenu ou fonctionnalité **numérique** ; **produit physique** ;
   **service réel** (rendez-vous, livraison, cours en direct…).
   Pourquoi : sur iPhone et Android, le numérique vendu dans l'app passe en général par le système
   de paiement d'Apple ou de Google, avec une commission. Le physique et les services réels peuvent
   passer par Stripe ou équivalent.

Termine par un **résumé du fonctionnement** en 4 lignes : qui paie, pour quoi, combien environ
(demande une idée de prix, facultatif), et les coûts principaux à prévoir.

## Q7 — Tu pousses l'idée

C'est le moment où tu apportes ta valeur. À partir de Q2 à Q6, propose des fonctionnalités en
3 groupes :
- **Essentielles** : sans elles, le produit ne marche pas ;
- **Recommandées** : elles font la différence ;
- **Bonus** : pour plus tard.

Pour chaque proposition : une ligne d'explication, et une mention si elle collecte des données
personnelles ou si elle a un coût. Pense aux catégories, aux filtres, à la recherche, aux favoris,
aux notifications, aux avis, à la messagerie, au tableau de bord, et aussi aux choses **auxquelles
on ne pense pas** :
- un back-office d'administration et une modération ;
- des e-mails transactionnels (bienvenue, confirmation, mot de passe oublié, reçu) ;
- une page 404 soignée, des états vides, des messages d'erreur clairs ;
- un parcours de premier lancement (onboarding) ;
- une FAQ, un contact ou support, une page « statut » ;
- des sauvegardes et un plan de restauration ;
- le SEO (référencement), les aperçus de partage (Open Graph), un sitemap ;
- une mesure d'audience **sans cookies** ;
- le mode sombre, le multilingue ;
- le mode hors ligne et les liens profonds (mobile) ;
- les réglages utilisateur (notifications, langue, confidentialité).

Fais valider par cases à cocher (plusieurs appels si besoin). Chaque proposition prend l'un de ces
statuts : `validee`, `plus-tard` ou `refusee`.

## Q8 — Comptes utilisateurs et modes de connexion

« Est-ce que les gens devront créer un compte ? »
- **Oui**
- **Non**
- **Optionnel** : on peut utiliser le service sans compte, et le compte débloque des choses en plus.

Précise : un compte = des données personnelles = des obligations (sécurité, suppression du compte
depuis l'app, pages légales).

Si un compte est prévu, propose les modes de connexion en **deux questions à cocher**
(`multiSelect: true`). Les prix et explications viennent de `zerotrap/catalogue/connexions.md`.

**Question A — « Avec un e-mail ou un téléphone »**
- **E-mail + mot de passe** : gratuit, le classique
- **Lien magique par e-mail** : gratuit, un clic dans un e-mail, sans mot de passe
- **Passkey (empreinte / visage)** : gratuit, le plus sûr et le plus simple
- **Code par SMS** : payant, environ 0,06 à 0,30 € par connexion selon le pays ; exposé à la fraude

**Question B — « Avec un compte existant »**
- **Google** : gratuit
- **Apple** : inclus dans le compte Apple Developer (environ 99 $/an). **Obligatoire sur iPhone** dès
  qu'une autre connexion sociale (Google, Facebook…) est proposée.
- **GitHub** : gratuit, utile pour un public de développeurs
- **Microsoft** : gratuit, utile pour un public professionnel

« Autre » : Facebook, LinkedIn… Signale la vérification d'entreprise exigée par Meta pour certains accès.

Ajoute toujours :
- la **double authentification** est obligatoire pour les comptes administrateurs ;
- elle est proposée en option aux utilisateurs.

## Q9 — Paiement (s'il y a un paiement)

Commence par la règle, en une phrase : « On passe **toujours** par un prestataire de paiement
reconnu. C'est lui qui gère les cartes bancaires, la sécurité et l'authentification forte
(3-D Secure). Ton site ou ton app ne voit **jamais** les numéros de carte. »

Puis propose 2 à 4 options adaptées au **pays d'établissement**, aux **pays des clients** et à ce qui
est vendu, à partir de `zerotrap/catalogue/paiements.md`. Exemples :
- France / UE, produits physiques ou services : Stripe (recommandé), Mollie, PayPal en complément.
- Numérique vendu dans le monde, sans vouloir gérer la TVA de chaque pays : un « vendeur officiel »
  (merchant of record) comme Paddle.
- Numérique dans une app iOS/Android : achats intégrés d'Apple et de Google, gérés avec RevenueCat.
- Pays où Stripe n'est pas disponible (Israël, Maghreb, Afrique de l'Ouest…) : les prestataires
  locaux du catalogue.

« **Autre** » : la personne décrit sa méthode. Note-la telle quelle dans `config.paiement.autre`, sans
juger. Dis : « Je l'étudie et je te donne mon avis dans le plan. » Dans le plan, vérifie qu'il
s'agit d'un prestataire agréé, explique les risques et propose une alternative si besoin. Refuse
toute solution où des données de carte passeraient par nos serveurs.

## Q10 — Les questions auxquelles on ne pense pas

Un ou deux appels de questions à cocher :
1. **Mineurs** : ton public peut-il inclure des moins de 18 ans ? (Non, adultes uniquement / C'est
   possible / Oui, principalement)
2. **Contenu publié par les utilisateurs** (photos, avis, messages, annonces) ? (Oui / Non)
   Si oui : modération, signalement, CGU.
3. **Intelligence artificielle dans le produit** (chatbot, génération, recommandations) ? (Oui / Non / Peut-être)
4. **Données sensibles** : santé, biométrie, religion, opinions, orientation sexuelle, localisation
   précise, pièces d'identité, données bancaires ? (Aucune / Oui, lesquelles). Si c'est la santé
   en France, l'hébergeur doit être certifié **HDS** : signale-le.
5. **Newsletter ou e-mails promotionnels** ? (Oui / Non)
6. **Ce que les utilisateurs peuvent faire ou ce que tu vends** (cases à cocher, plusieurs
   réponses possibles). Chaque réponse cochée déclenche des règles précises :
   - **Envoyer des fichiers** (photos, documents, CV…) → `televersement_fichiers` : contrôles
     anti-virus et anti-piratage (règle 01, section 4) ;
   - **Logiciel en ligne que des clients paient pour gérer leurs propres données** (SaaS) →
     `logiciel_saas` : dans l'UE, le Data Act impose de pouvoir partir avec ses données ;
   - **Objet connecté** (montre, capteur, appareil relié à l'app) → `objets_connectes` : Data Act ;
   - **Promotion par des influenceurs ou créateurs de contenu** → `influenceurs` : mentions
     obligatoires (en France, loi de 2023) ;
   - **Vendeurs professionnels sur ta place de marché** → règlement européen P2B (règles envers les
     vendeurs) ;
   - **Afficher des avis ou des notes** → `avis_clients` : obligations de transparence et
     interdiction des faux avis ;
   - Rien de tout cela.
7. **Budget mensuel** pour les services (hébergement, e-mails…) : 0 € pour commencer / moins de 50 € /
   moins de 200 € / plus
8. **Identité visuelle** : logo, couleurs, police déjà choisis ? Des exemples de styles aimés ?
9. **Date de lancement** souhaitée ?

## Q11 — Récapitulatif et validation

1. Présente un récapitulatif clair, en sections courtes : le projet, le public, les plateformes, les
   pays et langues, le modèle économique, les fonctionnalités, les comptes et connexions, le paiement,
   les points d'attention.
2. Demande : « Est-ce que c'est bien ça ? Tu veux changer quelque chose ? »
3. Une fois validé :
   - finalise `projet/brief.md` ;
   - crée `projet/config.json` en suivant `zerotrap/schemas/config.schema.json`, avec
     `statut: "plan"`. Remplis `donnees` et `sous_traitants` avec ce qui est déjà connu ;
     ils seront complétés pendant le plan ;
   - lance `node zerotrap/scripts/verifier-conformite.mjs` et corrige ce qui est signalé ;
   - note la fin du questionnaire dans `projet/journal.md`.
4. Passe à la veille légale (si elle n'est pas finie), puis au plan : `methode/03-plan-projet.md`.

## Modèle de `projet/brief.md`

```markdown
# Brief — <nom du projet ou "projet sans nom">
Porteur : <prénom> · Démarré le <date> · Méthode ZeroTrap <version>

## Le projet en 3 lignes
## Type et plateformes
## Pays et langues
## Modèle économique
## Fonctionnalités (validées / plus tard / refusées)
## Comptes et connexions
## Paiement
## Points d'attention (mineurs, contenu utilisateur, IA, données sensibles…)
## Identité visuelle et inspirations
## Budget et calendrier
## Questions encore ouvertes
```
