// ZeroTrap — entrée/sortie des hooks Claude Code.

/** Lit le JSON envoyé par Claude Code sur l'entrée standard. */
export async function lireEntree() {
  const morceaux = [];
  for await (const m of process.stdin) morceaux.push(m);
  const brut = Buffer.concat(morceaux).toString('utf8').replace(/^﻿/, '').trim();
  return brut ? JSON.parse(brut) : {};
}

/** Bloque l'action : le message (sortie d'erreur) est transmis à Claude. Code de sortie 2. */
export function bloquer(message) {
  process.stderr.write(`${String(message).trim()}\n`);
  process.exit(2);
}

/** Laisse passer l'action. */
export function autoriser() {
  process.exit(0);
}
