# Asie-Pacifique : Inde, Chine, Japon, Australie, Corée du Sud

> Fiche mise à jour le 2026-11-15. Point de départ seulement : revérifier selon
> `methode/02-veille-legale.md`. Ces lois sont strictes et changent vite : pour un lancement dans
> l'un de ces pays, un avis juridique local est **fortement recommandé**, et **indispensable pour la
> Chine**.

## Inde (IN) — Digital Personal Data Protection Act 2023 et DPDP Rules 2025

- Régulateur : **Data Protection Board of India**. Ministère : MeitY (https://www.meity.gov.in).
- Les DPDP Rules ont été publiées le **14 novembre 2025**. Leur application est progressive :
  - certaines règles s'appliquent dès la publication ;
  - l'enregistrement des « consent managers » s'applique un an après ;
  - les **obligations principales** (consentement, sécurité, droits, notification des fuites)
    s'appliquent **18 mois après la publication**, donc vers la mi-mai 2027. ⚠️ Vérifier la date
    exacte au Journal officiel (Gazette of India).
- Ce qu'il faut prévoir :
  - un avis de consentement clair, détaillé, dans une langue comprise par la personne. La loi
    prévoit l'anglais ou l'une des langues de l'annexe 8 de la Constitution ;
  - un retrait du consentement aussi simple que son octroi ;
  - **moins de 18 ans** : consentement parental **vérifiable**, et ni suivi comportemental ni
    publicité ciblée ;
  - en cas de fuite : notification au Board **et** à chaque personne concernée ;
  - des obligations renforcées pour les « Significant Data Fiduciaries » désignées par l'État.

## Chine (CN) — Personal Information Protection Law (PIPL, 2021)

- Régulateur : **Cyberspace Administration of China (CAC)** (https://www.cac.gov.cn).
- **Consentement séparé** pour les données sensibles, le partage avec un tiers, la publication et
  le transfert hors de Chine.
- **Transfert hors de Chine** : évaluation de sécurité par la CAC, contrat type ou certification,
  selon les volumes. Des dispenses existent depuis 2024. ⚠️ Vérifier les seuils en vigueur.
- **Analyse d'impact obligatoire** avant un traitement sensible, un transfert ou une décision
  automatisée.
- Un responsable étranger qui vise la Chine doit désigner un **représentant en Chine**.
- Pour héberger un site en Chine continentale, il faut une **licence ICP**. Certaines données
  doivent rester stockées en Chine : opérateurs d'infrastructures critiques, gros volumes.
- ⚠️ Le contexte réglementaire est très différent de l'Europe : avis d'un avocat local
  **indispensable** avant tout lancement visant la Chine.

## Japon (JP) — Act on the Protection of Personal Information (APPI)

- Régulateur : **Personal Information Protection Commission (PPC)** (https://www.ppc.go.jp/en/).
- Consentement exigé pour transmettre des données à un tiers, sauf exceptions.
- **Transfert à l'étranger** : consentement, avec une information sur le système de protection du
  pays de destination, sauf pays reconnu équivalent. L'UE et le Japon se reconnaissent
  mutuellement.
- **Fuite de données** : rapport rapide à la PPC et information des personnes. Le rapport final
  est attendu sous 30 jours, ou 60 jours en cas d'attaque. ⚠️ Vérifier les délais.
- **Réforme adoptée** : loi n° 56 de 2026, promulguée le 17 juillet 2026. Elle crée notamment des
  **amendes administratives** et doit entrer en vigueur au plus tard en juillet 2028. ⚠️ Suivre les
  textes d'application de la PPC.

## Australie (AU) — Privacy Act 1988 et Australian Privacy Principles (APP)

- Régulateur : **OAIC** (https://www.oaic.gov.au). Mineurs et réseaux sociaux : **eSafety
  Commissioner** (https://www.esafety.gov.au).
- **Exemption des petites entreprises** (chiffre d'affaires d'au plus 3 M AUD), avec de nombreuses
  exceptions : santé, vente de données personnelles… ⚠️ Vérifier si la réforme en cours l'a
  supprimée.
- **Notifiable Data Breaches** : déclaration à l'OAIC et aux personnes en cas de fuite grave.
- Réforme de 2024 (Privacy and Other Legislation Amendment Act 2024) :
  - **délit civil d'atteinte grave à la vie privée**, applicable depuis le 10 juin 2025 ;
  - **décisions automatisées, à partir du 10 décembre 2026** : la politique de confidentialité
    doit indiquer quand un programme informatique prend ou aide à prendre une décision qui affecte
    significativement les personnes (APP 1.7 à 1.9). Concerne les produits avec IA ou scoring ;
  - **code de protection de la vie privée des enfants en ligne** en préparation par l'OAIC.
    ⚠️ Vérifier son statut.
- **Âge minimum de 16 ans** pour certains réseaux sociaux, depuis le 10 décembre 2025 (Online
  Safety Amendment (Social Media Minimum Age) Act 2024). ⚠️ Vérifier si le produit entre dans la
  définition.
- E-mails et SMS commerciaux : Spam Act 2003 (consentement, identification, désinscription).

## Corée du Sud (KR) — Personal Information Protection Act (PIPA)

- Régulateur : **Personal Information Protection Commission (PIPC)** (https://www.pipc.go.kr/eng/).
- Consentement distinct pour chaque finalité, avec une information détaillée.
- Réforme de 2023 : **amendes jusqu'à 3 % du chiffre d'affaires** total, hors activités sans lien
  avec la violation.
- Les entreprises étrangères qui dépassent certains seuils doivent désigner un **représentant
  local**.
- Fuite de données : information des personnes et déclaration à la PIPC, en principe sous
  72 heures. ⚠️ Vérifier les seuils et délais.
- E-mails et SMS commerciaux : loi sur les réseaux d'information et de communication (consentement
  préalable, et règles horaires pour les envois de nuit).

## Pour chaque pays de cette fiche

- [ ] Langue locale pour les pages légales (ja, zh, ko ; en ou hi pour l'Inde ; en pour l'Australie).
- [ ] Mécanisme de transfert des données vers les serveurs utilisés, documenté dans `config.sous_traitants`.
- [ ] Procédure de fuite de données complétée avec le régulateur et le délai du pays
      (`legal/modeles/procedure-violation-donnees.md`).
- [ ] Sources et dates notées dans `projet/veille-legale.md`.
