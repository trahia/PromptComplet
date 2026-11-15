# Étape 4 — La construction

Prérequis : `projet/plan.md` validé, et `config.statut` égal à `"construction"`.

## 4.1 Mise en place (une seule fois)

1. **Arborescence** : crée exactement celle de `zerotrap/structures/<type>.md`.
2. **Skills** : installe les skills de la phase « Construction » listés dans
   `zerotrap/catalogue/skills.md` pour ce type de projet, avec l'accord de la personne.
   Utilise **uniquement** les sources du catalogue.
3. **Kit** : copie les composants de `zerotrap/kit/` adaptés à la technologie (accessibilité,
   consentement cookies, pages légales, en-têtes de sécurité, socle de base de données). Ne les
   recopie jamais page par page : ils sont inclus **une seule fois** à la racine.
4. **Pages légales** : crée `legal/<langue>/<page>.md` pour chaque page requise, à partir de
   `zerotrap/legal/modeles/`. Le script de conformité donne la liste.
5. **Qualité** : TypeScript strict, linter et formateur, tests unitaires, tests de bout en bout
   (Playwright) avec tests d'accessibilité (axe-core). Ajoute les scripts standard décrits dans
   `regles/09-structure-code.md` au `package.json`.
6. **Secrets** : crée `.env.example` avec le **nom** de chaque variable, sans valeur réelle, et une
   ligne de commentaire disant où obtenir la valeur. La personne remplit elle-même `.env`.
   Utilise les clés de **test** pendant le développement.
7. **Environnements séparés** : développement, prévisualisation (staging) et production, avec des
   bases de données distinctes. Pas de vraies données personnelles en développement : utilise des
   données fictives.
8. **Dépôt du projet** : propose à la personne de créer **son propre** dépôt GitHub privé
   (`gh repo create <nom> --private --source . --push`). Ensuite :
   - active Dependabot (alertes et mises à jour de sécurité), et ajoute l'écosystème du projet dans
     `.github/dependabot.yml` **avec un `cooldown` de 7 jours**, comme pour les GitHub Actions ;
   - si possible, protège la branche `main`.
   - Dépendances JavaScript (`regles/01-securite.md`, section 8) :
     - pnpm : `minimumReleaseAge: 10080` et `onlyBuiltDependencies` dans `pnpm-workspace.yaml` ;
     - npm : `ignore-scripts=true` dans `.npmrc`.
9. Lance `node zerotrap/scripts/verifier-conformite.mjs`, corrige, puis note la mise en
   place dans le journal.

## 4.2 La boucle de travail (pour chaque fonctionnalité)

Avance par **petites étapes** visibles. Pour chaque fonctionnalité :

1. **Annonce** en une ligne ce que tu fais, avec une estimation de durée grossière.
2. **Lis les règles concernées** dans `zerotrap/regles/`.
3. **Analyse d'impact** avec la checklist de `methode/05-evolution.md` : nouvelles données,
   nouveau service, cookies, paiement, pays, IA, mineurs, contenu utilisateur.
4. **Données d'abord** : schéma, migrations, droits d'accès. Accès refusé par défaut, puis règles
   explicites (RLS). Écris le tableau « qui peut lire, créer, modifier, supprimer quoi ».
5. **Serveur** : validation stricte des entrées et contrôle d'accès à chaque requête. Aucun secret
   côté client.
6. **Interface** : utilise les skills de design. Prévois tous les états (chargement, vide, erreur,
   succès, hors ligne). Le rendu doit être responsive et accessible au clavier et aux lecteurs
   d'écran, et respecter `prefers-reduced-motion`.
7. **Tests** :
   - tests unitaires de la logique ;
   - test de bout en bout du parcours ;
   - test d'accessibilité ;
   - **test des droits** : un utilisateur A ne peut jamais lire ni modifier les données d'un utilisateur B ;
   - **tests d'attaque** : chaque champ de chaque formulaire et de chaque API reçoit les charges de
     `kit/web/security/attack-payloads.ts` (règle 01, section 4).
8. **Légal** : mets à jour les pages légales, le registre et `config.json` si l'analyse d'impact
   l'exige.
9. **Vérification** : lance le linter, le typage, les tests et
   `node zerotrap/scripts/verifier-conformite.mjs`. Pour une fonctionnalité sensible
   (authentification, paiement, droits, fichiers, IA), lance aussi `/security-review`.
10. **Montre** le résultat à la personne (capture d'écran ou aperçu), puis fais valider.
11. **Journal et commit** : une ligne dans `projet/journal.md`, et un commit clair (Conventional Commits).

## 4.3 Définition de « terminé »

Une fonctionnalité est terminée seulement si **tout** est vrai :
- elle fonctionne, et tu l'as vérifiée toi-même (tests lancés et page ouverte) ;
- les tests passent, y compris accessibilité et droits d'accès ;
- le script de conformité ne signale aucune erreur ;
- les pages légales et `config.json` sont à jour ;
- aucun secret, aucune donnée de test réelle, aucun `console.log` de données personnelles ;
- la personne l'a vue et validée.

## 4.4 Les secrets, en pratique

- Pour chaque clé nécessaire, explique à la personne **où la trouver** (lien vers le tableau de bord
  du service) et **où la coller** : dans `.env`, jamais dans le chat.
- Si la personne colle une clé **réelle (live)** dans la conversation, dis-lui de la **révoquer et
  d'en créer une nouvelle** : elle a été exposée. Ne la réutilise pas.
- Utilise des clés restreintes (droits minimaux) quand le service le permet.
- Les variables préfixées `NEXT_PUBLIC_`, `EXPO_PUBLIC_`, `VITE_`, etc. sont **publiques** : n'y mets
  jamais de secret.

## 4.5 Si tu es bloqué

Dis-le tout de suite à la personne : ce qui bloque, ce que tu proposes. Ne contourne jamais un
verrou (hook, test, scan) pour avancer. Un verrou qui bloque signale un problème à corriger.
