# Structure — Projet « Entreprise »

Objectif : aider la personne à créer ou structurer son activité. Ce n'est **pas** un conseil
juridique, fiscal ou comptable : recommande toujours un expert-comptable ou un avocat pour les choix
importants.

```
mon-projet/
├── CLAUDE.md · AGENTS.md · zerotrap/ · .claude/ · .githooks/ · .github/   ← méthode (protégé)
├── projet/
│   └── entreprise/
│       ├── statut-juridique.md      ← comparatif adapté au pays et à la situation de la personne
│       ├── demarches.md             ← checklist de création, avec les liens officiels
│       ├── budget-previsionnel.md   ← dépenses, recettes, seuil de rentabilité (simple)
│       ├── outils.md                ← banque, facturation, comptabilité, e-mail pro, stockage
│       └── conformite.md            ← obligations courantes (RGPD, assurance, facturation…)
├── legal/<langue>/                  ← pages légales du site
└── site/                            ← site vitrine (voir structures/site-web.md, version Astro)
```

## Checklist type (France, à adapter au pays et à revérifier pendant la veille légale)

- [ ] Choisir le statut (micro-entreprise, EI, EURL/SASU, SARL/SAS, association) selon l'activité, le
      chiffre d'affaires prévu, la protection sociale souhaitée et les associés.
- [ ] Formalités sur le guichet unique : https://formalites.entreprise.gouv.fr
- [ ] Vérifier que le nom est disponible (INPI) et le **déposer comme marque** si besoin.
- [ ] Compte bancaire professionnel (obligatoire pour les sociétés ; compte dédié pour les
      micro-entrepreneurs au-delà d'un seuil).
- [ ] Assurance responsabilité civile professionnelle (obligatoire pour certaines activités).
- [ ] Régime de TVA (franchise en base ou non), facturation conforme, calendrier de la facturation
      électronique.
- [ ] Outil de facturation et de comptabilité. Expert-comptable recommandé pour les sociétés.
- [ ] Nom de domaine et e-mail professionnel (SPF/DKIM/DMARC, voir règle 10).
- [ ] RGPD : registre des traitements, politique de confidentialité, sécurité des fichiers clients.
- [ ] Site vitrine conforme (mentions légales, confidentialité, cookies, accessibilité).
- [ ] CGV si vente, médiateur de la consommation si clients particuliers.

Pour un autre pays : même structure. Les démarches viennent des sites officiels du pays (méthode de
`legal/pays/autres-pays.md`).
