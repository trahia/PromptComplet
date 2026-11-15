#!/usr/bin/env node
// ZeroTrap — verrou d'écriture (hook PreToolUse : Write, Edit, MultiEdit, NotebookEdit).
// Bloque : fichiers de la méthode, fichiers de secrets, secrets dans le contenu, code dangereux
// (injection SQL, XSS, injection de commande…), pages légales vidées.
// En cas de panne du verrou, l'écriture est BLOQUÉE par sécurité.

import fs from 'node:fs';
import path from 'node:path';

const lib = (f) => new URL(`../../zerotrap/scripts/lib/${f}`, import.meta.url).href;

try {
  const { lireEntree, bloquer, autoriser } = await import(lib('hook-io.mjs'));
  const { racineProjet, raisonProtection, estFichierSecret, relatif } = await import(lib('chemins.mjs'));
  const { scannerTexte } = await import(lib('secrets.mjs'));
  const { analyserCode, doitAnalyser, MARQUEUR_EXCEPTION } = await import(lib('code-dangereux.mjs'));

  const entree = await lireEntree();
  const ti = entree.tool_input || {};
  const cible = ti.file_path || ti.notebook_path || ti.path;
  if (!cible) autoriser();

  const racine = racineProjet();
  const abs = path.resolve(entree.cwd || racine, String(cible));
  const affiche = relatif(abs, racine) ?? abs;

  const raison = raisonProtection(abs, racine);
  if (raison) {
    bloquer(`⛔ ZeroTrap — fichier protégé : ${affiche}
Raison : ${raison}.
Ce fichier fait partie de la méthode imposée au projet : l'IA ne peut pas le modifier.
Ne cherche pas à contourner ce verrou. Explique à la personne ce que tu voulais changer et pourquoi : si elle le souhaite vraiment, elle le fera elle-même, à la main.
Pour les consignes propres au projet, utilise projet/consignes.md.`);
  }

  if (estFichierSecret(abs)) {
    bloquer(`⛔ ZeroTrap — fichier de secrets : ${affiche}
L'IA n'écrit jamais dans les fichiers de secrets (.env, clés privées, certificats…).
Mets les NOMS des variables (sans valeur) dans .env.example, avec un commentaire indiquant où obtenir chaque valeur.
La personne saisit elle-même les vraies valeurs dans .env (méthode 04, section 4.4).`);
  }

  const textes = [ti.content, ti.new_string, ti.new_source, ...(Array.isArray(ti.edits) ? ti.edits.map((e) => e?.new_string) : [])]
    .filter((t) => typeof t === 'string');
  const secrets = textes.flatMap((t) => scannerTexte(t)).filter((s) => s.bloquant);
  if (secrets.length) {
    bloquer(`⛔ ZeroTrap — secret détecté dans ${affiche} : ${[...new Set(secrets.map((s) => s.nom))].join(', ')}.
Aucun secret dans le code (règle 01). Lis la valeur depuis une variable d'environnement (ex. process.env.NOM_DE_LA_CLE), déclare son nom dans .env.example, et laisse la personne saisir la vraie valeur dans .env.
Si la valeur vient d'une clé réelle collée dans la conversation, dis à la personne de la révoquer et d'en créer une nouvelle.`);
  }

  const relNorm = String(affiche).replace(/\\/g, '/');
  if (doitAnalyser(relNorm)) {
    const problemes = textes.flatMap((t) => analyserCode(t, relNorm).problemes);
    if (problemes.length) {
      const liste = problemes.slice(0, 5).map((p) => `- ligne ${p.ligne} du texte écrit : ${p.titre}.\n  → ${p.conseil}`).join('\n');
      const autres = problemes.length > 5 ? `\n… et ${problemes.length - 5} autre(s).` : '';
      bloquer(`⛔ ZeroTrap — code dangereux dans ${affiche} :
${liste}${autres}
Règle 01, section 4 : une valeur venant de l'utilisateur ne doit jamais devenir du code, du HTML, du SQL ou une commande.
Réécris ce passage de façon sûre. Exception seulement si ce code ne reçoit jamais de donnée extérieure, après l'avoir expliqué à la personne : ajoute sur la ligne, ou juste au-dessus, le commentaire « ${MARQUEUR_EXCEPTION} <raison précise> ». Chaque exception est signalée à chaque vérification, pour relecture humaine.`);
    }
  }

  if (/^legal\/[^/]+\/[^/]+\.md$/.test(relNorm) && entree.tool_name === 'Write' && fs.existsSync(abs) && String(ti.content || '').trim().length < 200) {
    bloquer(`⛔ ZeroTrap — page légale vidée : ${affiche}
Une page légale obligatoire ne peut pas être vidée ou remplacée par un texte presque vide. Modifie-la section par section.`);
  }

  autoriser();
} catch (e) {
  process.stderr.write(`⛔ ZeroTrap — le verrou d'écriture est indisponible (${e?.message || e}).
Par sécurité, l'écriture est bloquée. Vérifie que le dossier zerotrap/ est complet : node zerotrap/scripts/verifier-conformite.mjs\n`);
  process.exit(2);
}
