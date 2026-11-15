# Outils de sécurité

> Vérifié le 2026-11-11. Les versions évoluent : la CI utilise des versions figées. Dependabot
> propose les mises à jour.

## Ce qui tourne automatiquement

| Où | Outil | Ce qu'il vérifie |
|---|---|---|
| À chaque écriture de fichier par l'IA | hook `garde-ecriture` | secrets, fichiers protégés, `.env` |
| À chaque commande de l'IA | hook `garde-commandes` | lecture de secrets, contournements, commandes dangereuses |
| À chaque commit | `.githooks/pre-commit` | secrets dans les fichiers indexés, conformité rapide |
| À chaque push (GitHub) | `.github/workflows/securite.yml` | Gitleaks, Semgrep, OSV-Scanner, npm audit |
| À chaque push (GitHub) | `.github/workflows/conformite.yml` | script de conformité ZeroTrap |
| Chaque semaine | Dependabot | dépendances et actions GitHub vulnérables ou obsolètes |
| À la demande (préproduction) | `.github/workflows/zap.yml` | scan dynamique OWASP ZAP baseline |

## Les outils

| Outil | Rôle | Remarques |
|---|---|---|
| **Gitleaks** v8.30+ | Secrets dans le code et l'historique | Gratuit pour les comptes personnels. Utilisé en CI via sa propre action. |
| **TruffleHog** v3.99+ | Secrets **vérifiés** (clés encore actives) | En complément, en local : `trufflehog git file://. --only-verified --fail` |
| **Semgrep CE** v1.185+ | Analyse du code (OWASP Top 10, injections, mauvaises configurations) | `semgrep scan --config p/default --config p/owasp-top-ten --config p/secrets --metrics=off --error`. Sans compte. |
| **OSV-Scanner** v2.7+ (Google) | Vulnérabilités connues des dépendances (lockfiles) | `osv-scanner scan -r .` |
| **npm audit / pnpm audit** | Vulnérabilités des dépendances npm | `npm audit --audit-level=high` |
| **Trivy** | Vulnérabilités, secrets, mauvaises configurations (conteneurs, IaC) | ⚠️ **Les actions `aquasecurity/trivy-action` et `setup-trivy` ont été compromises en mars 2026** (tags réécrits, vol de secrets), ainsi que le binaire 0.69.4. Ne jamais utiliser les versions 0.69.4 à 0.69.6. Si Trivy est nécessaire (conteneurs) : image Docker officielle figée **par empreinte (digest)**, jamais par tag. |
| **OWASP ZAP** (action `zaproxy/action-baseline` v0.15+) | Scan dynamique d'une URL de préproduction | Ne jamais scanner un site qui n'appartient pas à la personne. |
| **Plugin security-guidance**, `/security-review` | Revue de sécurité par l'IA | Ne remplace pas les scanners : les complète. |
| **npm sbom** (intégré à npm 10+) | Liste des composants (SBOM) d'un projet npm | `npm sbom --sbom-format cyclonedx --omit dev > projet/sbom.cdx.json` |
| **cdxgen** (OWASP CycloneDX) | SBOM pour pnpm, Gradle, Swift et plusieurs langages | Source : https://github.com/CycloneDX/cdxgen. Version figée, jamais `latest`. |
| **ClamAV** | Antivirus open source pour les fichiers envoyés par les utilisateurs | À faire tourner côté serveur, ou utiliser l'analyse du fournisseur de stockage si elle existe. |
| **Test d'intrusion humain** | Failles de logique que les scanners ne voient pas | France : prestataires qualifiés **PASSI** (liste ANSSI, https://cyber.gouv.fr). Bug bounty : YesWeHack. Voir règle 01, section 12. |

## Règles pour les GitHub Actions

- Actions figées par **SHA de commit complet**, avec la version en commentaire. Le SHA doit venir du
  dépôt officiel de l'action, pas d'un fork.
- `permissions: contents: read` au niveau du workflow. Élargir seulement par job, si nécessaire.
- Jamais de `pull_request_target`.
- **Ne pas utiliser `upload-sarif`** sur un dépôt privé d'un compte gratuit : l'analyse de code GitHub
  y est payante. On affiche les résultats dans le journal et on fait échouer le job.
- Sur un dépôt privé d'un compte gratuit, **la détection de secrets de GitHub n'est pas disponible**.
  D'où l'importance de Gitleaks en pre-commit et en CI.
- Disponibles gratuitement : graphe de dépendances, alertes Dependabot, mises à jour de sécurité
  Dependabot.
- Quota gratuit : environ 2 000 minutes Linux par mois pour les dépôts privés. Garder des jobs courts.

## Référentiels

| Référentiel | Version au 2026-11-11 |
|---|---|
| OWASP ASVS | 5.0.0 (mai 2025) |
| OWASP Top 10 | 2025 |
| OWASP MASVS | 2.1.0 |
| OWASP MASTG | 2.0.0 (juin 2026) |
| OWASP Top 10 for LLM Applications | 2025 (⚠️ vérifier si une édition 2026 est parue) |
| OWASP Top 10 for Agentic Applications | 2026 |
| PCI DSS | 4.0.1 |
