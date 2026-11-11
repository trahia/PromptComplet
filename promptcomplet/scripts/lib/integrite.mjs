// PromptComplet — empreintes des fichiers de la méthode, pour détecter toute modification.

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { listerFichiers, SKILLS_METHODE } from './chemins.mjs';

export const FICHIER_INTEGRITE = 'promptcomplet/integrite.json';

const FICHIERS_RACINE = [
  'CLAUDE.md',
  'AGENTS.md',
  '.claude/settings.json',
  '.github/workflows/securite.yml',
  '.github/workflows/conformite.yml',
  '.github/workflows/zap.yml',
  '.gitleaks.toml',
];
const DOSSIERS = ['promptcomplet', '.claude/hooks', '.githooks', ...SKILLS_METHODE.map((s) => `.claude/skills/${s}`)];
const EXCLUS = new Set([FICHIER_INTEGRITE, 'promptcomplet/.installe']);

/** Liste des fichiers de la méthode présents (chemins relatifs « / »). */
export function listerFichiersMethode(racine) {
  const liste = new Set();
  for (const f of FICHIERS_RACINE) if (fs.existsSync(path.join(racine, f))) liste.add(f);
  for (const d of DOSSIERS) {
    const abs = path.join(racine, d);
    if (!fs.existsSync(abs)) continue;
    for (const f of listerFichiers(abs)) liste.add(`${d}/${f}`);
  }
  return [...liste].filter((f) => !EXCLUS.has(f)).sort();
}

/** Empreinte SHA-256, fins de ligne normalisées (identique sous Windows, Mac et Linux). */
export function empreinte(abs) {
  const contenu = fs.readFileSync(abs);
  const texte = contenu.includes(0) ? contenu : Buffer.from(contenu.toString('utf8').replace(/\r\n/g, '\n'), 'utf8');
  return crypto.createHash('sha256').update(texte).digest('hex');
}

export function calculerEmpreintes(racine) {
  const fichiers = {};
  for (const f of listerFichiersMethode(racine)) fichiers[f] = empreinte(path.join(racine, f));
  return fichiers;
}

/** Compare les fichiers actuels aux empreintes enregistrées. */
export function verifierIntegrite(racine) {
  const chemin = path.join(racine, FICHIER_INTEGRITE);
  if (!fs.existsSync(chemin)) return { absent: true, modifies: [], manquants: [], ajoutes: [] };
  let attendu;
  try {
    attendu = JSON.parse(fs.readFileSync(chemin, 'utf8')).fichiers || {};
  } catch {
    return { illisible: true, modifies: [], manquants: [], ajoutes: [] };
  }
  const actuel = calculerEmpreintes(racine);
  const modifies = [];
  const manquants = [];
  for (const [f, h] of Object.entries(attendu)) {
    if (!(f in actuel)) manquants.push(f);
    else if (actuel[f] !== h) modifies.push(f);
  }
  const ajoutes = Object.keys(actuel).filter((f) => !(f in attendu));
  return { modifies, manquants, ajoutes };
}
