#!/usr/bin/env node
// ZeroTrap — hook Stop : avant que Claude rende la main, vérifie la conformité du projet.
// Si de NOUVEAUX problèmes sont apparus pendant le tour, Claude est relancé une fois pour les traiter
// ou les expliquer. Pas de boucle : un même ensemble de problèmes n'est signalé qu'une fois par session.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';

const lib = (f) => new URL(`../../zerotrap/scripts/lib/${f}`, import.meta.url).href;

try {
  const { lireEntree, bloquer, autoriser } = await import(lib('hook-io.mjs'));
  const { racineProjet, modeMainteneur } = await import(lib('chemins.mjs'));
  const { chargerConfig, niveauStatut } = await import(lib('config.mjs'));
  const { verifierConformite } = await import(lib('conformite.mjs'));

  const entree = await lireEntree();
  if (entree.stop_hook_active) autoriser();
  const racine = racineProjet();
  if (modeMainteneur(racine)) autoriser();
  const { existe, config } = chargerConfig(racine);
  if (!existe || !config || niveauStatut(config.statut) < 2) autoriser();

  const r = verifierConformite(racine, { rapide: true });
  if (!r.erreurs.length) autoriser();

  // Ne signaler qu'une fois le même ensemble d'erreurs dans une session.
  const empreinte = crypto.createHash('sha256').update(r.erreurs.map((e) => e.msg).sort().join('\n')).digest('hex');
  const session = String(entree.session_id || 'inconnue').replace(/[^\w-]/g, '');
  const etat = path.join(os.tmpdir(), `zerotrap-stop-${session}.txt`);
  let deja = '';
  try { deja = fs.readFileSync(etat, 'utf8'); } catch { /* première fois */ }
  if (deja === empreinte) autoriser();
  try { fs.writeFileSync(etat, empreinte, 'utf8'); } catch { /* sans état : on signale quand même */ }

  bloquer(`ZeroTrap — avant de terminer, la vérification de conformité signale ${r.erreurs.length} problème(s) :
${r.erreurs.slice(0, 12).map((e) => `- [${e.cat}] ${e.msg}`).join('\n')}
Corrige maintenant ce qui dépend de toi. Si une correction demande une information ou une décision de la personne (identité légale, choix, compte à créer…), explique-le-lui clairement et simplement dans ta réponse : c'est suffisant.`);
} catch (e) {
  // Ce contrôle ne doit jamais empêcher la session de fonctionner : en cas de panne, on laisse passer.
  process.stderr.write(`ZeroTrap : contrôle de fin indisponible (${e?.message || e}).\n`);
  process.exit(0);
}
