# Union européenne (socle commun UE / EEE)

> Fiche mise à jour le 2026-11-11. Point de départ seulement : revérifier selon `methode/02-veille-legale.md`.

## Données personnelles — RGPD (règlement (UE) 2016/679)

- Régulateurs : l'autorité nationale de chaque pays, coordonnées par le CEPD/EDPB.
- **Politique de confidentialité (art. 13-14)**, qui indique :
  - l'identité et les coordonnées du responsable, et du DPO s'il y en a un ;
  - les finalités et les bases légales, avec les intérêts légitimes invoqués ;
  - les destinataires ;
  - les transferts hors UE et leurs garanties ;
  - les durées de conservation ;
  - les droits des personnes, dont le retrait du consentement et la plainte auprès de l'autorité ;
  - si la fourniture des données est obligatoire ;
  - l'existence de décisions automatisées.
- Bases légales (art. 6) : consentement, contrat, obligation légale, intérêts vitaux, mission
  publique, intérêt légitime.
- **Droits des personnes** : réponse sous **1 mois**, prolongeable de 2 mois (art. 12).
- **Violation de données** : notification à l'autorité sous **72 heures** (art. 33), et aux personnes
  si le risque est élevé (art. 34).
- **DPO** (art. 37) : obligatoire seulement en cas de suivi régulier à grande échelle, ou de données
  sensibles à grande échelle.
- **Représentant dans l'UE** (art. 27) : obligatoire pour un responsable établi hors UE qui vise des
  personnes dans l'UE.
- **Registre des traitements** (art. 30) : exemption partielle sous 250 salariés. On le tient quand
  même, c'est la méthode.
- **Âge du consentement numérique** (art. 8) : 16 ans par défaut, entre 13 et 16 selon les pays.
- **Transferts hors UE** : décision d'adéquation, clauses contractuelles types ou règles
  d'entreprise contraignantes. Le cadre UE–États-Unis (Data Privacy Framework) a été validé par le
  Tribunal le 3 septembre 2025 (affaire T-553/23). ⚠️ Un pourvoi (C-703/25 P) est en cours.
- ⚠️ **« Digital Omnibus » (COM(2025) 837)** : réforme en cours d'adoption, pas encore en vigueur. Le
  Conseil a adopté sa position le 21 octobre 2026 : allègements d'information dans les cas à faible
  risque, nouvelles finalités de cookies sans consentement… À surveiller à chaque veille.

## Cookies — directive ePrivacy (2002/58/CE, art. 5(3))

Consentement préalable, au standard RGPD, pour tout dépôt ou lecture sur l'appareil, sauf ce qui
est strictement nécessaire au service demandé ou à la communication. Les règles pratiques
(durée de conservation du choix, bouton « Refuser »…) sont fixées par chaque autorité nationale.

## Vente en ligne et mentions

- **Directive e-commerce (art. 5)** : identité, adresse, e-mail, registre du commerce, n° de TVA.
- **Directive droits des consommateurs (2011/83)** : informations précontractuelles et **droit de
  rétractation de 14 jours**.
- **Fonction de rétractation en ligne** (nouvel art. 11 bis, directive 2023/2673) : applicable
  **depuis le 19 juin 2026** à tout contrat à distance conclu en ligne qui ouvre un droit de
  rétractation. Fonction en deux étapes, du type « se rétracter du contrat ici ». ⚠️ Vérifier la
  transposition nationale.
- **Plateforme européenne de règlement en ligne des litiges (ODR) : supprimée le 20 juillet 2025**
  (règlement 2024/3228). **Retirer tout lien vers elle.**
- Nouvelle directive sur le règlement extrajudiciaire des litiges (2025/2647) : applicable en
  septembre 2028. ⚠️
- **DSA (règlement 2022/2065)** :
  - tous les intermédiaires : point de contact, représentant légal s'ils sont hors UE, CGU qui
    expliquent la modération ;
  - hébergeurs de contenus : mécanisme de signalement (art. 16), motivation des décisions (art. 17) ;
  - plateformes et places de marché : obligations supplémentaires (art. 20-32), dont la
    traçabilité des vendeurs. **Les micro et petites entreprises en sont exemptées** (art. 19 et 29).

## Accessibilité — European Accessibility Act (directive 2019/882)

- Applicable depuis le **28 juin 2025**.
- Services concernés : e-commerce, banque, livres numériques, communications électroniques,
  transport, médias audiovisuels.
- **Exemption pour les micro-entreprises prestataires de services** (art. 4(5)) : moins de
  10 personnes **et** chiffre d'affaires ou bilan ≤ 2 M€.
- Norme de référence en pratique : EN 301 549 (WCAG 2.1 AA). ⚠️ La norme harmonisée propre à l'EAA
  est en préparation.
- Les prestataires doivent publier comment ils respectent les exigences (annexe V).

## Cybersécurité

- **NIS2 (2022/2555)** : moyennes et grandes entités des secteurs listés. Ne s'applique **en général
  pas** à un petit site ou une petite app. Exceptions quelle que soit la taille : DNS, registres de
  domaines, services de confiance, communications électroniques publiques.
- **Cyber Resilience Act (règlement 2024/2847)** :
  - **depuis le 11 septembre 2026** : obligation de signaler les vulnérabilités activement
    exploitées et les incidents graves. Alerte sous 24 h, notification sous 72 h, puis rapport final,
    au CSIRT et à l'ENISA ;
  - le reste s'applique le 11 décembre 2027 ;
  - champ : les logiciels fournis pour fonctionner sur l'appareil de l'utilisateur, donc a priori
    les **apps mobiles et logiciels téléchargeables distribués commercialement**. ⚠️ À confirmer
    pour chaque projet ;
  - hors champ : un service purement en ligne (SaaS), sauf s'il sert de traitement à distance pour
    un produit couvert.

## Intelligence artificielle — AI Act (règlement 2024/1689)

- **Article 50 (transparence), applicable depuis le 2 août 2026** :
  - informer qu'on interagit avec une IA ;
  - marquer les contenus synthétiques ;
  - signaler les hypertrucages (deepfakes).
- Règlement « Omnibus IA » (UE) 2026/1744, publié le 24 juillet 2026 :
  - l'article 50 n'est **pas** reporté. Seul le marquage de l'article 50(2) bénéficie d'une
    transition jusqu'au 2 décembre 2026, pour les systèmes mis sur le marché avant le 2 août 2026 ;
  - obligations « haut risque » de l'annexe III reportées au 2 décembre 2027 ;
  - ⚠️ un rectificatif a été publié le 22 septembre 2026 : consulter la version consolidée.

## Sources officielles à consulter

- EUR-Lex : https://eur-lex.europa.eu
- CEPD / EDPB : https://www.edpb.europa.eu
- Observatoire législatif du Parlement (dossier 2025/0360(COD)) : https://oeil.secure.europarl.europa.eu
- Conseil de l'UE : https://www.consilium.europa.eu/fr/press/
- Stratégie numérique (AI Act, CRA) : https://digital-strategy.ec.europa.eu
- AccessibleEU : https://accessible-eu-centre.ec.europa.eu
- Décisions d'adéquation : https://commission.europa.eu/law/law-topic/data-protection/international-dimension-data-protection/adequacy-decisions_en
