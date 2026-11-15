# Modes de connexion : prix et explications

> **Prix approximatifs vérifiés le 2026-11-11.** Si cette date date de plus de 3 mois, revérifie sur
> les pages officielles avant de les présenter. Dis toujours « prix approximatif ».

## Les modes (pour la question Q8)

| Mode | Coût | Explication pour la personne | Remarques |
|---|---|---|---|
| E-mail + mot de passe | Gratuit (hors envoi des e-mails de vérification) | Le classique. | Règles de mot de passe de `regles/03`. Prévoir « mot de passe oublié ». |
| Lien magique par e-mail | Gratuit (+ e-mails) | Un clic dans un e-mail, sans mot de passe. | Lien à usage unique, valable 15 minutes. |
| Passkey (empreinte / visage) | Gratuit (standard ouvert) | Le plus sûr et le plus simple : le téléphone ou l'ordinateur reconnaît l'utilisateur. | Recommandé. Garder une méthode de secours. |
| Code par SMS | **Payant.** Exemple avec Twilio Verify : environ 0,05 $ par vérification réussie, **plus le SMS** (environ 0,08 $ en France, 0,26 $ en Israël, 0,22 $ au Maroc, environ 0,02 $ au Canada et aux États-Unis). Soit **environ 0,06 à 0,30 € par connexion**. | Un code reçu par SMS. | Méthode la plus chère et la plus exposée à la fraude (« SMS pumping »). Le SMS échoué reste facturé. Supabase n'inclut pas l'envoi de SMS : il faut un fournisseur comme Twilio. |
| Google | Gratuit | « Continuer avec Google ». | Créer un client OAuth dans la console Google. |
| Apple (Sign in with Apple) | Inclus dans l'**Apple Developer Program : 99 $/an** | Connexion Apple, qui peut masquer l'e-mail de l'utilisateur. | **Obligatoire sur iPhone** si une autre connexion sociale est proposée (règle 4.8). Utilisable aussi sur le web et Android. |
| GitHub | Gratuit | Utile pour un public de développeurs. | |
| Microsoft | Gratuit | Utile pour un public professionnel. | |
| Facebook / Meta | Gratuit | Connexion Facebook, en perte de vitesse. | Vérification d'entreprise Meta exigée pour certains accès avancés. Plus de démarches. |

## Plateformes d'authentification

| Plateforme | Gratuit jusqu'à | Ensuite | Remarques |
|---|---|---|---|
| **Supabase Auth** | 50 000 utilisateurs actifs par mois (offre gratuite) | Pro à 25 $/mois avec 100 000 utilisateurs actifs inclus, puis environ 0,00325 $ par utilisateur | Recommandé avec une base Supabase. Régions UE disponibles. Un projet gratuit se met en pause après 1 semaine d'inactivité. |
| **Firebase Authentication** | 50 000 utilisateurs actifs par mois | Facturation Google Cloud | SMS seulement avec l'offre payante (Blaze). |
| **Clerk** | 50 000 utilisateurs retenus par mois | Pro à 25 $/mois, puis environ 0,02 $ par utilisateur | Interface prête à l'emploi. |
| **Auth0** | 25 000 utilisateurs actifs par mois | À partir de 35 $/mois (500 inclus) | Vite cher pour un petit budget. |
| **Better Auth** | Open source, sans coût par utilisateur | Seulement l'hébergement et la base | Passkeys, double authentification, SSO. Demande plus de mise en place. |

## Règles des stores (rappel)

- **Apple 4.8** : une connexion sociale tierce pour le compte principal oblige à proposer aussi une
  connexion « respectueuse de la vie privée » équivalente (en pratique, Sign in with Apple).
- **Apple 5.1.1(v)** et **Google Play** : si on peut créer un compte dans l'app, on doit pouvoir le
  **supprimer depuis l'app**. Google Play exige en plus une **page web** de demande de suppression.

## Sources

- Twilio Verify : https://www.twilio.com/en-us/verify/pricing
- Tarifs SMS Twilio : https://www.twilio.com/en-us/sms/pricing/fr (remplacer `fr` par le code du pays)
- Apple Developer Program : https://developer.apple.com/programs/whats-included/
- Règles de l'App Store : https://developer.apple.com/app-store/review/guidelines/
- Suppression de compte Google Play : https://support.google.com/googleplay/android-developer/answer/13327111
- Supabase : https://supabase.com/pricing
- Firebase : https://firebase.google.com/pricing
- Clerk : https://clerk.com/pricing
- Auth0 : https://auth0.com/pricing
- Better Auth : https://www.better-auth.com
