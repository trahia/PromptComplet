#!/usr/bin/env node
// ZeroTrap — vérification de conformité du projet (sécurité, légal, accessibilité, intégrité de la méthode).
//
// Usage :
//   node zerotrap/scripts/verifier-conformite.mjs              vérification normale
//   node zerotrap/scripts/verifier-conformite.mjs --release    mode lancement (strict)
//   node zerotrap/scripts/verifier-conformite.mjs --rapide     sans le scan complet des secrets
//   node zerotrap/scripts/verifier-conformite.mjs --pre-commit sécurité et intégrité seulement
//   node zerotrap/scripts/verifier-conformite.mjs --ci         annotations GitHub Actions
//   node zerotrap/scripts/verifier-conformite.mjs --json       sortie JSON
// Code de sortie : 1 s'il y a au moins une erreur.

import { racineProjet } from './lib/chemins.mjs';
import { verifierConformite, formaterRapport } from './lib/conformite.mjs';

const args = new Set(process.argv.slice(2));
if (args.has('--aide') || args.has('--help')) {
  console.log('Options : --release --rapide --pre-commit --ci --json');
  process.exit(0);
}

const racine = racineProjet();
const r = verifierConformite(racine, {
  release: args.has('--release'),
  rapide: args.has('--rapide'),
  preCommit: args.has('--pre-commit'),
});

if (args.has('--json')) {
  const obligations = r.obligations && {
    pages: r.obligations.pages,
    preuves: r.obligations.preuves.map(({ id, raison }) => ({ id, raison })),
    controles: r.obligations.controles,
  };
  console.log(JSON.stringify({ statut: r.statut, erreurs: r.erreurs, avertissements: r.avertissements, infos: r.infos, obligations }, null, 2));
} else {
  const titre = args.has('--release')
    ? 'ZeroTrap — vérification de conformité (mode lancement, strict)'
    : args.has('--pre-commit')
      ? 'ZeroTrap — contrôle avant commit'
      : undefined;
  console.log(formaterRapport(r, titre ? { titre } : {}));
  if (args.has('--ci')) {
    const echapper = (s) => String(s).replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A');
    for (const e of r.erreurs) console.log(`::error title=ZeroTrap (${e.cat})::${echapper(e.msg)}`);
    for (const a of r.avertissements) console.log(`::warning title=ZeroTrap (${a.cat})::${echapper(a.msg)}`);
  }
}
process.exitCode = r.erreurs.length ? 1 : 0;
