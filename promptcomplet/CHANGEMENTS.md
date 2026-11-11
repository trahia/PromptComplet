# Historique des versions de PromptComplet

## 1.0.0 — 2026-11-11

Première version.

- **Méthode** : 9 étapes, de l'installation au lancement :
  - installation ;
  - questionnaire guidé (nom, type, plateformes, pays, description, modèle économique, propositions de
    fonctionnalités, comptes et connexions avec prix, paiements par pays, questions « auxquelles on ne
    pense pas ») ;
  - veille légale sur les sources officielles ;
  - plan chiffré ;
  - construction par petites étapes ;
  - évolution ;
  - lancement ;
  - mise à jour ;
  - projet existant.
- **Règles** non négociables : sécurité (OWASP ASVS 5.0 / MASVS 2.1), données personnelles (socle
  RGPD), authentification, paiements, accessibilité (WCAG 2.2 AA), copyright et licences, design,
  performance, structure, e-mails, IA.
- **Légal** : matrice d'obligations, 15 fiches pays/zones vérifiées au 2026-11-11, modèles de pages
  légales et de documents internes.
- **Catalogue** : skills et plugins vérifiés (avec liste de ceux qui n'existent pas), outils de
  sécurité, connexions et paiements avec prix approximatifs, services, technologies.
- **Verrous** :
  - hooks Claude Code (écriture, commandes, début de session, fin de tour) ;
  - pre-commit git ;
  - GitHub Actions (Gitleaks, Semgrep, OSV-Scanner, audit, conformité, ZAP), avec des actions
    figées par SHA ;
  - empreintes d'intégrité de la méthode.
- **Kit** : module d'accessibilité unique (web et mobile), bandeau cookies conforme CNIL, pages
  légales, en-têtes de sécurité, socle Supabase avec RLS.
