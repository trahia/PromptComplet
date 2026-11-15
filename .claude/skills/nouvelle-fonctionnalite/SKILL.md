---
name: nouvelle-fonctionnalite
description: Ajoute ou modifie une fonctionnalité du projet ZeroTrap en mettant à jour la sécurité, les données personnelles, les pages légales et les tests. À utiliser dès que la personne demande une nouvelle fonctionnalité ou un changement important.
argument-hint: "[description de la fonctionnalité]"
---

# /nouvelle-fonctionnalite — Ajouter une fonctionnalité sans rien casser

Fonctionnalité demandée : $ARGUMENTS

1. Reformule la demande en 2 lignes et fais-la valider.
2. Propose, si c'est utile, 1 à 3 améliorations auxquelles la personne n'a pas pensé.
3. Passe la **checklist d'impact** de `zerotrap/methode/05-evolution.md` et montre le résultat :
   - nouvelles données ;
   - nouveau service ;
   - cookies ;
   - paiement ;
   - pays ;
   - IA ;
   - mineurs ;
   - contenu utilisateur ;
   - droits d'accès.
4. Annonce le plan de travail (étapes et durée approximative), puis suis la boucle de
   `zerotrap/methode/04-construction.md`, section 4.2.
5. Mets à jour `projet/config.json`, les pages `legal/` dans **toutes** les langues, et
   `projet/registre-traitements.md` si nécessaire.
6. Termine par `/verifier` et une ligne dans `projet/journal.md`.
