# Légal — comment ça marche

> ⚖️ Ces fiches sont un **point de départ** rédigé le 2026-11-11 à partir de sources officielles.
> Elles ne remplacent ni la vérification à jour (`methode/02-veille-legale.md`), ni un avocat.
> ⚠️ signale un point incertain, en attente ou récemment modifié, à revérifier en priorité.

## Contenu

| Dossier / fichier | Rôle |
|---|---|
| `affichages-obligatoires.md` | **Tout ce qui doit être visible, endroit par endroit** : pied de page, bandeau cookies, formulaires, fiche produit, panier, e-mails, abonnements, app. À relire au plan, à chaque fonctionnalité et avant le lancement. |
| `modeles/mention-formulaire.md` | Textes courts à afficher sous chaque formulaire (inscription, contact, newsletter, commande). |
| `matrice-obligations.md` | Quelles pages et fonctionnalités sont exigées, selon les pays et les fonctionnalités. Le script de conformité applique cette matrice. |
| `pays/` | Une fiche par pays ou zone : lois, régulateur, obligations, sources officielles à consulter. |
| `modeles/` | Modèles des pages légales et des documents internes, avec des repères `[À COMPLÉTER : …]`. |

## Fiches disponibles

| Code(s) pays | Fiche |
|---|---|
| Tous les pays de l'UE et de l'EEE | `pays/union-europeenne.md`, plus la fiche nationale si elle existe |
| FR (et DROM) | `pays/france.md` |
| BE | `pays/belgique.md` |
| LU | `pays/luxembourg.md` |
| CH | `pays/suisse.md` |
| GB | `pays/royaume-uni.md` |
| CA | `pays/canada.md` (dont le Québec) |
| US | `pays/etats-unis.md` |
| IL | `pays/israel.md` |
| MA | `pays/maroc.md` |
| TN | `pays/tunisie.md` |
| DZ | `pays/algerie.md` |
| SN, CI | `pays/senegal-cote-divoire.md` |
| BR | `pays/bresil.md` |
| IN, CN, JP, AU, KR | `pays/asie-pacifique.md` |
| Tout autre pays | `pays/autres-pays.md` (méthode générique) |

## Où vivent les pages légales d'un projet

Dans le projet de la personne : `legal/<code-langue>/<page>.md`, par exemple
`legal/fr/politique-confidentialite.md`. Ces fichiers sont la **source unique**. Le site ou l'app les
affiche avec les composants du kit (`kit/web/legal/`, `kit/mobile/legal/`), sans les recopier.

Noms de pages normalisés (utilisés par le script de conformité) :

| Page | Fichier |
|---|---|
| Politique de confidentialité | `politique-confidentialite.md` |
| Mentions légales / Informations légales | `mentions-legales.md` |
| Conditions générales d'utilisation | `cgu.md` |
| Conditions générales de vente | `cgv.md` |
| Politique cookies | `cookies.md` |
| Accord de traitement des données (clients professionnels d'un logiciel) | `dpa-clients.md` |
| Déclaration d'accessibilité | `declaration-accessibilite.md` |
