# Services externes recommandés

> Liste de départ, établie le 2026-11-11. **Vérifie les prix, les régions d'hébergement et les
> contrats (DPA) au moment du plan.** Pour des utilisateurs européens, préfère une région UE. Chaque
> service retenu va dans `config.sous_traitants` et dans la politique de confidentialité.

## Hébergement web

| Service | Points forts | Données dans l'UE |
|---|---|---|
| Vercel | Idéal pour Next.js, aperçus automatiques | Régions UE pour les fonctions (à configurer) ; société américaine (DPF) |
| Cloudflare Pages / Workers | Rapide, généreux en gratuit | Réseau mondial ; options UE selon l'offre |
| Netlify | Simple pour les sites statiques | Société américaine |
| Scaleway, OVHcloud, Clever Cloud | Hébergeurs **français** (souveraineté). Offres HDS pour la santé. | Oui |

## Base de données, authentification, stockage de fichiers

| Service | Points forts | Données dans l'UE |
|---|---|---|
| **Supabase** | PostgreSQL + Auth + stockage + RLS, recommandé par défaut | Régions UE (Francfort, Paris, Irlande…) |
| Neon | PostgreSQL serverless | Régions UE |
| Firebase | Écosystème Google, temps réel | Multi-région UE disponible |
| Scaleway / OVHcloud (bases managées) | Hébergement français | Oui |

## E-mails transactionnels

| Service | Offre gratuite (approx.) | Données dans l'UE |
|---|---|---|
| Brevo (français) | environ 300 e-mails/jour | Oui |
| Scaleway TEM (français) | à vérifier | Oui |
| Mailjet | environ 6 000/mois (200/jour) | ⚠️ à vérifier |
| Resend | 3 000/mois (100/jour) | ⚠️ région UE à vérifier |
| Postmark | 100/mois | ⚠️ à vérifier |
| Amazon SES | 0,10 $ / 1 000 e-mails | Régions Paris, Francfort, Irlande |

## Mesure d'audience (sans cookies de préférence)

| Service | Remarques |
|---|---|
| Plausible | Sans cookies, hébergé dans l'UE |
| Matomo | Auto-hébergé ou cloud. Configurable selon l'exemption CNIL |
| Umami | Open source, auto-hébergeable |
| Pirsch | Sans cookies, hébergé en Allemagne |

Google Analytics : déconseillé par défaut (consentement obligatoire, transferts hors UE).

## Surveillance

| Service | Usage |
|---|---|
| Sentry | Suivi des erreurs. Région UE disponible. **Désactiver l'envoi de données personnelles.** |
| Better Stack, UptimeRobot | Surveillance de disponibilité |

## Mobile

| Service | Usage |
|---|---|
| Expo EAS | Compilation dans le cloud (sans Mac pour iOS), publication sur les stores, mises à jour à distance |
| Expo Notifications / FCM / APNs | Notifications push |
| RevenueCat | Achats intégrés et abonnements |

## Autres besoins fréquents

| Besoin | Options |
|---|---|
| Nom de domaine | OVHcloud, Gandi (français), Cloudflare Registrar |
| Anti-robot respectueux | Friendly Captcha (UE), Cloudflare Turnstile, hCaptcha |
| Recherche | Recherche plein texte PostgreSQL d'abord. Ensuite Meilisearch ou Typesense. |
| Cartes | OpenStreetMap + MapLibre (attribution obligatoire). Mapbox, Google Maps (consentement si chargé avec des traceurs). |
| Paiements | voir `paiements.md` |
| Authentification | voir `connexions.md` |
