# Étape 3 — Le plan concret

Objectif : un plan clair, chiffré et **validé par la personne** avant d'écrire la moindre ligne de
code. Résultat : `projet/plan.md`, et `projet/config.json` complété.

## Avant d'écrire le plan

- Relis `projet/brief.md`, `projet/config.json` et `projet/veille-legale.md`.
- Choisis l'arborescence dans `zerotrap/structures/` et les technologies dans
  `zerotrap/catalogue/stacks.md`. Préfère des technologies répandues, bien documentées et
  maintenues, adaptées au budget de la personne.
- Choisis les services (hébergement, base de données, e-mails, paiements) dans
  `zerotrap/catalogue/services.md`. Pour des utilisateurs européens, préfère un hébergement
  dans l'UE.

## Contenu obligatoire de `projet/plan.md`

1. **Résumé** : le projet en 5 lignes, tel que validé.
2. **Ce que je te recommande** : les technologies et services choisis. Pour chacun : pourquoi, en
   une phrase simple, et l'alternative possible.
3. **Fonctionnalités par phase** :
   - Phase 1 (première version utilisable, la plus petite possible) ;
   - Phase 2 ;
   - Plus tard.
4. **Données collectées**, sous forme de tableau. Il remplit `config.donnees` et le registre des
   traitements.

   | Donnée | Pourquoi | Base légale | Durée de conservation | Où elle est stockée | Obligatoire ? |
   |---|---|---|---|---|---|

5. **Services externes (sous-traitants)**, sous forme de tableau. Il remplit `config.sous_traitants`.

   | Service | Rôle | Pays d'hébergement des données | Garanties (DPA, clauses types…) | Coût |
   |---|---|---|---|---|

6. **Sécurité** : niveau ASVS visé (2, ou 3 si données sensibles), qui peut voir quoi (tableau
   des rôles et des droits), points de vigilance propres au projet.
7. **Légal** : pages à créer (le script de conformité calcule la liste minimale), obligations par
   pays, informations à fournir par la personne (voir `02-veille-legale.md`).
8. **Accessibilité** : niveau visé (WCAG 2.2 AA), module d'accessibilité, langues et sens
   d'écriture (droite à gauche pour l'hébreu ou l'arabe).
9. **Design** : 2 ou 3 pistes de direction artistique, décrites simplement (couleurs, typographie,
   ambiance, animations). La personne en choisit une. Indique les skills de design utilisés.
10. **Budget** :
    - coûts uniques : domaine, comptes Apple et Google, design… ;
    - coûts mensuels fixes ;
    - coûts variables : SMS, e-mails, commissions de paiement…
    Donne une estimation pour 100, 1 000 et 10 000 utilisateurs. Indique « prix approximatifs vérifiés le <date> ».
11. **Étapes et calendrier** : les grandes étapes de construction, avec ce que la personne pourra
    voir et valider à la fin de chacune.
12. **Ce dont j'ai besoin de toi** : comptes à créer (par la personne elle-même), informations
    légales, contenus (textes, photos, logo), décisions.
13. **Risques et points ouverts**, y compris ton avis sur un moyen de paiement « Autre ».
14. **Si le type est « Entreprise »** : les étapes de création ou de structuration (statut, démarches,
    banque professionnelle, assurance, comptabilité, facturation). Voir `structures/entreprise.md`.
    Précise que ce n'est pas un conseil juridique ou fiscal, et recommande un expert-comptable.

## Règles du plan

- Écris pour quelqu'un qui ne connaît pas le développement : des phrases courtes, et chaque terme
  technique expliqué en une ligne.
- Le plan ne réduit **jamais** la sécurité, la conformité ou l'accessibilité pour gagner du temps ou de
  l'argent. Si le budget ne suffit pas, réduis le périmètre fonctionnel, pas les protections.
- Les comptes chez les fournisseurs (Apple, Google Play, Stripe, hébergeur, nom de domaine…) sont
  créés **par la personne**. Tu lui expliques comment faire, étape par étape, et tu lui rappelles
  d'activer la double authentification sur chacun.

## Validation

1. Présente le plan section par section, ou en entier s'il est court.
2. Demande une validation explicite. Intègre les modifications demandées.
3. Une fois validé :
   - passe `config.statut` à `"construction"` ;
   - complète `config.donnees`, `config.sous_traitants` et `config.preuves` (chemins prévus) ;
   - crée `projet/registre-traitements.md` à partir de `legal/modeles/registre-traitements.md` ;
   - crée `projet/licences.md` (vide pour l'instant) et `projet/consignes.md` (choix techniques
     retenus) ;
   - lance `node zerotrap/scripts/verifier-conformite.mjs` ;
   - note la validation dans `projet/journal.md`.
4. Passe à `methode/04-construction.md`.
