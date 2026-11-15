#!/usr/bin/env node
// ZeroTrap — génère zerotrap/integrite.json (empreintes des fichiers de la méthode).
// Réservé au MAINTENEUR du dépôt modèle, avant chaque publication d'une nouvelle version.

import fs from 'node:fs';
import path from 'node:path';
import { racineProjet, modeMainteneur } from './lib/chemins.mjs';
import { calculerEmpreintes, FICHIER_INTEGRITE } from './lib/integrite.mjs';

const racine = racineProjet();
const installe = fs.existsSync(path.join(racine, 'zerotrap', '.installe'));
if (installe && !modeMainteneur(racine)) {
  console.error('⛔ Ce script est réservé au mainteneur du dépôt modèle ZeroTrap. Dans un projet, les empreintes viennent de la méthode installée.');
  process.exit(1);
}
const version = (fs.readFileSync(path.join(racine, 'zerotrap', 'VERSION'), 'utf8') || '').trim();
const fichiers = calculerEmpreintes(racine);
const contenu = { version, genere_le: new Date().toISOString().slice(0, 10), algorithme: 'sha256 (fins de ligne normalisées en LF)', fichiers };
fs.writeFileSync(path.join(racine, FICHIER_INTEGRITE), `${JSON.stringify(contenu, null, 2)}\n`, 'utf8');
console.log(`✔ ${FICHIER_INTEGRITE} : ${Object.keys(fichiers).length} fichiers (version ${version}).`);
