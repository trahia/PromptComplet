#!/usr/bin/env node
// PromptComplet — installation de la méthode dans le dossier d'un projet.
// Voir promptcomplet/methode/00-installation.md (installation) et 07-mise-a-jour.md (mise à jour).
//
//   node .promptcomplet-source/promptcomplet/scripts/installer.mjs --source .promptcomplet-source
//   node promptcomplet/scripts/installer.mjs --sur-place [--confirme-suppression-historique]
//   node .promptcomplet-source/promptcomplet/scripts/installer.mjs --mise-a-jour --source .promptcomplet-source
//   Option : --cible <dossier> (par défaut : dossier courant)

import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const valeur = (nom) => {
  const i = args.indexOf(nom);
  if (i < 0) return undefined;
  const suivant = args[i + 1];
  return suivant && !suivant.startsWith('--') ? suivant : true;
};
const ICI = path.dirname(fileURLToPath(import.meta.url));
const cible = path.resolve(typeof valeur('--cible') === 'string' ? valeur('--cible') : process.cwd());
const surPlace = valeur('--sur-place') === true;
const miseAJour = valeur('--mise-a-jour') === true;
const confirmeHistorique = valeur('--confirme-suppression-historique') === true;
const sourceArg = valeur('--source');
const source = surPlace ? cible : path.resolve(typeof sourceArg === 'string' ? sourceArg : path.resolve(ICI, '..', '..'));

const SEULEMENT_MODELE = new Set(['README.md', 'DEMARRER.md', 'LICENSE']);
const EXCLUS_RACINE = new Set(['.git', 'node_modules', '.promptcomplet-source', '.promptcomplet-mainteneur', ...SEULEMENT_MODELE]);
const EXCLUS = new Set(['promptcomplet/.installe', '.claude/settings.local.json']);
const SKILLS = ['demarrer', 'verifier', 'nouvelle-fonctionnalite', 'veille-legale', 'lancement'];
const METHODE_FICHIERS = ['CLAUDE.md', 'AGENTS.md', '.claude/settings.json', '.github/workflows/securite.yml', '.github/workflows/conformite.yml', '.github/workflows/zap.yml', '.gitleaks.toml'];
const METHODE_DOSSIERS = ['promptcomplet/', '.claude/hooks/', '.githooks/', ...SKILLS.map((s) => `.claude/skills/${s}/`)];

const ok = (m) => console.log(`✔ ${m}`);
const note = (m) => console.log(`  ${m}`);
function arreter(m, code = 1) {
  console.error(`⛔ ${m}`);
  process.exit(code);
}

function lister(dossier) {
  const out = [];
  const parcourir = (d, prefixe) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const rel = prefixe ? `${prefixe}/${e.name}` : e.name;
      if (!prefixe && EXCLUS_RACINE.has(e.name)) continue;
      if (e.name === '.git' || e.name === 'node_modules') continue;
      if (EXCLUS.has(rel)) continue;
      const abs = path.join(d, e.name);
      if (e.isDirectory()) parcourir(abs, rel);
      else if (e.isFile()) out.push(rel);
    }
  };
  parcourir(dossier, '');
  return out.sort();
}

const estMethode = (rel) => METHODE_FICHIERS.includes(rel) || METHODE_DOSSIERS.some((d) => rel.startsWith(d));

function git(...a) {
  return spawnSync('git', a, { cwd: cible, encoding: 'utf8' });
}

function urlModeleDepuisSource() {
  const r = spawnSync('git', ['remote', 'get-url', 'origin'], { cwd: source, encoding: 'utf8' });
  return r.status === 0 ? r.stdout.trim() : null;
}

function estUrlModele(url) {
  return /\/promptcomplet(\.git)?\/?$/i.test(String(url).trim());
}

function rendreModifiable(d) {
  try {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const abs = path.join(d, e.name);
      try { fs.chmodSync(abs, 0o777); } catch { /* ignoré */ }
      if (e.isDirectory()) rendreModifiable(abs);
    }
  } catch { /* ignoré */ }
}

function supprimerDossier(d) {
  try {
    fs.rmSync(d, { recursive: true, force: true, maxRetries: 3 });
  } catch {
    rendreModifiable(d);
    fs.rmSync(d, { recursive: true, force: true, maxRetries: 3 });
  }
}

function versionDe(dossier) {
  try {
    return fs.readFileSync(path.join(dossier, 'promptcomplet', 'VERSION'), 'utf8').trim();
  } catch {
    return 'inconnue';
  }
}

function configurerGit() {
  if (!fs.existsSync(path.join(cible, '.git'))) {
    let r = git('init', '-b', 'main');
    if (r.status !== 0) {
      r = git('init');
      if (r.status !== 0) arreter(`git init a échoué : ${r.stderr || r.stdout}`);
      git('symbolic-ref', 'HEAD', 'refs/heads/main');
    }
    ok('Dépôt git neuf créé (branche main), sans lien avec le modèle.');
  } else {
    const remotes = git('remote', '-v').stdout || '';
    const relies = [...new Set(remotes.split('\n').map((l) => l.split(/\s+/)).filter((p) => p[1] && estUrlModele(p[1])).map((p) => p[0]))];
    for (const nom of relies) {
      git('remote', 'remove', nom);
      ok(`Lien « ${nom} » vers le dépôt modèle supprimé.`);
    }
  }
  const h = git('config', 'core.hooksPath', '.githooks');
  if (h.status === 0) ok('Contrôle avant commit activé (core.hooksPath = .githooks).');
  try { fs.chmodSync(path.join(cible, '.githooks', 'pre-commit'), 0o755); } catch { /* Windows */ }
}

function ecrireMarqueur(version, urlModele) {
  const marqueur = { version, installe_le: new Date().toISOString().slice(0, 10), source: urlModele || undefined };
  fs.writeFileSync(path.join(cible, 'promptcomplet', '.installe'), `${JSON.stringify(marqueur, null, 2)}\n`, 'utf8');
}

function creerJournal(version) {
  const journal = path.join(cible, 'projet', 'journal.md');
  if (fs.existsSync(journal)) return;
  fs.mkdirSync(path.dirname(journal), { recursive: true });
  const date = new Date().toISOString().slice(0, 10);
  fs.writeFileSync(journal, `# Journal du projet\n\n| Date | Étape | Ce qui a été fait / décidé |\n|---|---|---|\n| ${date} | Installation | Méthode PromptComplet ${version} installée. |\n`, 'utf8');
  ok('projet/journal.md créé.');
}

function demander(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(question, (rep) => { rl.close(); resolve(rep.trim().toLowerCase()); });
  });
}

// ---------------------------------------------------------------------------------------------
async function installer() {
  if (fs.existsSync(path.join(cible, 'promptcomplet', '.installe')) && !surPlace) {
    arreter('La méthode est déjà installée dans ce dossier. Pour la mettre à jour, suis promptcomplet/methode/07-mise-a-jour.md.');
  }
  const version = versionDe(source);
  if (version === 'inconnue') arreter(`Source introuvable ou incomplète : ${source}`);
  const urlModele = urlModeleDepuisSource();

  if (surPlace) {
    if (fs.existsSync(path.join(cible, 'promptcomplet', '.installe'))) arreter('La méthode est déjà installée dans ce dossier.');
    if (fs.existsSync(path.join(cible, '.git'))) {
      const origine = git('remote', 'get-url', 'origin');
      if (origine.status === 0 && estUrlModele(origine.stdout)) {
        if (!confirmeHistorique) {
          arreter("Ce dossier est encore le clone du dépôt modèle (historique et lien git). Après accord de la personne, relance avec --confirme-suppression-historique : l'historique du MODÈLE sera retiré pour repartir d'une page blanche.", 3);
        }
        supprimerDossier(path.join(cible, '.git'));
        ok('Historique git du modèle retiré.');
      }
    }
    for (const f of SEULEMENT_MODELE) {
      const abs = path.join(cible, f);
      if (fs.existsSync(abs)) { fs.rmSync(abs); ok(`${f} (présentation du modèle) retiré.`); }
    }
  } else {
    if (!fs.existsSync(source)) arreter(`Dossier source introuvable : ${source}`);
    const fichiers = lister(source);
    const conflits = [];
    let copies = 0;
    for (const rel of fichiers) {
      const dest = path.join(cible, rel);
      if (fs.existsSync(dest)) { conflits.push(rel); continue; }
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(path.join(source, rel), dest);
      copies++;
    }
    ok(`${copies} fichier(s) de la méthode copié(s).`);
    if (conflits.length) {
      console.log(`⚠ ${conflits.length} fichier(s) déjà présent(s), NON écrasé(s) :`);
      for (const c of conflits) note(`- ${c}`);
      note('Voir promptcomplet/methode/08-projet-existant.md pour les fusionner avec l’accord de la personne.');
    }
  }

  configurerGit();
  creerJournal(version);
  ecrireMarqueur(version, urlModele);
  ok(`Méthode PromptComplet ${version} installée.`);

  const tmp = path.join(cible, '.promptcomplet-source');
  if (!surPlace && path.resolve(source) === tmp && fs.existsSync(tmp)) {
    supprimerDossier(tmp);
    ok('Dossier temporaire .promptcomplet-source supprimé.');
  }
  console.log('\nÉtape suivante : tape /clear (ou ferme et relance Claude Code dans ce dossier) pour activer les verrous, puis /demarrer.');
}

// ---------------------------------------------------------------------------------------------
async function mettreAJour() {
  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    arreter('La mise à jour de la méthode doit être lancée par TOI, dans ton propre terminal (pas par l’IA). Voir promptcomplet/methode/07-mise-a-jour.md.');
  }
  if (!fs.existsSync(path.join(cible, 'promptcomplet', '.installe'))) arreter('Méthode non installée ici : utilise l’installation normale.');
  if (!fs.existsSync(source) || path.resolve(source) === path.resolve(cible)) arreter('Indique le dossier de la nouvelle version avec --source.');
  const versionActuelle = versionDe(cible);
  const nouvelle = versionDe(source);
  const fichiers = lister(source).filter(estMethode);
  const changes = fichiers.filter((rel) => {
    const dest = path.join(cible, rel);
    return !fs.existsSync(dest) || !fs.readFileSync(dest).equals(fs.readFileSync(path.join(source, rel)));
  });
  console.log(`Mise à jour de PromptComplet : ${versionActuelle} → ${nouvelle}`);
  console.log(`${changes.length} fichier(s) de la méthode seront remplacés ou ajoutés :`);
  for (const c of changes) note(`- ${c}`);
  console.log('Ton code, le dossier projet/ et tes pages legal/ ne sont PAS modifiés.');
  const rep = await demander('Tape « oui » pour continuer : ');
  if (rep !== 'oui') arreter('Mise à jour annulée.', 0);
  for (const rel of changes) {
    const dest = path.join(cible, rel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(path.join(source, rel), dest);
  }
  configurerGit();
  let marqueur = {};
  try { marqueur = JSON.parse(fs.readFileSync(path.join(cible, 'promptcomplet', '.installe'), 'utf8')); } catch { /* neuf */ }
  marqueur.version = nouvelle;
  marqueur.mis_a_jour_le = new Date().toISOString().slice(0, 10);
  fs.writeFileSync(path.join(cible, 'promptcomplet', '.installe'), `${JSON.stringify(marqueur, null, 2)}\n`, 'utf8');
  ok(`Méthode mise à jour en version ${nouvelle}. Demande à Claude de lire promptcomplet/CHANGEMENTS.md.`);
  const tmp = path.join(cible, '.promptcomplet-source');
  if (path.resolve(source) === tmp) supprimerDossier(tmp);
}

(miseAJour ? mettreAJour() : installer()).catch((e) => arreter(`Erreur inattendue : ${e?.message || e}`));
