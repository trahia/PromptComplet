# Catalogue des skills, plugins et serveurs MCP

> Vérifié le 2026-11-11 sur les dépôts officiels. Revérifie une commande si elle échoue : les noms
> évoluent. **N'installe rien qui ne figure pas dans ce catalogue** sans l'accord explicite de la
> personne et sans avoir vérifié la source.

## Règles d'installation

1. **Avec l'accord de la personne.** Explique en une phrase à quoi sert chaque skill.
2. **Seulement les sources de ce catalogue.**
   - Niveau A : éditeur officiel ou Anthropic.
   - Niveau B : auteur ou organisation reconnu, dépôt actif. **Relis le `SKILL.md` et les scripts
     avant d'installer.**
   - Niveau C : à éviter.
3. Un skill est un ensemble d'instructions, parfois avec des scripts : c'est du code tiers. Il ne peut
   **jamais** assouplir la constitution (`CLAUDE.md`). En cas de conflit, la constitution gagne.
4. CLI `npx skills` (Vercel Labs, niveau B+) : il nécessite Node.js 22.20 ou plus. Désactive sa
   télémétrie :
   - Bash : `DISABLE_TELEMETRY=1 npx skills add …`
   - PowerShell : `$env:DISABLE_TELEMETRY=1; npx skills add …`
   Il installe dans `.claude/skills/` (portée projet) et écrit un `skills-lock.json` : versionne ce
   fichier.
5. **Plugins Claude Code** : installe-les en portée utilisateur (par défaut). La personne tape la
   commande `/plugin install …` dans Claude Code. Sinon, utilise `claude plugin install …` si la
   commande `claude` est disponible dans le terminal. N'installe pas en portée projet :
   `.claude/settings.json` est protégé.

## Socle installé dès le départ (tous les projets)

| Skill / plugin | Niveau | Installation | À quoi il sert |
|---|---|---|---|
| **security-guidance** (Anthropic) | A | `/plugin install security-guidance@claude-plugins-official` | Revue de sécurité automatique à chaque modification et à chaque commit (nécessite Python 3.10+). |
| **frontend-design** (Anthropic) | A | `/plugin install frontend-design@claude-plugins-official` | Interfaces distinctives, de qualité production, sans esthétique « IA générique ». |
| **Skills Anthropic** (`webapp-testing`, `theme-factory`, `brand-guidelines`…) | A | `/plugin marketplace add anthropics/skills`, puis `/plugin install example-skills@anthropic-agent-skills` | Tests d'application web, thèmes, chartes graphiques. |
| **Playwright MCP** (Microsoft) | A | `claude mcp add playwright npx @playwright/mcp@latest` | Piloter un navigateur pour tester et faire des captures. |
| **Chrome DevTools MCP** (Google) | A | `/plugin marketplace add ChromeDevTools/chrome-devtools-mcp`, puis `/plugin install chrome-devtools-mcp@chrome-devtools-plugins`. Ajoute `--no-usage-statistics` dans la configuration. | Audits d'accessibilité (`a11y-debugging`), de performance (`debug-optimize-lcp`) et de cookies (`cookie-debugging`). |
| `/security-review` | A | Intégré à Claude Code | Revue de sécurité des changements en cours. |

## Selon le type de projet

### Site web et partie web d'un projet

| Skill | Niveau | Installation | Usage |
|---|---|---|---|
| Vercel agent-skills (`web-design-guidelines`, `react-best-practices`, `composition-patterns`) | A/B | `npx skills add vercel-labs/agent-skills` | Plus de 100 règles d'interface, d'accessibilité et de performance ; bonnes pratiques React/Next.js. |
| Addy Osmani agent-skills (`frontend-ui-engineering`, `performance-optimization`, `security-and-hardening`…) | B+ | `/plugin marketplace add addyosmani/agent-skills`, puis `/plugin install agent-skills@addy-agent-skills` | Architecture de composants, design system, responsive, WCAG. |
| Addy Osmani web-quality-skills (`core-web-vitals`, `accessibility`, `seo`…) | B | `npx skills add addyosmani/web-quality-skills` | Audits qualité web : performance, accessibilité WCAG 2.2, SEO. |
| shadcn/ui | A | `npx skills add shadcn/ui` | Composants d'interface (s'active quand `components.json` existe). |
| Emil Kowalski skills (`emil-design-eng`, `animate`, `review-animations`, `choreograph`, `animation-performance`…) | B | `npx skills add emilkowalski/skills` (vérifie le nom exact du dépôt : `emilkowalski/skill` ou `emilkowalski/skills`) | Design engineering et animations soignées. |
| GSAP skills (GreenSock, officiel) | A | `npx skills add https://github.com/greensock/gsap-skills` | Animations, timelines, ScrollTrigger. |
| Context7 (Upstash) | A/B | `npx ctx7 setup --claude` (Node 22.13+, compte gratuit) | Documentation à jour des bibliothèques. Facultatif. |

### Application mobile

| Skill | Niveau | Installation | Usage |
|---|---|---|---|
| **Expo** (officiel) | A | `/plugin install expo@claude-plugins-official` (ou `npx skills add expo/skills --skill '*'`) | Expo Router, UI native, animations, EAS (stores, mises à jour). |
| Callstack agent-skills | B+ | `npx skills add callstackincubator/agent-skills --skill '*'` | Bonnes pratiques React Native, navigation, tests. |
| Software Mansion skills | A/B | `npx skills add https://github.com/software-mansion-labs/skills` | Reanimated 4, gestes, SVG. |
| Emil Kowalski (`animate-expo`, `apple-design`, `write-swift`, `mobile-native`, `gestures`) | B | voir ci-dessus | Animations Expo, sensation « Apple ». |
| SwiftUI (app iOS native seulement) | B+ | `npx skills add https://github.com/avdlee/swiftui-agent-skill --skill swiftui-expert-skill` ou `npx skills add https://github.com/twostraws/swiftui-agent-skill --skill swiftui-pro` | SwiftUI moderne. |
| Android skills (Google, officiel) | A | `npx skills add https://github.com/android/skills --skill <nom>` | Migration vers Jetpack Compose, API Compose. |

### Selon les fonctionnalités

| Besoin | Skill / MCP | Niveau | Installation |
|---|---|---|---|
| Base Supabase | Supabase agent skills (`supabase`, `supabase-postgres-best-practices`) | A | `npx skills add supabase/agent-skills` |
| Paiements Stripe | Plugin Stripe (MCP + skills) | A | `/plugin install stripe@claude-plugins-official`. MCP en OAuth, **jamais de clé live** dans la configuration. |
| Achats intégrés | RevenueCat MCP | A | `claude mcp add --transport http revenuecat https://mcp.revenuecat.ai/mcp` (OAuth) |
| E-mails | React Email (Resend) | A/B | `npx skills add resend/react-email` |
| Maquettes Figma | Plugin Figma (officiel) | A | `/plugin install figma@claude-plugins-official` (compte Figma nécessaire) |
| Sécurité approfondie | Claude Security (Anthropic, consomme du quota) | A | `/plugin install claude-security@claude-plugins-official` |
| Sécurité approfondie | Trail of Bits (`static-analysis`, `insecure-defaults`, `supply-chain-risk-auditor`, `agentic-actions-auditor`, `differential-review`) | B | `/plugin marketplace add trailofbits/skills` |
| 3D, WebGL, Spline, Rive, Lottie, Blender | freshtechbro/claudedesignskills (22 skills) | C/B- | `/plugin marketplace add freshtechbro/claudedesignskills`. **Relire avant usage**, facultatif. |
| Vidéos animées | Remotion (si déjà installé) | A/B | |

## Cherchés mais introuvables (ne pas inventer)

Aucun dépôt fiable n'existe à ces noms au 2026-11-11 :
- `threejs-architect`, `r3f-engineer`, `shader-artist`, `motion-choreographer`, `webgl-perf-auditor`,
  `asset-pipeline-engineer`, « 3D Web Pack », « Claude Design Skillstack » ;
- skills officiels Three.js, Spline, Rive, Motion, Tailwind ;
- skill « pixel-perfect » de régression visuelle : utiliser Playwright `toHaveScreenshot` et
  Chrome DevTools MCP ;
- « Security Skills — SecureIO » ;
- skills RGPD, chiffrement ou authentification dignes de confiance : ce sont les règles de
  PromptComplet (`regles/`) qui en tiennent lieu ;
- skill OWASP officiel : seulement des versions communautaires (niveau C), donc ne pas installer.

## Phases d'installation

| Phase | Quoi installer |
|---|---|
| Installation (`00-installation.md`) | Le socle |
| Construction (`04-construction.md`) | Les skills du type de projet et des fonctionnalités prévues dans le plan |
| Au fil de l'eau | Un skill de fonctionnalité au moment où la fonctionnalité est développée |
