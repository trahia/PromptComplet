// PromptComplet — matrice des obligations (voir promptcomplet/legal/matrice-obligations.md).
// Calcule le MINIMUM exigé selon les pays et les fonctionnalités. La veille légale peut ajouter, jamais retirer.

export const UE = ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'];
export const EEE = [...UE, 'IS', 'LI', 'NO'];
export const EUROPE = [...EEE, 'CH', 'GB'];

/** Langues officielles principales (au moins une doit être proposée). */
const LANGUES_PAYS = {
  FR: ['fr'], BE: ['fr', 'nl', 'de'], LU: ['fr', 'de', 'lb'], CH: ['de', 'fr', 'it', 'rm'], MC: ['fr'],
  DE: ['de'], AT: ['de'], ES: ['es'], IT: ['it'], PT: ['pt'], NL: ['nl'], IE: ['en', 'ga'], GB: ['en'],
  PL: ['pl'], SE: ['sv'], DK: ['da'], FI: ['fi', 'sv'], GR: ['el'], CZ: ['cs'], RO: ['ro'], HU: ['hu'],
  US: ['en'], CA: ['en', 'fr'], IL: ['he'], MA: ['ar', 'fr'], TN: ['ar', 'fr'], DZ: ['ar', 'fr'],
  SN: ['fr'], CI: ['fr'], BR: ['pt'], MX: ['es'],
};

const CONNEXIONS_SOCIALES = ['google', 'facebook', 'microsoft', 'github', 'x', 'twitter', 'linkedin', 'amazon', 'wechat', 'discord'];

export const LIBELLES_PAGES = {
  'politique-confidentialite': 'Politique de confidentialité',
  'declaration-accessibilite': "Déclaration d'accessibilité",
  'mentions-legales': 'Mentions légales',
  cgu: "Conditions générales d'utilisation",
  cgv: 'Conditions générales de vente',
  cookies: 'Politique cookies',
};

export function calculerObligations(c) {
  const paysCibles = (c.pays_cibles || []).map((p) => String(p).toUpperCase());
  const etab = c.etablissement?.pays ? String(c.etablissement.pays).toUpperCase() : null;
  const tous = new Set([...paysCibles, ...(etab ? [etab] : [])]);
  const dans = (zone) => [...tous].some((p) => zone.includes(p));
  const plateformes = c.projet?.plateformes || [];
  const ios = plateformes.includes('ios');
  const android = plateformes.includes('android');
  const comptes = c.comptes_utilisateurs === 'oui' || c.comptes_utilisateurs === 'optionnel';
  const paiement = c.paiement?.actif === true;
  const connexions = (c.connexions || []).map((x) => String(x).toLowerCase());
  const consentementCookies = c.cookies_non_essentiels === true || c.publicite === true || c.mesure_audience === 'avec-consentement';
  const mineurs = c.public_mineurs === 'oui' || c.public_mineurs === 'possible';
  const ugc = c.contenu_utilisateurs === true || c.place_de_marche === true;
  const particuliers = c.clientele !== 'professionnels';
  const vendu = c.modele_economique?.ce_qui_est_vendu || [];

  const pages = [];
  const page = (id, raison) => pages.push({ id, libelle: LIBELLES_PAGES[id], raison });
  page('politique-confidentialite', 'toujours obligatoire');
  page('declaration-accessibilite', 'toujours — obligatoire dans de nombreux pays, bonne pratique ailleurs');
  if (dans(EUROPE)) page('mentions-legales', 'établissement ou public en Europe');
  if (comptes || ugc) page('cgu', 'comptes utilisateurs, contenu publié ou place de marché');
  if (paiement) page('cgv', 'paiement actif');
  if (consentementCookies) page('cookies', 'cookies non essentiels, publicité ou mesure d’audience avec consentement');

  const preuves = [];
  const preuve = (id, raison, marqueur, libelle) => preuves.push({ id, raison, marqueur, libelle });
  preuve('composant_accessibilite', 'toujours — règle 05', /accessibilit(y|e|é)/i, "le module d'accessibilité");
  preuve('liens_legaux', 'toujours : pages légales accessibles partout');
  if (consentementCookies) preuve('bandeau_cookies', 'consentement aux cookies requis', /consent/i, 'le bandeau de consentement');
  if (comptes) preuve('suppression_compte', 'comptes utilisateurs — RGPD, Apple 5.1.1(v), Google Play');
  if (comptes) preuve('export_donnees', 'comptes utilisateurs — droit d’accès et portabilité');
  if (comptes && android) preuve('page_web_suppression_compte', 'comptes + Android — exigence Google Play');
  if (mineurs) preuve('verification_age', 'public pouvant inclure des mineurs');
  if (ugc) preuve('signalement_contenu', 'contenu publié par les utilisateurs — DSA, CGU');
  if (c.ia_dans_le_produit === true) preuve('mention_ia', 'IA dans le produit — AI Act, art. 50');
  if (c.newsletter === true) preuve('desinscription_emails', 'newsletter ou e-mails promotionnels');
  if (paiement && particuliers && dans(EEE)) preuve('retractation_en_ligne', 'vente à distance aux consommateurs dans l’EEE, depuis le 19/06/2026');
  if (c.publicite === true && tous.has('US')) preuve('opt_out_vente_partage', 'publicité + États-Unis — CCPA/CPRA');

  const controles = [];
  const ctrl = (niveau, cat, message) => controles.push({ niveau, cat, message });
  const sociales = connexions.filter((x) => CONNEXIONS_SOCIALES.includes(x));
  if (ios && sociales.length > 0 && !connexions.includes('apple')) {
    ctrl('erreur', 'stores', `App iOS avec connexion ${sociales.join(', ')} : ajoute « apple » (Sign in with Apple) dans connexions — règle App Store 4.8.`);
  }
  if ((ios || android) && paiement && vendu.includes('numerique') && c.paiement?.achats_integres_app !== true && !c.paiement?.autre) {
    ctrl('avertissement', 'stores', 'Contenu numérique vendu dans une app : les achats intégrés Apple/Google sont en principe obligatoires (paiement.achats_integres_app). Justifie toute dérogation dans paiement.autre.');
  }
  if (tous.has('FR') && (c.donnees_sensibles || []).includes('sante')) {
    ctrl('avertissement', 'hebergement', 'Données de santé en France : hébergeur certifié HDS obligatoire.');
  }
  const langues = c.langues || [];
  for (const p of paysCibles) {
    const officielles = LANGUES_PAYS[p];
    if (!officielles) continue;
    if (!officielles.some((l) => langues.includes(l))) {
      if (p === 'FR') ctrl('erreur', 'langue', 'Public en France : le français est obligatoire (loi Toubon). Ajoute « fr » dans langues.');
      else ctrl('avertissement', 'langue', `Public en ${p} : aucune langue officielle (${officielles.join(', ')}) dans langues.`);
    }
  }
  if (paysCibles.includes('CA') && !langues.includes('fr')) {
    ctrl('avertissement', 'langue', 'Si tu vises le Québec, le français est obligatoire (Charte de la langue française).');
  }
  if (paysCibles.includes('IL') && !langues.includes('he')) {
    ctrl('avertissement', 'langue', "Israël : prévois l'hébreu, au moins pour la déclaration d'accessibilité.");
  }

  const fichiersProjet = [
    { chemin: 'projet/brief.md', des: 1, raison: 'résultat du questionnaire' },
    { chemin: 'projet/journal.md', des: 1, raison: 'journal du projet' },
    { chemin: 'projet/veille-legale.md', des: 1, raison: 'vérification des lois sur les sources officielles' },
    { chemin: 'projet/plan.md', des: 2, raison: 'plan validé' },
    { chemin: 'projet/registre-traitements.md', des: 2, raison: 'registre des traitements de données' },
    { chemin: 'projet/licences.md', des: 2, raison: 'inventaire des licences — règle 06' },
  ];

  return { pages, preuves, controles, fichiersProjet, zones: { europe: dans(EUROPE), eee: dans(EEE) } };
}
