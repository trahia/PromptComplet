# Règle 03 — Authentification et comptes (non négociable)

## Fournisseur

- On **ne code pas** l'authentification de zéro. On utilise un fournisseur reconnu et maintenu :
  Supabase Auth, Clerk, Better Auth (open source), Firebase Authentication… (voir
  `catalogue/connexions.md`).
- Le choix du fournisseur est justifié dans le plan : prix, localisation des données, méthodes
  disponibles.

## Mots de passe (si proposés)

- Au moins **15 caractères** si le mot de passe est le seul facteur, au moins **8** avec une double
  authentification (NIST SP 800-63B rév. 4). Aucune règle de composition imposée (« 1 majuscule,
  1 chiffre… »).
- Longueur maximale d'au moins 64 caractères. Copier-coller et gestionnaires de mots de passe
  autorisés.
- Refus des mots de passe connus comme compromis (vérification « k-anonymat » type Have I Been
  Pwned, ou fonction du fournisseur).
- Pas de changement périodique forcé : changement seulement en cas de compromission.
- Si le hachage est fait chez nous : Argon2id (paramètres OWASP actuels). À défaut, bcrypt avec un
  coût d'au moins 12.

## Double authentification (MFA)

- **Obligatoire** pour tous les comptes administrateurs et pour les accès au back-office.
- Proposée à tous les utilisateurs : passkey ou application TOTP. Le SMS n'est qu'un dernier recours
  (méthode faible).
- Les **passkeys** (empreinte, visage) sont recommandées : plus sûres et plus simples.

## Sessions et jetons

- Jetons d'accès de courte durée, jetons de rafraîchissement **renouvelés à chaque usage**, et
  révocation possible.
- « Se déconnecter de tous les appareils » est disponible. Toutes les sessions sont invalidées
  après un changement de mot de passe ou une suppression de compte.
- Web : cookies `Secure`, `HttpOnly`, `SameSite`. Mobile : stockage sécurisé (Keychain/Keystore).
- Expiration de session après inactivité pour les apps sensibles (santé, finance, administration).

## Protection contre les attaques

- Messages identiques, que le compte existe ou non (« Si un compte existe pour cette adresse, un
  e-mail a été envoyé »). Cela empêche de deviner qui est inscrit.
- Limitation de débit et ralentissement progressif après plusieurs échecs. Anti-robot après N échecs.
- Liens magiques et codes : usage unique, courte durée (15 minutes maximum pour un lien,
  10 minutes pour un code).
- Réinitialisation de mot de passe : lien à usage unique, valable 15 à 60 minutes. Elle invalide les
  sessions ouvertes.
- Vérification de l'e-mail avant toute action sensible.

## Connexions via un compte existant (OAuth / OpenID Connect)

- Flux avec PKCE, contrôle de `state` et de `nonce`, vérification du jeton d'identité, URL de retour
  exactes (pas de jokers), permissions minimales.
- Rattachement de comptes (même e-mail via Google et via mot de passe) : seulement après vérification
  que la personne contrôle les deux.
- **Apple, règle 4.8 de l'App Store** : une app iOS qui propose une connexion sociale tierce (Google,
  Facebook, etc.) pour le compte principal doit aussi proposer une connexion équivalente qui :
  - limite les données au nom et à l'e-mail ;
  - permet de masquer l'e-mail ;
  - ne suit pas l'utilisateur pour la publicité sans consentement.
  En pratique, on ajoute **Sign in with Apple**. Exceptions : app qui n'utilise que son propre
  système de comptes, comptes d'école ou d'entreprise existants, identité électronique officielle,
  client d'un service tiers précis. Le script de conformité le vérifie.
- Boutons « Continuer avec Google / Apple » : respecter les chartes graphiques officielles des
  fournisseurs (règle 06).

## Suppression du compte

- **Depuis l'app et depuis le site**, sans passer par le support : exigé par Apple (règle 5.1.1(v))
  et Google Play, et par le RGPD.
- Google Play exige en plus une **page web** où demander la suppression sans l'app.
- Reconfirmation de l'identité avant la suppression. Délai de grâce facultatif, annoncé clairement.
- La suppression efface ou anonymise réellement les données (voir règle 02), y compris les fichiers
  envoyés.

## Comptes administrateurs

- Rôle séparé, double authentification obligatoire, journal de toutes les actions.
- Aucun compte administrateur partagé. Aucun mot de passe par défaut.
- Accès au back-office limité, idéalement à une adresse dédiée.
