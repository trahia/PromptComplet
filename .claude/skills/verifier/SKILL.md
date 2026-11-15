---
name: verifier
description: Vérifie la sécurité et la conformité du projet ZeroTrap (pages légales, données, accessibilité, secrets, base de données, intégrité de la méthode) et explique le résultat simplement. À utiliser quand la personne demande « vérifie », « est-ce que tout est en règle », ou après une étape importante.
---

# /verifier — Contrôle complet, expliqué simplement

1. Lance `node zerotrap/scripts/verifier-conformite.mjs`.
2. Lance `node zerotrap/scripts/scanner-secrets.mjs`.
3. Si le projet a un `package.json` : lance les scripts `lint`, `typecheck`, `test`, `test:e2e` et
   `test:a11y` qui existent.
4. Si des changements sensibles sont en cours (authentification, paiement, droits, fichiers, IA) :
   lance `/security-review`.
5. Présente le résultat **sans jargon**, en trois groupes :
   - ✅ ce qui est en ordre ;
   - 🔧 ce que tu corriges tout de suite. Corrige-le, puis relance la vérification ;
   - 🙋 ce qui demande une information ou une décision de la personne. Explique pourquoi en une phrase.
6. Note le résultat dans `projet/journal.md`.

Ne masque jamais un problème et ne désactive jamais un contrôle pour obtenir un résultat « vert ».
