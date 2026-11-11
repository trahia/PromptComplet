#!/usr/bin/env node
// PromptComplet — verrou des commandes (hook PreToolUse : Bash, PowerShell).
// Bloque : lecture de secrets, contournement des contrôles, modification de la méthode, scripts
// téléchargés exécutés directement, push vers le dépôt modèle, commandes destructrices.
// En cas de panne du verrou, la commande est BLOQUÉE par sécurité.

const lib = (f) => new URL(`../../promptcomplet/scripts/lib/${f}`, import.meta.url).href;

try {
  const { lireEntree, bloquer, autoriser } = await import(lib('hook-io.mjs'));
  const { racineProjet, modeMainteneur } = await import(lib('chemins.mjs'));
  const { analyserCommande } = await import(lib('commandes.mjs'));

  const entree = await lireEntree();
  const commande = entree.tool_input?.command;
  if (typeof commande !== 'string' || !commande.trim()) autoriser();

  const racine = racineProjet();
  const motif = analyserCommande(commande, { racine, cwd: entree.cwd || racine, mainteneur: modeMainteneur(racine) });
  if (motif) bloquer(motif);
  autoriser();
} catch (e) {
  process.stderr.write(`⛔ PromptComplet — le verrou des commandes est indisponible (${e?.message || e}).
Par sécurité, la commande est bloquée. Vérifie que le dossier promptcomplet/ est complet.\n`);
  process.exit(2);
}
