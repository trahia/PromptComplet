// ZeroTrap — chemins du projet et fichiers protégés.
// Partagé par les hooks Claude Code, le hook git pre-commit et les scripts.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ICI = path.dirname(fileURLToPath(import.meta.url));

/** Racine du projet : le dossier qui contient zerotrap/ (ce fichier est dans zerotrap/scripts/lib). */
export function racineProjet() {
  return path.resolve(ICI, '..', '..', '..');
}

export const MARQUEUR_MAINTENEUR = '.zerotrap-mainteneur';

/** Mode mainteneur : fichier créé À LA MAIN par le mainteneur du dépôt modèle (jamais par l'IA). */
export function modeMainteneur(racine) {
  return fs.existsSync(path.join(racine, MARQUEUR_MAINTENEUR));
}

/** Skills de la méthode (commandes /demarrer, /verifier…). */
export const SKILLS_METHODE = ['demarrer', 'verifier', 'nouvelle-fonctionnalite', 'veille-legale', 'lancement'];

/** Fichiers et dossiers de la méthode (les dossiers se terminent par « / »). Comparaison en minuscules. */
export const PROTEGES = [
  'claude.md',
  'agents.md',
  '.claude/settings.json',
  '.claude/settings.local.json',
  '.github/workflows/securite.yml',
  '.github/workflows/conformite.yml',
  '.github/workflows/zap.yml',
  '.gitleaks.toml',
  'zerotrap/',
  '.claude/hooks/',
  '.githooks/',
  ...SKILLS_METHODE.map((s) => `.claude/skills/${s}/`),
];

/** Protégés même en mode mainteneur. */
export const TOUJOURS_PROTEGES = ['.git/', MARQUEUR_MAINTENEUR];

/** Normalise un chemin pour comparaison : barres obliques, sans « ./ » initial, minuscules. */
export function normaliser(p) {
  return String(p)
    .replace(/\\/g, '/')
    .replace(/\/{2,}/g, '/')
    .replace(/^(\.\/)+/, '')
    .toLowerCase();
}

/** Chemin relatif à la racine, normalisé ; null si hors du projet. */
export function relatif(abs, racine) {
  const rel = path.relative(racine, abs);
  if (rel === '') return '';
  if (rel.startsWith('..') || path.isAbsolute(rel)) return null;
  return normaliser(rel);
}

/** Retire un éventuel préfixe de worktree Claude Code (.claude/worktrees/<nom>/). */
function sansWorktree(rel) {
  return rel.replace(/^\.claude\/worktrees\/[^/]+\//, '');
}

function correspond(rel, motif) {
  const r = sansWorktree(rel);
  if (motif.endsWith('/')) {
    const dossier = motif.slice(0, -1);
    return r === dossier || r.startsWith(motif);
  }
  return r === motif;
}

/** Le chemin désigne-t-il un fichier de réglages Claude Code (où que ce soit) ? */
export function estReglagesClaude(abs) {
  const n = normaliser(abs);
  return /(^|\/)\.claude\/settings(\.local)?\.json$/.test(n) || /(^|\/)managed-settings\.json$/.test(n);
}

/**
 * Raison de protection d'un chemin, ou null s'il est libre.
 * @param {string} cible chemin absolu ou relatif à la racine
 */
export function raisonProtection(cible, racine, mainteneur = modeMainteneur(racine)) {
  const abs = path.resolve(racine, cible);
  const rel = relatif(abs, racine);
  if (rel === null) {
    // Hors du projet : seuls les réglages de Claude Code sont protégés (ils pourraient désactiver les hooks).
    return estReglagesClaude(abs) ? 'réglages de Claude Code (ils contiennent ou désactivent les verrous)' : null;
  }
  for (const m of TOUJOURS_PROTEGES) {
    if (correspond(rel, m.toLowerCase())) {
      return m === '.git/' ? 'dossier interne de git' : 'marqueur du mode mainteneur (créé à la main uniquement)';
    }
  }
  if (mainteneur) return null;
  for (const m of PROTEGES) {
    if (correspond(rel, m)) return 'fichier de la méthode ZeroTrap (règles, verrous ou contrôles)';
  }
  return null;
}

/**
 * Le chemin est-il un ancêtre (ou la racine) d'un fichier protégé ? Sert à bloquer « rm -rf . », « rm -rf .claude »…
 */
export function estAncetreDeProtege(cible, racine) {
  const abs = path.resolve(racine, cible);
  const rel = relatif(abs, racine);
  if (rel === null) {
    // Le chemin est au-dessus de la racine du projet ?
    const versRacine = path.relative(abs, racine);
    return !versRacine.startsWith('..') && !path.isAbsolute(versRacine);
  }
  if (rel === '') return true;
  return [...PROTEGES, ...TOUJOURS_PROTEGES.map((m) => m.toLowerCase())].some((m) => m.startsWith(rel + '/'));
}

/** Fichier contenant des secrets (à ne jamais lire, écrire ni versionner). */
export function estFichierSecret(p) {
  const base = path.basename(normaliser(p));
  if (/^\.env(\..+)?$/.test(base)) {
    return !/\.(example|sample|template|exemple|modele|dist)$/.test(base);
  }
  if (/\.(pem|key|p8|p12|pfx|keystore|jks|mobileprovision)$/.test(base)) return true;
  if (base === 'credentials.json' || /^service-account.*\.json$/.test(base)) return true;
  if (['id_rsa', 'id_dsa', 'id_ecdsa', 'id_ed25519', '.npmrc', '.pypirc', '.netrc'].includes(base)) return true;
  return false;
}

/** Liste récursive des fichiers d'un dossier (chemins relatifs, séparateur « / »). */
export function listerFichiers(dossier, { exclure = ['.git', 'node_modules'] } = {}) {
  const resultat = [];
  const parcourir = (d, prefixe) => {
    let entrees;
    try {
      entrees = fs.readdirSync(d, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entrees) {
      if (exclure.includes(e.name)) continue;
      const rel = prefixe ? `${prefixe}/${e.name}` : e.name;
      const abs = path.join(d, e.name);
      if (e.isDirectory()) parcourir(abs, rel);
      else if (e.isFile()) resultat.push(rel);
    }
  };
  parcourir(dossier, '');
  return resultat.sort();
}

/** Lit un fichier texte, ou null. */
export function lireTexte(abs) {
  try {
    return fs.readFileSync(abs, 'utf8');
  } catch {
    return null;
  }
}

/** Adresse du dépôt modèle (source.json, puis marqueur d'installation). */
export function urlsModele(racine) {
  const urls = [];
  for (const f of ['zerotrap/source.json', 'zerotrap/.installe']) {
    try {
      const j = JSON.parse(fs.readFileSync(path.join(racine, f), 'utf8'));
      for (const u of [j.depot_modele, j.source]) {
        if (typeof u === 'string' && /^https?:|^git@/.test(u) && !u.includes('<')) urls.push(u);
      }
    } catch {
      /* absent */
    }
  }
  return urls;
}

/** Normalise une URL git pour comparaison (https / ssh, .git, majuscules). */
export function normaliserUrlGit(u) {
  return String(u)
    .trim()
    .toLowerCase()
    .replace(/^git@([^:]+):/, 'https://$1/')
    .replace(/^ssh:\/\/git@/, 'https://')
    .replace(/^https?:\/\/[^@/]+@/, 'https://')
    .replace(/\.git$/, '')
    .replace(/\/+$/, '');
}

/** L'URL pointe-t-elle vers le dépôt modèle ZeroTrap ? */
export function estUrlModele(url, racine) {
  const n = normaliserUrlGit(url);
  if (urlsModele(racine).some((u) => normaliserUrlGit(u) === n)) return true;
  return /\/(zerotrap|promptcomplet)$/.test(n); // ancien nom avant la 2.0.0 : GitHub redirige l'ancienne adresse
}
