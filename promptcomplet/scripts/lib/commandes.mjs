// PromptComplet — analyse des commandes shell lancées par l'IA (Bash ou PowerShell).
// Renvoie un message de blocage, ou null si la commande est autorisée.
// Ce contrôle est une barrière de plus, pas une garantie absolue : la CI et le pre-commit restent les filets finaux.

import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { raisonProtection, estAncetreDeProtege, estFichierSecret, normaliser, estUrlModele, MARQUEUR_MAINTENEUR } from './chemins.mjs';
import { scannerTexte } from './secrets.mjs';

const VERBES_SUPPRESSION = new Set(['rm', 'del', 'erase', 'rmdir', 'rd', 'remove-item', 'ri', 'unlink', 'shred']);
const VERBES_DEPLACEMENT = new Set(['mv', 'move', 'move-item', 'mi', 'rename-item', 'ren', 'rni']);
const VERBES_COPIE = new Set(['cp', 'copy', 'copy-item', 'cpi', 'xcopy', 'robocopy', 'ln', 'mklink']);
const VERBES_ECRITURE = new Set(['tee', 'truncate', 'chmod', 'chown', 'attrib', 'set-content', 'sc', 'add-content', 'ac', 'out-file', 'clear-content', 'clc', 'new-item', 'ni', 'touch', 'dd', 'icacls', 'takeown']);
const VERBES_EDITION = new Set(['sed', 'perl']);
const INTERPRETEURS = new Set(['node', 'python', 'python3', 'py', 'deno', 'bun', 'ruby', 'perl', 'php', 'powershell', 'pwsh', 'bash', 'sh', 'zsh', 'cmd', 'cmd.exe']);
const OPTIONS_CODE = new Set(['-e', '--eval', '-c', '-p', '--print', '-r', '-command', '-c', '/c', '/k', '-encodedcommand', '-enc', '-ec']);
const PREFIXES = new Set(['sudo', 'command', 'exec', 'time', 'nohup', '&', 'env', 'call', 'start']);
const LECTURE_AUTORISEE = new Set(['ls', 'dir', 'test', 'test-path', '[', 'stat']);

/** Découpe une commande en segments (séparateurs ; && || | et retours à la ligne). */
function segments(commande) {
  return commande.split(/\r?\n|&&|\|\||;|\|/).map((s) => s.trim()).filter(Boolean);
}

/** Découpe un segment en mots (guillemets retirés). */
function mots(segment) {
  const out = [];
  const re = /"((?:[^"\\]|\\.)*)"|'([^']*)'|(\S+)/g;
  let m;
  while ((m = re.exec(segment)) !== null) out.push(m[1] ?? m[2] ?? m[3]);
  return out;
}

function sansPrefixes(liste) {
  let i = 0;
  while (i < liste.length && (PREFIXES.has(liste[i].toLowerCase()) || /^[A-Za-z_][A-Za-z0-9_]*=/.test(liste[i]))) i++;
  return liste.slice(i);
}

function nomCommande(mot) {
  return path.basename(String(mot).replace(/\\/g, '/')).toLowerCase().replace(/\.exe$/, '');
}

function message(titre, detail) {
  return `⛔ PromptComplet — ${titre}\n${detail}\nSi c'est vraiment nécessaire, explique à la personne ce que tu voulais faire : c'est à elle de le faire elle-même, en connaissance de cause.`;
}

/**
 * @param {string} commande
 * @param {{racine:string, cwd?:string, mainteneur?:boolean}} ctx
 * @returns {string|null}
 */
export function analyserCommande(commande, ctx) {
  const { racine, mainteneur = false } = ctx;
  const cwd = ctx.cwd || racine;
  if (typeof commande !== 'string' || !commande.trim()) return null;
  const bas = commande.toLowerCase();
  const resoudre = (p) => path.resolve(cwd, String(p).replace(/^~(?=\/|\\|$)/, process.env.HOME || process.env.USERPROFILE || '~'));
  const protege = (p) => raisonProtection(resoudre(p), racine, mainteneur);

  // 1. Contournements des contrôles
  if (/--no-verify\b/.test(bas)) return message('contournement interdit', "L'option --no-verify désactive les contrôles avant commit/push. Corrige plutôt le problème signalé.");
  if (/\bgit\b[^\n;&|]*\bcommit\b[^\n;&|]*\s-[a-z]*n[a-z]*(\s|$)/.test(bas) && !/\s--no-edit\b/.test(bas)) {
    return message('contournement interdit', "« git commit -n » désactive les contrôles avant commit. Corrige plutôt le problème signalé.");
  }
  if (/disableallhooks/.test(bas) || /allowmanagedhooksonly/.test(bas)) return message('verrous', 'Les hooks PromptComplet ne peuvent pas être désactivés par l’IA.');
  if (/core\.hookspath/.test(bas) && !/core\.hookspath\s+\.githooks\s*($|[;&|])/.test(bas)) {
    return message('verrous', 'Le contrôle avant commit doit rester sur .githooks (git config core.hooksPath .githooks).');
  }
  if (bas.includes(MARQUEUR_MAINTENEUR)) return message('mode mainteneur', 'Ce marqueur ne peut être créé ou supprimé qu’à la main par le mainteneur.');
  if (!mainteneur && /generer-integrite/.test(bas)) return message('intégrité', 'Les empreintes de la méthode ne sont régénérées que par le mainteneur.');

  // 2. Exécution de scripts téléchargés
  if (/\b(curl|wget|iwr|irm|invoke-webrequest|invoke-restmethod)\b[^|\n]*\|\s*(sudo\s+)?(sh|bash|zsh|dash|iex|invoke-expression|python3?|node|pwsh|powershell)\b/.test(bas)
    || /\b(iex|invoke-expression)\b[\s\S]*\b(irm|iwr|invoke-restmethod|invoke-webrequest|downloadstring)\b/.test(bas)) {
    return message('script téléchargé', "Exécuter directement un script téléchargé (curl … | sh, iex (irm …)) est interdit (règle 01). Installe l'outil avec un gestionnaire de paquets officiel (npm, winget, brew) ou demande à la personne.");
  }

  // 3. Secrets en clair dans la commande
  const secrets = scannerTexte(commande).filter((s) => s.bloquant);
  if (secrets.length) return message('secret dans une commande', `Secret détecté (${secrets.map((s) => s.nom).join(', ')}). Ne mets jamais de secret dans une commande : il resterait dans l'historique. Utilise une variable d'environnement lue depuis .env.`);

  // 4. Affichage de variables d'environnement sensibles
  if (/(^|[;&|\n])\s*(printenv|env|set|export\s+-p)\s*($|[;&|\n])/.test(bas)
    || /\b(get-childitem|gci|dir|ls|get-item)\s+env:/.test(bas)
    || /\[environment\]::getenvironmentvariables/.test(bas)
    || /\b(echo|printf|write-output|write-host|print|cat)\b[^;&|\n]*\$(env:)?\{?[a-z0-9_]*(secret|token|password|passwd|private|api_?key|service_?role)[a-z0-9_]*/.test(bas)) {
    return message('secrets', "Afficher les variables d'environnement révélerait des secrets. Vérifie seulement leur présence (ex. node -e \"console.log(!!process.env.NOM)\").");
  }

  // 5. Git : force push, historique, dépôt modèle, ajout forcé
  if (/\bgit\s+push\b/.test(bas)) {
    if (/\s(--force|-f|--force-with-lease|--mirror)\b/.test(bas) || /\bgit\s+push\b[^\n;&|]*\s\+\S+/.test(bas)) {
      return message('git push forcé', "Un push forcé peut effacer l'historique. C'est à la personne de le faire elle-même si c'est vraiment nécessaire.");
    }
    if (!mainteneur) {
      const m = mots(commande.slice(bas.indexOf('git push')));
      const remote = m.slice(2).find((x) => !x.startsWith('-')) || 'origin';
      const url = spawnSync('git', ['remote', 'get-url', remote], { cwd, encoding: 'utf8' });
      const cible = url.status === 0 ? url.stdout.trim() : /^(https?:|git@)/.test(remote) ? remote : '';
      if (cible && estUrlModele(cible, racine)) {
        return message('dépôt modèle', `« ${remote} » pointe vers le dépôt modèle PromptComplet. Le projet de la personne ne doit JAMAIS y être envoyé. Crée son propre dépôt privé (gh repo create <nom> --private).`);
      }
    }
  }
  if (!mainteneur && /\bgit\s+remote\s+(add|set-url)\b/.test(bas)) {
    const url = mots(commande).find((x) => /^(https?:\/\/|git@)/i.test(x));
    if (url && estUrlModele(url, racine)) return message('dépôt modèle', 'Le projet de la personne ne doit pas être relié au dépôt modèle PromptComplet.');
  }
  if (/\bgit\s+(filter-branch|filter-repo)\b/.test(bas) || /\bgit\s+reflog\s+expire\b/.test(bas)) {
    return message('historique git', "Réécrire l'historique est une opération risquée : c'est à la personne de la faire, guidée pas à pas.");
  }

  // 6. Base de données de production
  if (/\bsupabase\s+db\s+reset\b[^\n;&|]*--linked/.test(bas) || /\bdrop\s+(database|schema\s+public)\b/.test(bas)) {
    return message('base de données', 'Commande destructrice sur une base de données distante. À faire uniquement par la personne, après sauvegarde.');
  }
  if (/\bchmod\s+(-r\s+)?0?777\b/.test(bas)) return message('permissions', 'chmod 777 donne tous les droits à tout le monde : interdit (règle 01).');

  // 7. Analyse segment par segment
  for (const seg of segments(commande)) {
    const tous = mots(seg);
    const m = sansPrefixes(tous);
    if (!m.length) continue;
    let cmd = nomCommande(m[0]);
    let args = m.slice(1);
    // Outils lancés via npx / pnpm dlx / yarn dlx / bunx (rimraf, shx rm…) : on analyse l'outil lui-même.
    if (['npx', 'pnpx', 'bunx'].includes(cmd) || (['pnpm', 'yarn'].includes(cmd) && args[0] === 'dlx')) {
      const reste = (cmd === 'pnpm' || cmd === 'yarn' ? args.slice(1) : args).filter((x) => !x.startsWith('-'));
      const outil = nomCommande(reste[0] || '');
      if (['rimraf', 'del', 'del-cli', 'trash', 'trash-cli'].includes(outil)) { cmd = 'rm'; args = ['-r', ...reste.slice(1)]; }
      else if (outil === 'shx' && reste[1]) { cmd = nomCommande(reste[1]); args = reste.slice(2); }
    }

    // Redirections vers un fichier protégé ou un fichier de secrets
    const reRedir = /(?:^|[^<>&\d])(?:\d?>{1,2}|&>)\s*("([^"]+)"|'([^']+)'|([^\s;|&]+))/g;
    let r;
    while ((r = reRedir.exec(seg)) !== null) {
      const cible = r[2] || r[3] || r[4];
      if (!cible || /^(&\d|\/dev\/null|\$null|nul)$/i.test(cible)) continue;
      if (protege(cible)) return message('fichier protégé', `Écriture vers « ${cible} » : ${protege(cible)}. Ce fichier ne peut pas être modifié par l'IA.`);
      if (estFichierSecret(cible)) return message('fichier de secrets', `Écriture vers « ${cible} » : l'IA n'écrit pas dans les fichiers de secrets. Mets les noms des variables dans .env.example ; la personne remplit .env elle-même.`);
    }

    // Fichiers de secrets mentionnés
    for (let i = 0; i < args.length; i++) {
      const a = args[i];
      const valeur = a.startsWith('--env-file=') ? null : a;
      if (!valeur || !estFichierSecret(valeur)) continue;
      const precedent = (args[i - 1] || '').toLowerCase();
      if (precedent === '--env-file' || (cmd === 'dotenv' && precedent === '-e')) continue; // chargement, sans affichage
      if (LECTURE_AUTORISEE.has(cmd)) continue;
      if (cmd === 'git' && ['check-ignore', 'status'].includes((args[0] || '').toLowerCase())) continue;
      if (cmd === 'git' && args[0] === 'rm' && args.includes('--cached')) continue;
      if (VERBES_COPIE.has(cmd) && i === args.length - 1 && args.slice(0, -1).some((s) => /\.(example|sample|template|exemple)$/i.test(s))) continue;
      return message('fichier de secrets', `La commande manipule « ${a} ». L'IA ne lit, n'affiche, ne copie ni ne versionne jamais un fichier de secrets (.env, clés…). Vérifie seulement qu'une variable est définie, sans afficher sa valeur.`);
    }

    // git add forcé
    if (cmd === 'git' && (args[0] || '').toLowerCase() === 'add' && args.some((x) => x === '-f' || x === '--force')) {
      return message('git add forcé', '« git add -f » ajouterait des fichiers ignorés (souvent des secrets). Retire -f.');
    }

    // Suppressions / déplacements / écritures de fichiers protégés
    const cheminsArgs = args.filter((x) => !x.startsWith('-') || x === '-');
    const recursif = args.some((x) => /^-[a-z]*r/i.test(x) || /^-recurse$/i.test(x) || x === '/s');
    if (VERBES_SUPPRESSION.has(cmd) || VERBES_DEPLACEMENT.has(cmd) || (cmd === 'git' && ['rm', 'mv'].includes((args[0] || '').toLowerCase()))) {
      const liste = cmd === 'git' ? cheminsArgs.slice(1) : cheminsArgs;
      for (const p of liste) {
        const ancetre = VERBES_SUPPRESSION.has(cmd) || cmd === 'git' ? estAncetreDeProtege(resoudre(p), racine) : false;
        const globRisque = p.includes('*') && estAncetreDeProtege(resoudre(p.slice(0, p.indexOf('*')) || '.'), racine);
        if (protege(p) || ancetre || globRisque) {
          return message('fichier protégé', `« ${seg} » toucherait « ${p} » : ${protege(p) || 'dossier contenant des fichiers de la méthode'}. Interdit pour l'IA.`);
        }
        if (recursif && ['/', '/*', '~', '~/', 'c:/', 'c:\\', 'c:'].includes(normaliser(p))) {
          return message('suppression dangereuse', `Suppression récursive de « ${p} » interdite.`);
        }
      }
    }
    if (VERBES_COPIE.has(cmd) && cheminsArgs.length) {
      const destination = cheminsArgs[cheminsArgs.length - 1];
      if (protege(destination)) return message('fichier protégé', `Copie vers « ${destination} » : ${protege(destination)}.`);
    }
    if (VERBES_ECRITURE.has(cmd)) {
      for (const p of cheminsArgs) if (protege(p)) return message('fichier protégé', `« ${cmd} » sur « ${p} » : ${protege(p)}.`);
    }
    if (VERBES_EDITION.has(cmd) && args.some((x) => /^-[a-z]*i/i.test(x) || x === '--in-place')) {
      for (const p of cheminsArgs) if (protege(p)) return message('fichier protégé', `Modification de « ${p} » : ${protege(p)}.`);
    }

    // Interpréteurs avec du code en ligne qui mentionne un fichier protégé
    if (INTERPRETEURS.has(cmd) && args.some((x) => OPTIONS_CODE.has(x.toLowerCase()))) {
      const code = seg.toLowerCase().replace(/\\/g, '/');
      const cibles = ['claude.md', 'agents.md', 'promptcomplet/', '.claude/settings', '.claude/hooks', '.githooks', '.github/workflows/securite', '.github/workflows/conformite', '.gitleaks.toml'];
      const ecrit = /(write|unlink|rm|remove|rename|append|truncate|copy|set-content|out-file|del |>\s*)/.test(code);
      if (!mainteneur && ecrit && cibles.some((c) => code.includes(c))) {
        return message('fichier protégé', 'Ce code modifierait un fichier de la méthode PromptComplet. Interdit pour l’IA.');
      }
      if (/\.env\b(?!\.(example|sample|template))/.test(code) && /(read|cat|get-content|open\(|readfile)/.test(code)) {
        return message('fichier de secrets', "Ce code lirait un fichier .env. L'IA ne lit jamais les secrets.");
      }
    }
  }
  return null;
}
