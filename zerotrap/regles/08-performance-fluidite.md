# Règle 08 — Performance, fluidité, stockage et réglages

## Web : budgets (mesurés au 75e centile, sur mobile)

| Indicateur | Objectif |
|---|---|
| LCP (affichage du contenu principal) | < 2,5 s |
| INP (réactivité aux interactions) | < 200 ms |
| CLS (stabilité visuelle) | < 0,1 |
| JavaScript chargé au départ | le moins possible. Viser < 200 Ko compressés |

Moyens :
- rendu serveur ou statique quand c'est possible ;
- découpage du code ;
- **images** :
  - AVIF/WebP, tailles adaptées (`srcset`) ;
  - dimensions déclarées ;
  - chargement différé hors écran ;
- **polices** :
  - hébergées avec le projet, en woff2, réduites aux caractères utiles ;
  - `font-display: swap` ;
- cache et CDN, compression Brotli ;
- **scripts tiers réduits au strict minimum**.

## Animations

- Fluides, à 60 images par seconde (120 sur les écrans compatibles). On n'anime que `transform` et
  `opacity`.
- Durées courtes pour l'interface (150 à 300 ms). Ressorts (springs) pour les gestes.
- `prefers-reduced-motion` respecté : les animations sont réduites ou remplacées, pas forcément
  supprimées.
- Une animation ne bloque jamais l'utilisateur.
- Outils : CSS, Motion, GSAP (web) ; Reanimated, exécuté sur le fil de l'interface (mobile).

## Mobile

- Démarrage rapide (viser moins de 2 secondes).
- Listes virtualisées (FlashList), images mises en cache (`expo-image`).
- Pas de rendus inutiles. Moteur Hermes.
- Hors ligne : contenus essentiels en cache, actions mises en file d'attente, messages clairs.
- Batterie : tâches de fond minimales, localisation seulement quand c'est utile.
- Réseau :
  - délais d'expiration ;
  - nouvelles tentatives avec attente croissante ;
  - indication de l'état de connexion.

## Stockage : le bon outil pour chaque chose

| Quoi | Où |
|---|---|
| Données structurées | Base de données (PostgreSQL), avec index sur les colonnes recherchées et pagination par curseur |
| Fichiers (photos, documents) | Stockage objet, **jamais dans la base**. Espace **privé** + liens signés pour les fichiers personnels. Images redimensionnées et servies par CDN. |
| Secrets et jetons sur l'appareil | Keychain / Keystore (`expo-secure-store`) |
| Cache local | SQLite / MMKV (mobile), cache HTTP (web) |

- Quotas par utilisateur, nettoyage des fichiers orphelins, suppression réelle lors de la suppression
  d'un compte.
- Surveiller les coûts de stockage et de bande passante.

## Serveur

- Pas de requêtes en cascade (« N+1 »), pool de connexions, cache là où c'est utile.
- Tâches lourdes (e-mails, traitement d'images, exports) dans une **file d'attente** en arrière-plan.
- Délais d'expiration partout. Opérations idempotentes (une action répétée ne fait pas de doublon).

## Surveillance

- Suivi des erreurs (ex. Sentry, région UE si possible), configuré **sans données personnelles**.
- Surveillance de disponibilité et alertes.
- Mesure des performances réelles. Budgets vérifiés en CI (Lighthouse CI) pour le web.

## Réglages utilisateur (page ou écran obligatoire si comptes)

- Profil.
- Préférences de notifications, par type.
- Langue, thème (clair, sombre, système).
- Confidentialité :
  - consentements ;
  - **export des données** ;
  - **suppression du compte**.
- Sécurité :
  - mot de passe, passkeys, double authentification ;
  - appareils connectés, déconnexion à distance.
- Comptes liés (Google, Apple…).
- Liens vers les pages légales et les licences tierces.
