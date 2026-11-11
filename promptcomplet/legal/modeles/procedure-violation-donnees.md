# Procédure en cas de violation de données (fuite, perte, accès non autorisé)

À suivre **immédiatement** dès qu'un incident est suspecté. L'IA guide la personne pas à pas. Les
décisions et les déclarations officielles sont prises **par la personne**.

## Dans la première heure : contenir

1. **Arrêter la fuite** :
   - révoquer et renouveler les clés et mots de passe concernés ;
   - couper l'accès compromis ;
   - mettre hors ligne la fonction vulnérable si nécessaire.
2. **Préserver les preuves** : journaux, captures, dates et heures. Ne rien effacer.
3. Noter l'heure de découverte : **les délais légaux courent à partir de là**.

## Dans les 24 heures : évaluer

- Quelles données ? Combien de personnes ? Des données sensibles ?
- Quel risque pour les personnes (usurpation, fraude, atteinte à la réputation…) ?
- La faille est-elle corrigée ?

## Notifier (si nécessaire), dans les délais de chaque pays

| Zone | Autorité | Délai |
|---|---|---|
| UE / EEE | autorité nationale (France : CNIL, notifications.cnil.fr) | **72 h** si risque |
| Royaume-Uni | ICO | 72 h |
| Suisse | PFPDT (portail DataBreach) | dès que possible si risque élevé |
| Québec | CAI (+ personnes) | dès que possible si risque de préjudice sérieux |
| Canada (fédéral) | CPVP (+ personnes) | dès que possible si risque réel de préjudice grave |
| Brésil | ANPD (+ personnes) | 3 jours ouvrés |
| Israël | PPA | immédiatement pour les bases à sécurité élevée |
| États-Unis | selon chaque État concerné | variable |
| Produit couvert par le CRA (UE) | CSIRT / ENISA, si vulnérabilité activement exploitée | alerte 24 h, notification 72 h |
| Autres pays | voir la fiche pays et la veille légale | |

- Prévenir **les personnes concernées** si le risque est élevé : message clair, ce qui s'est passé,
  ce qu'elles doivent faire (changer de mot de passe…), un contact.
- Prévenir les **sous-traitants** ou **responsables** concernés selon les contrats.

## Après l'incident

- Inscrire l'incident dans le registre des violations (`projet/registre-traitements.md`), **même s'il
  n'a pas été notifié**.
- Analyser la cause, corriger durablement, ajouter un test pour qu'elle ne revienne pas.
- Résumer dans `projet/journal.md`.
