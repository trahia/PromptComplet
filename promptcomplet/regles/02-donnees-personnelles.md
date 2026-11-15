# Règle 02 — Données personnelles (non négociable)

On applique **partout** le niveau de protection le plus exigeant : le RGPD européen. On y ajoute les
règles propres à chaque pays visé (voir `legal/pays/`). Une donnée personnelle, c'est toute
information qui permet d'identifier une personne, directement ou non : nom, e-mail, téléphone,
adresse IP, identifiant d'appareil, localisation, photo, voix, historique…

## Les 7 principes

1. **Licéité et transparence** : chaque traitement a une base légale. Les personnes sont informées
   clairement, au moment de la collecte.
2. **Finalité** : on collecte pour un objectif précis, et on n'utilise pas les données pour autre chose.
3. **Minimisation** : seulement ce qui est indispensable. Un champ facultatif reste réellement
   facultatif.
4. **Exactitude** : les personnes peuvent corriger leurs données.
5. **Conservation limitée** : une durée pour chaque donnée, et une **purge automatique**.
6. **Sécurité** : règle 01.
7. **Responsabilité** : tout est documenté (`config.json`, registre, veille légale, journal).

## Protection dès la conception et par défaut

- Les réglages par défaut sont les plus protecteurs : profil privé, partage désactivé, pas de suivi,
  e-mails promotionnels décochés.
- Chaque nouvelle fonctionnalité passe par la checklist de `methode/05-evolution.md`.

## Inventaire obligatoire

Chaque donnée est inscrite dans `config.donnees` avec :
- sa **finalité** ;
- sa **base légale** : contrat, consentement, obligation légale, intérêt légitime, intérêt vital ou
  mission d'intérêt public ;
- sa **durée** de conservation ;
- ses **destinataires** ;
- son **lieu de stockage**.

Le registre `projet/registre-traitements.md` est tenu à jour. Le script de conformité vérifie que
chaque donnée et chaque sous-traitant apparaît dans la politique de confidentialité.

## Cloisonnement : rien ne se mélange

- Les données de chaque utilisateur sont isolées. Personne ne voit les données d'un autre sans droit
  explicite (règle 01, contrôle d'accès).
- Si le produit sert plusieurs organisations (multi-clients), chaque organisation est isolée, au
  niveau de la base de données.
- Les accès de l'équipe (administration, support) aux données des utilisateurs sont limités au
  nécessaire, justifiés et journalisés.
- **Aucune vente, location ni partage de données personnelles** sans base légale et sans
  information claire.
- Publicité : contextuelle par défaut. Publicité personnalisée seulement avec consentement.
  Jamais pour les mineurs.

## Sous-traitants et transferts

- Chaque service externe qui traite des données (hébergeur, base de données, e-mails, analyse,
  paiement, IA) est listé dans `config.sous_traitants`, avec :
  - son rôle ;
  - le pays où les données sont hébergées ;
  - les garanties (contrat de sous-traitance, DPA).
- Pour des utilisateurs européens, préfère un hébergement dans l'UE. Un transfert hors UE exige une
  garantie : décision d'adéquation, Data Privacy Framework UE–États-Unis, ou clauses contractuelles
  types. Il est indiqué dans la politique de confidentialité.
- Polices de caractères, scripts et images sont **hébergés chez nous**, pas sur un CDN tiers qui
  recevrait l'adresse IP des visiteurs (ex. Google Fonts appelé directement).

### Quand c'est le projet qui est sous-traitant (logiciel pour des clients professionnels)

Si le produit traite les données **des clients de ton client** (CRM, outil de réservation, SaaS
B2B…), le projet est **sous-traitant** au sens du RGPD (art. 28). Il doit :
- proposer un **contrat de sous-traitance (DPA)** à chaque client. Modèle :
  `legal/modeles/dpa-clients.md`, exigé automatiquement quand `logiciel_saas` est vrai et que la
  clientèle est professionnelle ;
- publier la **liste de ses propres sous-traitants**, et prévenir avant tout changement ;
- tenir un registre en tant que sous-traitant (art. 30(2)) ;
- aider le client à répondre aux demandes de droits ;
- prévenir le client **sans délai injustifié** en cas de fuite, pour qu'il puisse notifier dans
  les 72 heures ;
- ne jamais utiliser ces données pour son propre compte (statistiques, entraînement d'IA…) sans
  base légale.

## Données sensibles

Santé, données génétiques ou biométriques, origine, opinions politiques, religion, syndicat,
orientation ou vie sexuelle, infractions, ainsi que, par prudence, localisation précise, pièces
d'identité et données financières :
- à éviter si possible ;
- sinon : base légale renforcée (souvent consentement explicite), **ASVS niveau 3**, chiffrement des
  champs et **analyse d'impact (AIPD)** ;
- santé en France : hébergeur certifié **HDS** obligatoire.
- **Application à finalité médicale** (diagnostic, suivi d'une maladie, calcul de dose, aide à la
  décision clinique) : c'est un **dispositif médical**, qui exige un marquage CE (règlement
  2017/745 ; guide MDCG 2019-11 révision 1 de juin 2025, qui vise aussi les apps et le cloud).
  - **Arrête-toi et alerte la personne** avant toute construction : l'avis d'un spécialiste
    réglementaire est obligatoire ;
  - une app de bien-être sans finalité médicale n'est pas concernée, mais la frontière est fine ;
  - États-Unis : le Washington My Health My Data Act s'applique quelle que soit la taille, avec
    un consentement séparé pour le partage. La FTC Health Breach Notification Rule couvre les apps
    de santé non soumises à HIPAA.

## Mineurs

- Demander l'âge si le public peut inclure des mineurs. Sous l'âge du consentement numérique
  (15 ans en France, variable selon le pays, voir les fiches pays), il faut le consentement
  parental pour les traitements fondés sur le consentement.
- Pas de profilage publicitaire des mineurs. Réglages de confidentialité au maximum par défaut.

## Droits des personnes, intégrés dans le produit

| Droit | Dans le produit |
|---|---|
| Accès et portabilité | Bouton « Télécharger mes données » : export JSON ou CSV |
| Rectification | Modification du profil |
| Effacement | **Suppression du compte depuis l'app ou le site**, avec reconfirmation. Effacement réel, ou anonymisation des données à garder pour une obligation légale (ex. factures). Plus une page web de demande de suppression (exigée par Google Play). |
| Opposition, retrait du consentement | Réglages de confidentialité, aussi simples que le consentement initial |
| Contact | Une adresse de contact dédiée, indiquée dans la politique de confidentialité |

Délai de réponse : 1 mois au plus (RGPD). Les fiches pays précisent les délais locaux.
- **Exception à l'effacement : les conservations imposées par la loi.** Exemples :
  - factures : 10 ans ;
  - contrats de 120 € ou plus : 10 ans ;
  - en France, pour un service qui héberge des contenus d'utilisateurs (décret 2021-1362) : les
    identifiants de création du compte pendant 1 an après sa fermeture, les données de paiement et
    de connexion (adresse IP) pendant 1 an, et l'identité civile pendant 5 ans si elle est
    collectée. ⚠️ À vérifier sur Légifrance.
  - Ces données sont **isolées** (table ou stockage séparé, accès restreint et journalisé). Elles ne
    servent à rien d'autre et sont purgées automatiquement à l'échéance. La politique de
    confidentialité l'explique.

## Consentement

- Libre, spécifique, éclairé, univoque. Une case par finalité. Rien de pré-coché.
- Retirer son consentement doit être aussi facile que le donner.
- On garde une **preuve** : date, version du texte, choix faits. Sans données excessives.

## Cookies et traceurs

- Aucun cookie ou traceur non essentiel **avant** le consentement. Cela inclut : mesure d'audience
  non exemptée, publicité, pixels, vidéos YouTube intégrées, cartes, boutons de réseaux sociaux,
  chat tiers.
- **« Refuser » est aussi visible et facile que « Accepter »** (recommandation CNIL).
- Le choix est mémorisé, puis redemandé au bout d'une durée raisonnable (voir la fiche pays).
- Un lien « Gérer mes cookies » est accessible à tout moment (pied de page).
- Mesure d'audience recommandée : un outil **sans cookies** ou configuré selon l'exemption CNIL.
- Le composant de `kit/web/consent/` applique ces règles.

## Développement et tests

- **Jamais de vraies données personnelles** en développement ou en test. Utilise des données
  fictives générées.
- Une copie de la production en développement est interdite, sauf anonymisation complète.

## Violation de données

Fuite, perte, accès non autorisé : suis `legal/modeles/procedure-violation-donnees.md`. En Europe,
l'autorité doit être notifiée dans les **72 heures** si la violation présente un risque, et les
personnes concernées doivent être prévenues si le risque est élevé. Toute violation est consignée,
même sans notification.

## Analyse d'impact (AIPD)

Elle est obligatoire si le traitement présente un risque élevé. Exemples : données sensibles à
grande échelle, surveillance systématique, profilage aux effets importants, données de mineurs à
grande échelle, technologies nouvelles. Dans ce cas, signale-le à la personne et propose de la
préparer. L'outil PIA de la CNIL peut servir de modèle.
