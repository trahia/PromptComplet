// PromptComplet — lecture et validation de projet/config.json.

import fs from 'node:fs';
import path from 'node:path';

export const STATUTS = ['questionnaire', 'plan', 'construction', 'lancement', 'production'];
export const TYPES = ['site', 'app', 'app+site', 'entreprise', 'autre'];
export const BASES_LEGALES = ['consentement', 'contrat', 'obligation-legale', 'interet-legitime', 'interet-vital', 'mission-publique'];

export function niveauStatut(statut) {
  const i = STATUTS.indexOf(statut);
  return i < 0 ? 0 : i;
}

export function chargerConfig(racine) {
  const chemin = path.join(racine, 'projet', 'config.json');
  if (!fs.existsSync(chemin)) return { existe: false };
  try {
    const brut = fs.readFileSync(chemin, 'utf8').replace(/^﻿/, '');
    return { existe: true, config: JSON.parse(brut) };
  } catch (e) {
    return { existe: true, erreurJson: e.message };
  }
}

const estListe = (v) => Array.isArray(v);
const codePays = (p) => typeof p === 'string' && /^[A-Z]{2}$/.test(p);
const codeLangue = (l) => typeof l === 'string' && /^[a-z]{2,3}(-[A-Z]{2})?$/.test(l);

/** Validation minimale (le schéma complet est dans promptcomplet/schemas/config.schema.json). */
export function validerConfig(c) {
  const e = [];
  if (!c || typeof c !== 'object') return ['projet/config.json doit contenir un objet JSON'];
  if (!STATUTS.includes(c.statut)) e.push(`statut invalide (« ${c.statut} ») : attendu ${STATUTS.join(', ')}`);
  const niveau = niveauStatut(c.statut);

  if (!c.projet || !TYPES.includes(c.projet.type)) e.push(`projet.type invalide : attendu ${TYPES.join(', ')}`);
  if (c.projet?.type === 'autre' && !c.projet.precision_type) e.push('projet.precision_type est obligatoire quand le type est « autre »');
  const plateformes = c.projet?.plateformes || [];
  if (!estListe(plateformes)) e.push('projet.plateformes doit être une liste (web, ios, android…)');
  if (['app', 'app+site'].includes(c.projet?.type) && !plateformes.some((p) => p === 'ios' || p === 'android')) {
    e.push('projet.plateformes doit contenir « ios » et/ou « android » pour une application');
  }

  if (!estListe(c.pays_cibles) || c.pays_cibles.length === 0 || !c.pays_cibles.every(codePays)) {
    e.push('pays_cibles : liste de codes pays ISO à 2 lettres majuscules, ex. ["FR","BE"]');
  }
  if (!codePays(c.etablissement?.pays)) e.push('etablissement.pays : code pays ISO à 2 lettres majuscules, ex. "FR"');
  if (!estListe(c.langues) || c.langues.length === 0 || !c.langues.every(codeLangue)) {
    e.push('langues : liste de codes ISO 639-1, ex. ["fr"]');
  }
  if (!['oui', 'non', 'optionnel'].includes(c.comptes_utilisateurs)) e.push('comptes_utilisateurs : « oui », « non » ou « optionnel »');
  if (typeof c.paiement?.actif !== 'boolean') e.push('paiement.actif doit valoir true ou false');
  if (c.connexions !== undefined && !estListe(c.connexions)) e.push('connexions doit être une liste');

  if (niveau >= 1) {
    if (!estListe(c.donnees)) e.push('donnees : liste des données personnelles collectées (obligatoire dès le plan)');
    else {
      c.donnees.forEach((d, i) => {
        for (const champ of ['nom', 'finalite', 'base_legale', 'conservation']) {
          if (!d || typeof d[champ] !== 'string' || !d[champ].trim()) e.push(`donnees[${i}].${champ} manquant`);
        }
        if (d && d.base_legale && !BASES_LEGALES.includes(d.base_legale)) {
          e.push(`donnees[${i}].base_legale invalide (« ${d.base_legale} ») : attendu ${BASES_LEGALES.join(', ')}`);
        }
      });
    }
    if (!estListe(c.sous_traitants)) e.push('sous_traitants : liste des services externes (obligatoire dès le plan, peut être vide)');
    else c.sous_traitants.forEach((s, i) => {
      if (!s || typeof s.nom !== 'string' || !s.nom.trim()) e.push(`sous_traitants[${i}].nom manquant`);
    });
  }
  if (c.preuves !== undefined && (typeof c.preuves !== 'object' || estListe(c.preuves))) e.push('preuves doit être un objet { "id": "chemin" }');
  return e;
}
