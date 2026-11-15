// ZeroTrap — vérification de conformité du projet.
// Utilisé par verifier-conformite.mjs (CLI), le hook de début de session, le hook de fin et le pre-commit.

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { chargerConfig, niveauStatut, validerConfig } from './config.mjs';
import { calculerObligations } from './obligations.mjs';
import { scannerTexte } from './secrets.mjs';
import { estFichierSecret, lireTexte, listerFichiers, modeMainteneur } from './chemins.mjs';
import { verifierIntegrite } from './integrite.mjs';
import { analyserDossier } from './code-dangereux.mjs';

const REPERE_A_COMPLETER = /\[\s*[ÀA]\s+COMPL[ÉE]TER/gi;
const COMMENTAIRE_IA = /<!--\s*IA\b/g;
const LIEN_ODR = /ec\.europa\.eu\/consumers\/odr/i;

const sansAccents = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

function joursDepuis(dateIso) {
  const d = new Date(`${dateIso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return null;
  return Math.floor((Date.now() - d.getTime()) / 86_400_000);
}

function fichiersSuivisGit(racine) {
  const r = spawnSync('git', ['ls-files', '-z'], { cwd: racine, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  if (r.status !== 0 || typeof r.stdout !== 'string') return null;
  return r.stdout.split('\0').filter(Boolean);
}

/** Vérifie que chaque table créée dans supabase/migrations a la Row Level Security activée. */
function verifierRls(racine, err) {
  const dossier = path.join(racine, 'supabase', 'migrations');
  if (!fs.existsSync(dossier)) return;
  const sql = listerFichiers(dossier)
    .filter((f) => f.endsWith('.sql'))
    .map((f) => lireTexte(path.join(dossier, f)) || '')
    .join('\n')
    .replace(/--[^\n]*/g, '');
  const nom = (n) => n.replace(/"/g, '').toLowerCase().replace(/^public\./, '');
  const tables = new Set();
  const reCreate = /create\s+table\s+(?:if\s+not\s+exists\s+)?((?:"?[\w]+"?\.)?"?[\w]+"?)/gi;
  let m;
  while ((m = reCreate.exec(sql)) !== null) {
    const t = m[1].replace(/"/g, '').toLowerCase();
    if (t.includes('.') && !t.startsWith('public.')) continue; // schémas non exposés par l'API
    tables.add(nom(t));
  }
  const protegees = new Set();
  const reRls = /alter\s+table\s+(?:only\s+)?(?:if\s+exists\s+)?((?:"?[\w]+"?\.)?"?[\w]+"?)\s+enable\s+row\s+level\s+security/gi;
  while ((m = reRls.exec(sql)) !== null) protegees.add(nom(m[1]));
  for (const t of tables) {
    if (!protegees.has(t)) err('securite', `Table « ${t} » sans Row Level Security : ajoute « alter table ${t} enable row level security; » et des règles d'accès (règle 01).`);
  }
}

/** Aucune colonne de données de carte bancaire dans les schémas. */
function verifierDonneesCarte(racine, fichiers, err) {
  const reCol = /\b(card_?number|cc_?num(?:ber)?|cvv2?|cvc|card_?cvc|card_?expiry|numero_?carte|cryptogramme)\b/i;
  for (const f of fichiers) {
    if (!/\.(sql|prisma)$/i.test(f) || f.startsWith('zerotrap/') || f.includes('node_modules/')) continue;
    const t = lireTexte(path.join(racine, f));
    if (t && reCol.test(t.replace(/--[^\n]*/g, ''))) {
      err('paiement', `${f} semble stocker des données de carte bancaire : interdit (règle 04). Seul le prestataire de paiement les gère.`);
    }
  }
}

/**
 * @param {string} racine
 * @param {{release?:boolean, rapide?:boolean, preCommit?:boolean}} options
 */
export function verifierConformite(racine, options = {}) {
  const { release = false, rapide = false, preCommit = false } = options;
  const r = { erreurs: [], avertissements: [], infos: [], obligations: null, statut: null, config: null };
  const err = (cat, msg) => r.erreurs.push({ cat, msg });
  const avert = (cat, msg) => r.avertissements.push({ cat, msg });
  const info = (cat, msg) => r.infos.push({ cat, msg });
  const mainteneur = modeMainteneur(racine);
  const installe = fs.existsSync(path.join(racine, 'zerotrap', '.installe'));
  if (mainteneur) info('mode', 'Mode mainteneur actif (dépôt modèle ZeroTrap) : les fichiers de la méthode sont modifiables.');

  // 1. Intégrité de la méthode
  const integ = verifierIntegrite(racine);
  if (integ.absent || integ.illisible) {
    (installe ? avert : info)('integrite', 'Empreintes de la méthode absentes ou illisibles (zerotrap/integrite.json).');
  } else {
    const signaler = mainteneur ? info : err;
    for (const f of integ.modifies) signaler('integrite', `Fichier protégé modifié : ${f} (seule la personne peut le changer, à la main).`);
    for (const f of integ.manquants) signaler('integrite', `Fichier protégé supprimé : ${f}.`);
  }

  // 2. Sécurité de base
  const gitignore = lireTexte(path.join(racine, '.gitignore')) || '';
  if (!/^\s*\.env\s*$/m.test(gitignore)) err('securite', '.gitignore doit contenir la ligne « .env » (les secrets ne sont jamais versionnés).');

  const suivis = fichiersSuivisGit(racine);
  if (suivis) {
    for (const f of suivis) {
      if (estFichierSecret(f)) err('securite', `Fichier de secrets versionné dans git : ${f}. Retire-le (git rm --cached) et fais renouveler les clés concernées.`);
    }
    if (!rapide && !preCommit) {
      for (const f of suivis) {
        if (f.startsWith('zerotrap/') || /(^|\/)(package-lock\.json|pnpm-lock\.yaml|yarn\.lock|bun\.lockb?)$/.test(f)) continue;
        const abs = path.join(racine, f);
        let taille = 0;
        try { taille = fs.statSync(abs).size; } catch { continue; }
        if (taille > 1_000_000) continue;
        for (const s of scannerTexte(lireTexte(abs) || '')) {
          (s.bloquant ? err : avert)('securite', `${s.nom} dans ${f} (ligne ${s.ligne}) : ${s.extrait}`);
        }
      }
    }
    verifierDonneesCarte(racine, suivis, err);
  }
  verifierRls(racine, err);
  if (fs.existsSync(path.join(racine, 'package.json'))) {
    const verrous = ['package-lock.json', 'pnpm-lock.yaml', 'yarn.lock', 'bun.lock', 'bun.lockb'];
    if (!verrous.some((v) => fs.existsSync(path.join(racine, v)))) avert('securite', 'package.json sans fichier de verrouillage (lockfile) : versionne-le pour figer les dépendances.');
    // Chaîne d'approvisionnement : scripts d'installation bloqués, délai avant adoption (règle 01, section 8)
    if (fs.existsSync(path.join(racine, 'pnpm-lock.yaml'))) {
      const ws = lireTexte(path.join(racine, 'pnpm-workspace.yaml')) || '';
      if (!/minimumReleaseAge/.test(ws)) avert('securite', 'pnpm : ajoute « minimumReleaseAge: 10080 » (7 jours) dans pnpm-workspace.yaml, pour ne pas installer une version piégée publiée la veille.');
    } else if (fs.existsSync(path.join(racine, 'package-lock.json'))) {
      const npmrc = lireTexte(path.join(racine, '.npmrc')) || '';
      if (!/^\s*ignore-scripts\s*=\s*true/m.test(npmrc)) avert('securite', 'npm : ajoute « ignore-scripts=true » dans .npmrc, pour bloquer les scripts d’installation des paquets (attaques de 2025-2026).');
    }
  }

  // 2 bis. Code dangereux : injection SQL, XSS, injection de commande… (règle 01, section 4).
  // Avant le retour du mode pre-commit : le contrôle avant commit l'applique aussi.
  let nbProblemes = 0;
  for (const a of analyserDossier(racine)) {
    for (const p of a.problemes) {
      if (++nbProblemes <= 30) err('code', `${a.fichier}:${p.ligne} — ${p.titre}. ${p.conseil}`);
    }
    for (const x of a.exceptions) avert('code', `Exception de sécurité à faire relire par un humain — ${a.fichier}:${x.ligne} (${x.titre}) : « ${x.raison} ».`);
  }
  if (nbProblemes > 30) err('code', `… et ${nbProblemes - 30} autre(s) passage(s) de code dangereux. Liste complète : node zerotrap/scripts/analyser-code.mjs`);

  if (preCommit) return r;

  // 3. Configuration du projet
  const { existe, config, erreurJson } = chargerConfig(racine);
  if (!existe) {
    if (mainteneur) info('projet', 'Dépôt modèle : pas de projet/config.json (normal).');
    else info('projet', installe ? 'Questionnaire pas encore terminé (projet/config.json absent).' : 'Méthode pas encore installée (voir zerotrap/methode/00-installation.md).');
    return r;
  }
  if (erreurJson) {
    err('config', `projet/config.json illisible : ${erreurJson}`);
    return r;
  }
  r.config = config;
  r.statut = config.statut;
  const erreursConfig = validerConfig(config);
  for (const e of erreursConfig) err('config', e);
  if (erreursConfig.length && !config.projet) return r;

  const niveau = niveauStatut(config.statut);
  const ob = calculerObligations(config);
  r.obligations = ob;
  for (const c of ob.controles) (c.niveau === 'erreur' ? err : avert)(c.cat, c.message);

  for (const f of ob.fichiersProjet) {
    if (niveau >= f.des && !fs.existsSync(path.join(racine, f.chemin))) err('projet', `Fichier manquant : ${f.chemin} (${f.raison}).`);
  }

  // 4. Veille légale
  if (niveau >= 1) {
    const date = config.veille_legale?.derniere_verification;
    const age = date ? joursDepuis(date) : null;
    if (age === null) err('veille', 'Veille légale non datée : renseigne veille_legale.derniere_verification (AAAA-MM-JJ) après avoir vérifié les sources officielles (methode/02).');
    else if (age > 90) (release ? err : avert)('veille', `Veille légale vieille de ${age} jours (plus de 90) : refais-la (methode/02-veille-legale.md).`);
    const verifies = (config.veille_legale?.pays_verifies || []).map((p) => String(p).toUpperCase());
    const tousPays = [...new Set([...(config.pays_cibles || []), config.etablissement?.pays].filter(Boolean))];
    const manquants = tousPays.filter((p) => !verifies.includes(String(p).toUpperCase()));
    if (manquants.length) avert('veille', `Pays pas encore couverts par la veille légale : ${manquants.join(', ')}.`);
  }

  if (niveau < 2) {
    info('projet', `Statut « ${config.statut} » : pages légales et preuves exigées à partir de la construction.`);
    return r;
  }

  // 5. Pages légales
  const langues = config.langues || [];
  for (const p of ob.pages) {
    for (const l of langues) {
      const rel = `legal/${l}/${p.id}.md`;
      const contenu = lireTexte(path.join(racine, rel));
      if (contenu === null) {
        err('legal', `Page légale manquante : ${rel} — ${p.libelle} (${p.raison}). Modèle : zerotrap/legal/modeles/${p.id}.md`);
        continue;
      }
      if (contenu.trim().length < 200) err('legal', `Page légale presque vide : ${rel}.`);
      const aCompleter = (contenu.match(REPERE_A_COMPLETER) || []).length;
      if (aCompleter) (release ? err : avert)('legal', `${rel} : ${aCompleter} repère(s) [À COMPLÉTER] restant(s).`);
      const notesIa = (contenu.match(COMMENTAIRE_IA) || []).length;
      if (notesIa) (release ? err : avert)('legal', `${rel} : ${notesIa} commentaire(s) <!-- IA … --> à retirer.`);
      if (LIEN_ODR.test(contenu)) err('legal', `${rel} : lien vers la plateforme européenne ODR, supprimée le 20/07/2025. Retire-le.`);
    }
  }

  // 6. Cohérence données ↔ politique de confidentialité (langue principale)
  const languePrincipale = langues[0];
  if (languePrincipale) {
    const pol = lireTexte(path.join(racine, `legal/${languePrincipale}/politique-confidentialite.md`));
    if (pol) {
      const polN = sansAccents(pol);
      for (const d of config.donnees || []) {
        if (d?.nom && !polN.includes(sansAccents(d.nom))) {
          err('donnees', `La donnée « ${d.nom} » (config.donnees) n'apparaît pas dans legal/${languePrincipale}/politique-confidentialite.md.`);
        }
      }
      for (const s of config.sous_traitants || []) {
        if (s?.nom && !polN.includes(sansAccents(s.nom))) {
          err('donnees', `Le sous-traitant « ${s.nom} » (config.sous_traitants) n'apparaît pas dans legal/${languePrincipale}/politique-confidentialite.md.`);
        }
      }
    }
  }

  // 6 bis. Mentions obligatoires dans les pages (legal/affichages-obligatoires.md)
  const pagesExigees = new Set(ob.pages.map((p) => p.id));
  for (const m of ob.mentions || []) {
    if (!pagesExigees.has(m.page) || !langues.includes(m.langue)) continue;
    const rel = `legal/${m.langue}/${m.page}.md`;
    const contenu = lireTexte(path.join(racine, rel));
    if (contenu !== null && !m.motif.test(contenu)) err('mentions', `${rel} : il manque ${m.libelle} (${m.raison}).`);
  }

  // 6 ter. Chaque cookie déclaré (nom et fournisseur) apparaît dans la page cookies, dans chaque langue
  if (pagesExigees.has('cookies')) {
    const cookies = config.cookies || [];
    if (!cookies.length) err('cookies', 'config.cookies est vide alors que des cookies non essentiels sont prévus : liste chaque cookie réellement déposé (nom, fournisseur, finalité, durée, catégorie), vérifié dans le navigateur.');
    for (const l of langues) {
      const page = lireTexte(path.join(racine, `legal/${l}/cookies.md`));
      if (page === null) continue;
      const pageN = sansAccents(page);
      for (const ck of cookies) {
        if (ck?.nom && !pageN.includes(sansAccents(ck.nom))) err('cookies', `Le cookie « ${ck.nom} » (config.cookies) n'apparaît pas dans legal/${l}/cookies.md.`);
        if (ck?.fournisseur && !pageN.includes(sansAccents(ck.fournisseur))) err('cookies', `Le fournisseur « ${ck.fournisseur} » (config.cookies) n'apparaît pas dans legal/${l}/cookies.md (liste des partenaires).`);
      }
    }
  }

  // 7. Preuves (fonctionnalités obligatoires réellement présentes)
  const preuves = config.preuves || {};
  for (const p of ob.preuves) {
    const valeur = preuves[p.id];
    if (!valeur || (Array.isArray(valeur) && valeur.length === 0)) {
      err('preuve', `Preuve non déclarée : config.preuves.${p.id} (${p.raison}). Indique le chemin du fichier qui l'implémente.`);
      continue;
    }
    for (const chemin of [].concat(valeur)) {
      const contenu = lireTexte(path.join(racine, String(chemin)));
      if (contenu === null) err('preuve', `Preuve introuvable : ${chemin} (config.preuves.${p.id}).`);
      else if (p.marqueur && !p.marqueur.test(contenu)) err('preuve', `${chemin} ne semble pas inclure ${p.libelle} (config.preuves.${p.id}).`);
    }
  }

  return r;
}

/** Résumé texte en français. */
export function formaterRapport(r, { titre = 'ZeroTrap — vérification de conformité', max = 50 } = {}) {
  const lignes = [titre];
  if (r.statut) lignes.push(`Statut du projet : ${r.statut}`);
  lignes.push(`${r.erreurs.length} erreur(s) · ${r.avertissements.length} avertissement(s)`);
  const bloc = (nom, liste, symbole) => {
    if (!liste.length) return;
    lignes.push('', nom);
    for (const x of liste.slice(0, max)) lignes.push(`  ${symbole} [${x.cat}] ${x.msg}`);
    if (liste.length > max) lignes.push(`  … et ${liste.length - max} autre(s)`);
  };
  bloc('ERREURS (à corriger) :', r.erreurs, '✖');
  bloc('AVERTISSEMENTS :', r.avertissements, '⚠');
  bloc('INFORMATIONS :', r.infos, 'ℹ');
  if (!r.erreurs.length) lignes.push('', '✔ Aucune erreur bloquante.');
  return lignes.join('\n');
}
