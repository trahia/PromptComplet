# Règle 05 — Accessibilité (non négociable)

Objectif : toute personne doit pouvoir utiliser le produit : malvoyante, aveugle, sourde,
daltonienne, dyslexique, avec un handicap moteur ou cognitif, âgée, ou simplement sur un petit écran
en plein soleil.

## Norme visée

**WCAG 2.2 niveau AA** pour tout projet. Ce niveau couvre les normes nationales :
- EN 301 549 dans l'UE (basée sur WCAG 2.1 AA) et la loi européenne sur l'accessibilité ;
- RGAA en France ;
- IS 5568 en Israël (basée sur WCAG 2.0 AA) ;
- AODA en Ontario ;
- ADA aux États-Unis (WCAG utilisé comme référence).

Les obligations précises par pays (qui est concerné, déclaration, sanctions) sont dans les fiches
`legal/pays/`.

## 1. L'accessibilité est dans le code, pas dans une surcouche

Un module ajouté par-dessus un site inaccessible ne le rend **pas** conforme. On construit donc
accessible dès le départ, dans **chaque composant** :

- **Structure** : HTML sémantique (`header`, `nav`, `main`, `footer`, `button`, `a`…), un seul `h1`
  par page, titres dans l'ordre, attribut `lang`, titre de page unique.
- **Clavier** : tout est utilisable au clavier, dans un ordre logique. Le focus est **toujours
  visible**. Aucun piège au clavier. Un lien « Aller au contenu » est le premier élément.
- **Textes alternatifs** : chaque image utile a un `alt` qui décrit sa fonction. Une image
  décorative a `alt=""`.
- **Contrastes** : 4,5:1 pour le texte, 3:1 pour le grand texte et les éléments d'interface.
  L'information ne passe jamais par la couleur seule.
- **Formulaires** :
  - chaque champ a une étiquette visible et liée ;
  - les erreurs sont décrites en texte, à côté du champ, et annoncées aux lecteurs d'écran ;
  - les champs obligatoires sont signalés ;
  - le remplissage automatique est autorisé (`autocomplete`).
- **Cibles tactiles** : 24×24 px minimum (WCAG 2.2), 44×44 pt recommandés sur mobile.
- **ARIA** : seulement quand le HTML natif ne suffit pas. Zones dynamiques annoncées (`aria-live`).
- **Zoom et adaptation** : lisible avec un zoom à 200 %, sans défilement horizontal à 320 px de large.
- **Mouvement** : respect de `prefers-reduced-motion`, pas de clignotement de plus de 3 fois par
  seconde, pas de lecture automatique avec du son, et une pause possible pour tout ce qui bouge.
- **Médias** : sous-titres pour les vidéos, transcription pour l'audio.
- **Langues de droite à gauche** (hébreu, arabe) : `dir="rtl"` et propriétés CSS logiques
  (`margin-inline-start` plutôt que `margin-left`).
- **Contenus** : langage clair, liens explicites (pas de « cliquez ici »), et PDF accessibles ou
  remplacés par une version HTML.

## 2. Applications mobiles

- Chaque élément interactif a :
  - un `accessibilityLabel` (ce que c'est) ;
  - un `accessibilityRole` (bouton, lien…) ;
  - un `accessibilityHint` si l'action n'est pas évidente.
- La taille de texte du système est respectée (Dynamic Type sur iOS, échelle de police sur
  Android). On teste avec la plus grande taille.
- Les réglages système « Réduire les animations » et « Augmenter le contraste » sont respectés.
- Test avec VoiceOver (iOS) et TalkBack (Android) avant le lancement.

## 3. Le module d'accessibilité : un composant unique

Le kit fournit un module prêt à l'emploi (`zerotrap/kit/web/accessibility/` pour le web,
`zerotrap/kit/mobile/accessibility/` pour le mobile).

- Il est **inclus une seule fois**, à la racine de l'application (layout racine, ou fournisseur
  racine sur mobile). **Jamais recopié page par page.** Le chemin d'inclusion est déclaré dans
  `config.preuves.composant_accessibilite`, et le script de conformité le vérifie.
- Il propose :
  - une icône d'accessibilité visible sur toutes les pages ;
  - un menu : taille du texte, contraste renforcé, police plus lisible, espacement des lignes,
    soulignement des liens, réduction des animations, curseur agrandi ;
  - la **lecture de la page à voix haute** (synthèse vocale du navigateur) ;
  - un lien vers la **déclaration d'accessibilité**.
- Les préférences sont gardées sur l'appareil (stockage local). C'est un réglage demandé par
  l'utilisateur, donc il ne demande pas de consentement cookies.
- Il **complète** l'accessibilité du code, il ne la remplace pas. Ne prétends jamais qu'un site est
  conforme grâce au module.
- L'icône est dessinée par nous (SVG du kit). Aucun logo protégé n'est reproduit.

## 4. Déclaration d'accessibilité

Une page `declaration-accessibilite` est créée pour **tout** projet, à partir de
`legal/modeles/declaration-accessibilite.md`. Elle contient :
- le niveau de conformité visé et atteint ;
- la date de l'évaluation ;
- les limites connues ;
- les adaptations proposées ;
- un **moyen de contact** pour signaler un problème ;
- les voies de recours.

En Israël, elle inclut obligatoirement les coordonnées du **référent accessibilité**.

## 5. Tests obligatoires

| Test | Outil | Quand |
|---|---|---|
| Automatique, chaque page | axe-core via Playwright (`@axe-core/playwright`) : zéro violation « serious » ou « critical » | à chaque fonctionnalité, et en CI |
| Lint | `eslint-plugin-jsx-a11y` (web), règles d'accessibilité du framework | en continu |
| Audit | Chrome DevTools MCP (skill `a11y-debugging`), Lighthouse ≥ 95 (indicatif seulement) | à chaque étape importante |
| Clavier | parcours complet sans souris | avant chaque mise en ligne |
| Lecteur d'écran | NVDA ou VoiceOver (web), VoiceOver et TalkBack (mobile) | avant le lancement |

Les tests automatiques ne détectent qu'une partie des problèmes. Les tests manuels restent
obligatoires avant le lancement.
