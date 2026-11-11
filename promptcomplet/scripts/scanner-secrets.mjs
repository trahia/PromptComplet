#!/usr/bin/env node
// PromptComplet — recherche de secrets.
//   --staged : fichiers indexés pour le prochain commit (utilisé par .githooks/pre-commit)
//   (défaut) : tous les fichiers suivis par git
// Code de sortie : 1 si un secret bloquant est trouvé.

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { racineProjet, estFichierSecret } from './lib/chemins.mjs';
import { scannerTexte } from './lib/secrets.mjs';

const racine = racineProjet();
const indexes = process.argv.includes('--staged');
const LIMITE = 2_000_000;
const IGNORES = /(^|\/)(package-lock\.json|pnpm-lock\.yaml|yarn\.lock|bun\.lockb?)$/;

function git(args, encoding = 'utf8') {
  return spawnSync('git', args, { cwd: racine, encoding, maxBuffer: 64 * 1024 * 1024 });
}

const liste = indexes
  ? git(['diff', '--cached', '--name-only', '--diff-filter=ACMR', '-z'])
  : git(['ls-files', '-z']);
if (liste.status !== 0) {
  console.error('PromptComplet : impossible de lister les fichiers git (est-ce un dépôt git ?).');
  process.exit(indexes ? 1 : 0);
}
const fichiers = liste.stdout.split('\0').filter(Boolean);

function lire(f) {
  if (indexes) {
    const r = git(['show', `:${f}`], 'buffer');
    return r.status === 0 ? r.stdout : null;
  }
  try {
    return fs.readFileSync(path.join(racine, f));
  } catch {
    return null;
  }
}

const bloquants = [];
const avertissements = [];
for (const f of fichiers) {
  if (estFichierSecret(f)) {
    bloquants.push(`${f} : fichier de secrets — il ne doit jamais être versionné (retire-le : git rm --cached "${f}").`);
    continue;
  }
  if (IGNORES.test(f)) continue;
  const contenu = lire(f);
  if (!contenu || contenu.length > LIMITE) continue;
  for (const s of scannerTexte(contenu.toString('utf8'))) {
    const ligne = `${f}:${s.ligne} : ${s.nom} (${s.extrait})`;
    (s.bloquant ? bloquants : avertissements).push(ligne);
  }
}

for (const a of avertissements) console.log(`⚠ ${a}`);
if (bloquants.length) {
  console.error('⛔ PromptComplet — secret(s) détecté(s) :');
  for (const b of bloquants) console.error(`  ✖ ${b}`);
  console.error('Retire le secret du code, utilise une variable d’environnement (.env, jamais versionné), puis fais RENOUVELER la clé si elle a pu être exposée.');
  process.exit(1);
}
console.log(`✔ PromptComplet — aucun secret détecté (${fichiers.length} fichier(s) analysé(s)).`);
