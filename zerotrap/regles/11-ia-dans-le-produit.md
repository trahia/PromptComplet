# Règle 11 — Intelligence artificielle dans le produit

S'applique dès que le produit utilise un modèle d'IA : chatbot, génération de texte ou d'images,
résumé, recommandations, classement, analyse de photos ou de voix.

## Transparence (UE : AI Act, article 50, applicable depuis le 2 août 2026)

- Les utilisateurs savent **clairement** qu'ils échangent avec une IA, sauf si c'est évident.
- Les contenus générés (images, audio, vidéo, texte publié pour informer le public) sont **marqués**
  comme générés par IA, de façon lisible par les machines quand la loi l'exige.
- Les hypertrucages (deepfakes) sont signalés.
- Vérifie l'état exact des obligations pendant la veille légale, ainsi que les ajustements
  du « Digital Omnibus ».
- **Maîtrise de l'IA** (AI Act, art. 4) : les personnes qui utilisent ou opèrent l'IA du produit sont
  formées à ses limites. ⚠️ L'Omnibus IA (2026/1744) a assoupli cette obligation : vérifier la version
  consolidée sur EUR-Lex.

## Interdits et cas à haut risque

- **Pratiques interdites** (AI Act, article 5), à refuser :
  - manipulation subliminale ;
  - exploitation des vulnérabilités ;
  - notation sociale ;
  - reconnaissance des émotions au travail ou à l'école ;
  - catégorisation biométrique sensible ;
  - etc.
- **Usages à haut risque** (annexe III) : recrutement, crédit, éducation et notation, accès à des
  services essentiels, biométrie… **Arrête-toi et recommande un conseil juridique** avant d'aller
  plus loin : les obligations sont lourdes.

## Données personnelles

- N'envoie au fournisseur d'IA **que le strict nécessaire**. Supprime ou pseudonymise les données
  personnelles quand c'est possible. Aucune donnée sensible sans base légale renforcée.
- Choisis un fournisseur dont les conditions **excluent l'entraînement** sur les données envoyées par
  l'API. Contrat de sous-traitance (DPA). Hébergement dans l'UE ou garanties de transfert.
- Le fournisseur est listé dans `config.sous_traitants` et dans la politique de confidentialité.
- Pas de décision automatisée ayant des effets importants sur une personne sans intervention
  humaine possible (RGPD, article 22).

## Sécurité (OWASP Top 10 LLM 2025 et Agentic Top 10 2026)

- **Injection de prompt** : tout contenu externe (message utilisateur, page web, document) peut
  contenir des instructions malveillantes. Le modèle n'a jamais plus de droits que l'utilisateur
  qui l'utilise.
- **Sortie non fiable** : la réponse du modèle est traitée comme une entrée utilisateur. Elle est
  validée et échappée avant d'être affichée, et jamais exécutée telle quelle (pas de SQL, de code
  ou de commande directement issus du modèle).
- **Outils et actions** :
  - droits minimaux ;
  - liste blanche ;
  - **confirmation humaine** avant toute action importante (paiement, envoi, suppression).
- **Aucun secret** dans les instructions système. On suppose qu'elles peuvent fuiter.
- **Coûts et abus** :
  - limites par utilisateur (requêtes, jetons) ;
  - plafond de dépense ;
  - surveillance des usages anormaux ;
  - modération des contenus générés si le public est large ou mineur.

## Qualité

- Jeu de tests (questions types et réponses attendues), relancé à chaque changement de modèle ou
  de prompt.
- Comportement prévu quand l'IA ne sait pas ou échoue : message honnête et alternative.
- Possibilité de signaler une mauvaise réponse.

## Choix du modèle

Choisis selon la qualité, le coût, la localisation des données et les conditions d'utilisation.
Pour Claude, utilise le skill `claude-api` afin d'avoir les identifiants de modèles et les tarifs
à jour. Ne code jamais un identifiant de modèle de mémoire.
