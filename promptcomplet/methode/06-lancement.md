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
- [ ] Relecture par un professionnel **recommandée** (obligatoire en pratique pour la vente en ligne
      ou les données sensibles). Dis-le clairement à la personne.

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

## 8. Stores (applications)

- [ ] **Apple** :
  - fiche de confidentialité (« Privacy Nutrition Label ») remplie fidèlement ;
  - classification d'âge ;
  - captures d'écran ;
  - Sign in with Apple si une connexion sociale est proposée ;
  - suppression du compte dans l'app.
- [ ] **Google Play** :
  - formulaire « Sécurité des données » rempli fidèlement ;
  - page web de suppression de compte ;
  - période de test fermé si le compte est nouveau ;
  - classification du contenu.
- [ ] Règles de paiement des stores revérifiées (elles évoluent souvent).
- [ ] URL de la politique de confidentialité renseignée dans les deux stores.

## 9. Paiements

- [ ] Passage en mode réel validé par la personne. Webhooks signés et testés.
- [ ] Petite transaction réelle de test, puis remboursement de test.
- [ ] Factures conformes (mentions obligatoires du pays).

## 10. Après le lancement

- Passe `config.statut` à `"production"` et note le lancement dans le journal.
- Surveille les erreurs et les retours pendant les premiers jours.
- Planifie la prochaine veille légale (au plus tard dans 90 jours).
