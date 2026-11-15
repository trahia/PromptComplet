#!/usr/bin/env node
// ZeroTrap — analyse du code dangereux (injection SQL, XSS, injection de commande, TLS désactivé,
// redirection ouverte…). LECTURE SEULE : ce script ne modifie, n'installe et n'écrit rien.
//
// Usage :
//   node zerotrap/scripts/analyser-code.mjs              (analyse le dossier courant)
//   node <clone>/zerotrap/scripts/analyser-code.mjs <dossier du projet>   (audit, methode/09)
//
// Code de sortie : 0 = rien trouvé, 1 = code dangereux trouvé, 2 = erreur.

import fs from 'node:fs';
import path from 'node:path';
import { analyserDossier, REGLES_CODE } from './lib/code-dangereux.mjs';

const dossier = path.resolve(process.argv[2] || process.cwd());
if (!fs.existsSync(dossier) || !fs.statSync(dossier).isDirectory()) {
  console.error(`⛔ Dossier introuvable : ${dossier}`);
  process.exit(2);
}

const resultats = analyserDossier(dossier);
const problemes = resultats.flatMap((r) => r.problemes.map((p) => ({ fichier: r.fichier, ...p })));
const exceptions = resultats.flatMap((r) => r.exceptions.map((x) => ({ fichier: r.fichier, ...x })));

console.log(`ZeroTrap — analyse du code dangereux (${REGLES_CODE.length} règles, lecture seule)`);
console.log(`Dossier : ${dossier}\n`);

if (problemes.length) {
  console.log(`⛔ ${problemes.length} passage(s) de code dangereux :\n`);
  for (const p of problemes) {
    console.log(`- ${p.fichier}:${p.ligne} — ${p.titre}`);
    console.log(`    ${p.extrait}`);
    console.log(`    → ${p.conseil}`);
  }
  console.log('');
}
if (exceptions.length) {
  console.log(`⚠ ${exceptions.length} exception(s) déclarée(s), à faire relire par un humain :\n`);
  for (const x of exceptions) console.log(`- ${x.fichier}:${x.ligne} — ${x.titre} : « ${x.raison} »`);
  console.log('');
}
if (!problemes.length && !exceptions.length) console.log('✔ Aucun motif de code dangereux trouvé.');

console.log(`Limite : cette analyse repère les erreurs les plus fréquentes, ligne par ligne. Elle ne remplace ni
Semgrep, ni les tests d'attaque, ni un test d'intrusion par un professionnel.`);
process.exit(problemes.length ? 1 : 0);
