---
name: lancement
description: Prépare la mise en ligne du site ou la publication de l'app PromptComplet avec la checklist complète (légal, sécurité, données, accessibilité, performance, e-mails, stores, paiements). À utiliser avant toute mise en production.
disable-model-invocation: true
---

# /lancement — Checklist avant mise en ligne

1. Annonce : « Je passe la checklist de lancement : environ 10 étapes. Je te tiens au courant. »
2. Refais la veille légale si elle date de plus de 90 jours (`/veille-legale`).
3. Lance `node promptcomplet/scripts/verifier-conformite.mjs --release`, ainsi que tous les tests et
   scans.
4. Parcours `promptcomplet/methode/06-lancement.md` point par point. Pour chaque point : ✅ fait et
   vérifié, 🔧 corrigé maintenant, ou 🙋 action de la personne.
5. Ne mets **rien** en production sans le **feu vert explicite** de la personne, donné après lecture du
   récapitulatif.
6. Après le lancement : `config.statut = "production"`, une ligne dans `projet/journal.md`, et la date
   de la prochaine veille légale.
