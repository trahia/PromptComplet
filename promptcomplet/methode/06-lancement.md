# Étape 6 — Le lancement

Déclenché par la commande `/lancement`. Ne mets rien en ligne et ne publie rien sur un store
sans que **toute** cette checklist soit passée, et sans le feu vert explicite de la personne.

## 1. Vérifications automatiques

```bash
node promptcomplet/scripts/verifier-conformite.mjs --release
```

Le mode `--release` est strict : aucun `[À COMPLÉTER]`, veille légale de moins de 90 jours, toutes
les pages et preuves présentes. Lance aussi les tests (unitaires, bout en bout, accessibilité) et
les scans de sécurité (voir `catalogue/outils-securite.md`).

## 2. Légal

- [ ] Veille légale refaite pour tous les pays (`02-veille-legale.md`).
- [ ] Toutes les pages légales complètes, dans toutes les langues, et accessibles depuis chaque page
      (pied de page) ou depuis les réglages (app).
- [ ] Contrats de sous-traitance (DPA) acceptés chez chaque fournisseur.
- [ ] Registre des traitements à jour.
- [ ] Selon le projet, obligations vérifiées dans les fiches pays :
      - responsabilité du fait des produits (UE, directive 2024/2853) ;
      - Data Act (SaaS, objets connectés) ;
      - P2B (vendeurs professionnels) ;
      - influence commerciale (France).
- [ ] Assurance responsabilité civile professionnelle vérifiée par la personne.
- [ ] Relecture par un professionnel **recommandée** (obligatoire en pratique pour la vente en ligne
      ou les données sensibles). Dis-le clairement à la personne.
- [ ] **`legal/affichages-obligatoires.md` repris point par point**, page ouverte : pied de page,
      bandeau cookies, chaque formulaire, fiche produit, panier, bouton de commande, e-mail de
      confirmation, abonnement, avis, app.

## 3. Sécurité

- [ ] Scans au vert : secrets, code, dépendances. Scan ZAP « baseline » sur la préproduction.
- [ ] Clés de production saisies par la personne, distinctes des clés de test, avec droits minimaux.
- [ ] Double authentification activée sur **tous** les comptes de la personne (GitHub, hébergeur,
      base de données, Stripe, Apple, Google, nom de domaine, e-mail).
- [ ] En-têtes de sécurité vérifiés (CSP, HSTS…). HTTPS partout.
- [ ] Sauvegardes automatiques actives, **restauration testée**.
- [ ] Limitation de débit sur les connexions, les inscriptions et les formulaires.
- [ ] Suivi des erreurs et alertes configurés, sans données personnelles dans les journaux.
- [ ] `security.txt` publié, contact sécurité défini, procédure en cas de fuite connue.
- [ ] `projet/maintenance-securite.md` complet :
      - durée de support annoncée ;
      - délais de correction des failles ;
      - calendrier de rotation des clés ;
      - historique des versions.
- [ ] Liste des composants générée pour cette version : `projet/sbom.cdx.json` (règle 01,
      section 13).
- [ ] Test d'intrusion par un professionnel fait et failles graves corrigées, s'il est obligatoire
      (données sensibles, place de marché avec paiement, public mineur) : `projet/test-intrusion.md`.
- [ ] Fichiers envoyés par les utilisateurs, s'il y en a : envoi d'un faux fichier testé (un `.exe`
      renommé en `.jpg` doit être refusé), métadonnées GPS supprimées, antivirus actif.
- [ ] Continuité (règle 01, section 9) :
      - codes de secours de la double authentification rangés hors ligne ;
      - successeur ou second administrateur désigné ;
      - fiche « comptes et qui appeler » prête.
- [ ] Test : un utilisateur ne peut modifier ni son rôle, ni son abonnement, ni sa date de
      consentement ; 20 utilisations simultanées d'un code promo ou d'un crédit n'en accordent
      qu'une.

## 4. Données et cookies

- [ ] Bandeau cookies testé : rien ne se charge avant le consentement, « Refuser » aussi simple
      que « Accepter ».
- [ ] Suppression de compte et export des données testés de bout en bout.
- [ ] Purges automatiques (durées de conservation) en place.

## 5. Accessibilité

- [ ] Zéro erreur axe-core sur toutes les pages.
- [ ] Test complet au clavier, puis avec un lecteur d'écran (VoiceOver, NVDA ou TalkBack).
- [ ] Déclaration d'accessibilité publiée.

## 6. Qualité et performance

- [ ] Core Web Vitals dans le vert (web), démarrage rapide (mobile).
- [ ] Captures d'écran vérifiées sur mobile, tablette et ordinateur, en thème clair et sombre.
- [ ] Aucun texte provisoire, aucun lorem ipsum, aucune image de démonstration.
- [ ] Page 404, états vides et messages d'erreur soignés.

## 7. E-mails et domaine

- [ ] SPF, DKIM et DMARC configurés et vérifiés. E-mails de test reçus en boîte principale.
- [ ] Nom de domaine renouvelé automatiquement, protection WHOIS si disponible.
- [ ] SEO de base : titres, descriptions, sitemap, robots.txt, aperçus de partage.
- [ ] Domaine :
      - verrou de transfert ;
      - DNSSEC ;
      - enregistrement CAA ;
      - aucun enregistrement DNS orphelin ;
      - e-mail de récupération du registrar hors du domaine.
- [ ] Suivi d'ouverture des e-mails désactivé, ou soumis à un consentement séparé (CNIL, 2026).

## 8. Stores (applications)

Détail, dates et sources : `promptcomplet/regles/12-stores-applications.md`. Revérifie-la sur les pages
officielles juste avant l'envoi.

- [ ] **Forme de l'app reconfirmée** avec la personne (`projet.forme_app`). Pour un site affiché dans
      une app (« enveloppe ») : de vraies fonctions d'app sont présentes (règle Apple 4.2, règles
      WebView de Google Play).
- [ ] **App web** (« pwa ») : manifeste, icônes, page hors ligne, service worker sans données
      personnelles en cache, page d'aide à l'installation sur iPhone. Aucune section « store »
      ci-dessous ne s'applique.
- [ ] **Apple** :
  - fiche de confidentialité (« Privacy Nutrition Label ») remplie fidèlement ;
  - questionnaire d'âge, avec les questions sur les fonctions de réseau social (obligatoires depuis
    septembre 2026) ;
  - captures d'écran ;
  - Sign in with Apple si une connexion sociale est proposée ;
  - suppression du compte dans l'app ;
  - statut de professionnel (DSA) vérifié pour l'UE, coordonnées professionnelles.
- [ ] **Google Play** :
  - formulaire « Sécurité des données » rempli fidèlement ;
  - suppression du compte dans l'app **et** page web de demande de suppression ;
  - test fermé terminé si le compte personnel est nouveau (12 testeurs, 14 jours) ;
  - classification du contenu ;
  - statut de professionnel déclaré (EEE et Royaume-Uni), coordonnées professionnelles.
- [ ] Règles de paiement des stores revérifiées (elles évoluent souvent).
- [ ] URL de la politique de confidentialité renseignée dans les deux stores.
- [ ] **Apple, technique** :
      - manifeste de confidentialité `PrivacyInfo.xcprivacy`, avec les raisons des API sensibles et
        les SDK tiers signés (exigé depuis le 01/05/2024) ;
      - demande App Tracking Transparency avant tout suivi publicitaire ;
      - déclaration de conformité à l'export (chiffrement).
- [ ] **Google Play, technique** : niveau d'API cible exigé à jour. ⚠️ Vérifier le niveau en vigueur
      sur https://support.google.com/googleplay/android-developer/answer/11926878.
- [ ] Écran « Licences open source » présent dans l'app.

## 9. Paiements

- [ ] Passage en mode réel validé par la personne. Webhooks signés et testés.
- [ ] Petite transaction réelle de test, puis remboursement de test.
- [ ] Factures conformes (mentions obligatoires du pays).

## 10. Après le lancement

- Passe `config.statut` à `"production"` et note le lancement dans le journal.
- Surveille les erreurs et les retours pendant les premiers jours.
- Planifie la prochaine veille légale (au plus tard dans 90 jours).
