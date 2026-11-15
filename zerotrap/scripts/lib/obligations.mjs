// ZeroTrap — matrice des obligations (voir zerotrap/legal/matrice-obligations.md).
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
  JP: ['ja'], CN: ['zh'], KR: ['ko'], IN: ['en', 'hi'], AU: ['en'],
};

const CONNEXIONS_SOCIALES = ['google', 'facebook', 'microsoft', 'github', 'x', 'twitter', 'linkedin', 'amazon', 'wechat', 'discord'];

export const LIBELLES_PAGES = {
  'politique-confidentialite': 'Politique de confidentialité',
  'declaration-accessibilite': "Déclaration d'accessibilité",
  'mentions-legales': 'Mentions légales',
  cgu: "Conditions générales d'utilisation",
  cgv: 'Conditions générales de vente',
  cookies: 'Politique cookies',
  'dpa-clients': 'Accord de traitement des données (DPA) pour les clients professionnels',
};

export function calculerObligations(c) {
  const paysCibles = (c.pays_cibles || []).map((p) => String(p).toUpperCase());
  const etab = c.etablissement?.pays ? String(c.etablissement.pays).toUpperCase() : null;
  const tous = new Set([...paysCibles, ...(etab ? [etab] : [])]);
  const dans = (zone) => [...tous].some((p) => zone.includes(p));
  const plateformes = c.projet?.plateformes || [];
  const ios = plateformes.includes('ios');
  const android = plateformes.includes('android');
  const forme = c.projet?.forme_app;
  const comptes = c.comptes_utilisateurs === 'oui' || c.comptes_utilisateurs === 'optionnel';
  const paiement = c.paiement?.actif === true;
  const connexions = (c.connexions || []).map((x) => String(x).toLowerCase());
  const consentementCookies = c.cookies_non_essentiels === true || c.publicite === true || c.mesure_audience === 'avec-consentement';
  const mineurs = c.public_mineurs === 'oui' || c.public_mineurs === 'possible';
  const ugc = c.contenu_utilisateurs === true || c.place_de_marche === true;
  const particuliers = c.clientele !== 'professionnels';
  const vendu = c.modele_economique?.ce_qui_est_vendu || [];
  const sensibles = (c.donnees_sensibles || []).length > 0;
  const fichiers = c.televersement_fichiers === true;

  const pages = [];
  const page = (id, raison) => pages.push({ id, libelle: LIBELLES_PAGES[id], raison });
  page('politique-confidentialite', 'toujours obligatoire');
  page('declaration-accessibilite', 'toujours — obligatoire dans de nombreux pays, bonne pratique ailleurs');
  if (dans(EUROPE)) page('mentions-legales', 'établissement ou public en Europe');
  if (comptes || ugc) page('cgu', 'comptes utilisateurs, contenu publié ou place de marché');
  if (paiement) page('cgv', 'paiement actif');
  if (consentementCookies) page('cookies', 'cookies non essentiels, publicité ou mesure d’audience avec consentement');
  if (c.logiciel_saas === true && c.clientele !== 'particuliers' && dans(EUROPE)) page('dpa-clients', 'logiciel pour des clients professionnels : le projet est sous-traitant (RGPD art. 28)');

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
  const recoitDesDonnees = comptes || ugc || paiement || c.newsletter === true || fichiers || c.ia_dans_le_produit === true;
  if (recoitDesDonnees) preuve('tests_attaques', 'formulaires ou API qui reçoivent des données — tests d’attaque, règle 01, section 4', /PAYLOADS_|TOUTES_LES_CHARGES|attack-payloads/, 'les charges d’attaque (kit/web/security/attack-payloads.ts)');
  if (fichiers) preuve('controle_fichiers', 'fichiers envoyés par les utilisateurs — règle 01, section 4', /validateUpload|detectFileType/, 'le contrôle des fichiers envoyés (validateUpload)');
  // Affichages obligatoires (legal/affichages-obligatoires.md)
  const venteConsoEEE = paiement && particuliers && dans(EEE);
  const tunnelWeb = plateformes.includes('web') || c.paiement?.achats_integres_app !== true;
  if (venteConsoEEE && tunnelWeb) preuve('bouton_commande', 'vente en ligne aux consommateurs — Code conso L221-14, sinon la commande est nulle', /obligation de paiement|payer|acheter|pay now|buy now|confirm purchase/i, 'un bouton « Commande avec obligation de paiement » ou équivalent');
  if (venteConsoEEE) preuve('email_confirmation_commande', 'confirmation sur support durable avec CGV et formulaire de rétractation — L221-13', /r[ée]tractation|withdraw/i, 'les informations sur la rétractation');
  if ((c.modele_economique?.types || []).includes('abonnement') && particuliers) preuve('resiliation_abonnement', 'abonnement — résiliation en ligne en quelques clics (France L215-1-1, Allemagne, Californie)', /r[ée]sili|cancel|k[üu]ndig/i, 'la résiliation en ligne');
  if (ios || android) preuve('licences_tierces', 'app distribuée — mentions de copyright des licences open source (MIT, BSD, Apache-2.0)', /licen[cs]e/i, 'la liste des licences');
  if (forme === 'pwa') preuve('manifeste_app_web', 'app web installable sur l’écran d’accueil — regles/12-stores-applications.md', /start_url/, 'le manifeste de l’app web (start_url, icônes)');
  if (comptes || c.newsletter === true) preuve('mention_formulaire', 'formulaires qui collectent des données — RGPD art. 13 (modele mention-formulaire.md)', /confidentialit|privacy/i, 'la mention d’information avec le lien vers la politique');

  const controles = [];
  const ctrl = (niveau, cat, message) => controles.push({ niveau, cat, message });
  const sociales = connexions.filter((x) => CONNEXIONS_SOCIALES.includes(x));
  if (ios && sociales.length > 0 && !connexions.includes('apple')) {
    ctrl('erreur', 'stores', `App iOS avec connexion ${sociales.join(', ')} : ajoute « apple » (Sign in with Apple) dans connexions. C'est la façon la plus sûre de respecter la règle App Store 4.8, qui exige une connexion équivalente : nom et e-mail seulement, e-mail masquable, aucun suivi publicitaire sans consentement.`);
  }
  if (['app', 'app+site'].includes(c.projet?.type) && !forme) {
    ctrl('avertissement', 'stores', 'projet.forme_app non renseigné : demande à la personne si c’est une app web (pwa), le site affiché dans une app des stores (enveloppe) ou une vraie app (native). Les règles changent beaucoup (regles/12-stores-applications.md).');
  }
  if (forme === 'enveloppe' && ios) {
    ctrl('avertissement', 'stores', 'Site affiché dans une app iOS : Apple refuse les apps qui ne sont qu’un site reconditionné (règle App Store 4.2). Ajoute de vraies fonctions d’app (regles/12-stores-applications.md, section 2).');
  }
  if (forme === 'enveloppe' && android) {
    ctrl('avertissement', 'stores', 'Site affiché dans une app Android : Google Play exige d’être propriétaire du site affiché ou d’avoir l’autorisation de son propriétaire, et une app utile en elle-même (regles/12-stores-applications.md, section 2).');
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

  // Obligations liées au type d'activité (fiches legal/pays/union-europeenne.md et france.md).
  if (c.logiciel_saas === true && dans(EEE)) {
    ctrl('avertissement', 'data-act', "Logiciel en ligne (SaaS) dans l'UE : le Data Act impose de laisser le client partir avec toutes ses données (préavis de 2 mois maximum, export structuré, frais de changement interdits à partir du 12/01/2027). Prévois l'export et la clause dans les CGV.");
  }
  if (c.objets_connectes === true && dans(EEE)) {
    ctrl('avertissement', 'data-act', "Objet connecté dans l'UE : Data Act, informer avant l'achat des données générées et, pour les produits mis sur le marché depuis le 12/09/2026, donner à l'utilisateur l'accès à ses données.");
  }
  if (c.place_de_marche === true && dans(EEE)) {
    ctrl('avertissement', 'p2b', 'Place de marché dans l\'UE : si des vendeurs sont des professionnels, le règlement P2B (2019/1150) s\'applique. CGU vendeurs avec préavis de 15 jours, motivation des suspensions, critères de classement publiés.');
  }
  if (c.influenceurs === true) {
    if (tous.has('FR')) ctrl('avertissement', 'influence', 'Promotion par des influenceurs en France : loi 2023-451, mention « Publicité » ou « Collaboration commerciale », contrat écrit, produits interdits. Voir legal/pays/france.md.');
    else ctrl('avertissement', 'influence', 'Promotion par des influenceurs : la publicité doit toujours être signalée comme telle (pratiques commerciales déloyales). Vérifie les règles des pays visés.');
  }
  if (tous.has('CN')) {
    ctrl('avertissement', 'pays', 'Chine : PIPL (consentements séparés, transfert hors de Chine encadré, représentant local, licence ICP pour un hébergement en Chine). Avis d\'un avocat local indispensable. Voir legal/pays/asie-pacifique.md.');
  }
  if (tous.has('AU') && c.ia_dans_le_produit === true) {
    ctrl('avertissement', 'pays', 'Australie + IA : depuis le 10/12/2026, la politique de confidentialité doit expliquer les décisions automatisées qui affectent significativement les personnes (APP 1.7 à 1.9).');
  }
  if (vendu.includes('physique') && dans(EEE)) {
    ctrl('avertissement', 'produits', "Produits physiques vendus dans l'UE : règlement GPSR 2023/988. Chaque fiche produit affiche le fabricant (nom, adresse), la personne responsable dans l'UE s'il est hors UE, l'identifiant du produit et les avertissements de sécurité.");
  }
  if ((c.donnees_sensibles || []).includes('sante')) {
    ctrl('avertissement', 'sante', "Données de santé : si l'app a une finalité médicale (diagnostic, suivi d'une maladie, dose), c'est un dispositif médical (règlement 2017/745, marquage CE). Arrête-toi et demande l'avis d'un spécialiste avant de construire. Voir regles/02.");
  }
  if (ugc && tous.has('FR')) {
    ctrl('avertissement', 'conservation', 'Contenus publiés en France : conservation légale des données d’identification et de connexion (décret 2021-1362), à isoler et à purger automatiquement. Voir legal/pays/france.md.');
  }
  if (tous.has('US') && paiement && (c.modele_economique?.types || []).includes('abonnement')) {
    ctrl('avertissement', 'abonnements', 'Abonnements aux États-Unis : Californie (Automatic Renewal Law, AB 2863), consentement exprès, résiliation en ligne, rappel annuel, preuve conservée 3 ans.');
  }
  if (c.newsletter === true && tous.has('FR')) {
    ctrl('avertissement', 'emails', "E-mails vers la France : un pixel de suivi d'ouverture exige un consentement séparé (CNIL, 14/04/2026). Désactive le suivi d'ouverture, ou ajoute la case dédiée et le lien de retrait dans chaque e-mail.");
  }
  if (tous.has('IN') && mineurs) {
    ctrl('avertissement', 'pays', 'Inde + mineurs : en dessous de 18 ans, consentement parental vérifiable et ni suivi ni publicité ciblée (DPDP Act).');
  }

  // Mentions obligatoires DANS les pages légales (vérifiées par mot-clé, langues fr et en).
  // Chaque modèle de legal/modeles/ les contient déjà : une erreur signale une mention supprimée.
  const mentions = [];
  const mention = (page, langue, motif, libelle, raison) => mentions.push({ page, langue, motif, libelle, raison });
  const fr = tous.has('FR');
  const pros = c.clientele === 'professionnels' || c.clientele === 'les-deux';
  const abonnement = (c.modele_economique?.types || []).includes('abonnement');
  mention('politique-confidentialite', 'fr', /r[ée]clamation/i, 'le droit de réclamation auprès de l’autorité', 'RGPD art. 13');
  mention('politique-confidentialite', 'fr', /conserv/i, 'les durées de conservation', 'RGPD art. 13');
  mention('politique-confidentialite', 'en', /complain/i, 'the right to lodge a complaint', 'GDPR art. 13');
  mention('politique-confidentialite', 'en', /retain|retention/i, 'retention periods', 'GDPR art. 13');
  if (fr) mention('politique-confidentialite', 'fr', /d[ée]c[èe]s/i, 'les directives post-mortem (données après le décès)', 'loi Informatique et Libertés, art. 48 et 85');
  if (paysCibles.includes('CA')) mention('politique-confidentialite', 'fr', /responsable de la protection des renseignements personnels/i, 'le responsable de la protection des renseignements personnels', 'Québec, Loi 25');
  if (tous.has('US')) mention('politique-confidentialite', 'en', /do not track/i, 'the response to “Do Not Track” signals', 'CalOPPA');
  if (tous.has('US')) mention('politique-confidentialite', 'en', /global privacy control|\bGPC\b/i, 'Global Privacy Control', 'CCPA');
  if (consentementCookies) {
    mention('cookies', 'fr', /refus/i, 'les conséquences d’un refus', 'CNIL');
    mention('cookies', 'fr', /partenaire/i, 'la liste des partenaires', 'CNIL, lignes directrices 2020');
  }
  if (dans(EUROPE)) mention('mentions-legales', 'fr', /h[ée]berg/i, 'l’hébergeur', 'LCEN art. 1-1');
  if (venteConsoEEE) {
    mention('cgv', 'fr', /formulaire type de r[ée]tractation/i, 'le formulaire type de rétractation', 'Code conso L221-5 et annexe R221-1');
    mention('cgv', 'fr', /obligation de paiement/i, 'le bouton « Commande avec obligation de paiement »', 'Code conso L221-14');
    mention('cgv', 'en', /withdrawal form/i, 'the model withdrawal form', 'directive 2011/83, annex I(B)');
  }
  if (paiement && particuliers && fr) {
    mention('cgv', 'fr', /garantie l[ée]gale de conformit[ée]/i, 'la garantie légale de conformité', 'Code conso L211-1 et D211-2');
    mention('cgv', 'fr', /vices cach[ée]s/i, 'la garantie des vices cachés', 'Code civil art. 1641');
    mention('cgv', 'fr', /m[ée]diat/i, 'le médiateur de la consommation', 'Code conso L616-1');
  }
  if (paiement && abonnement) mention('cgv', 'fr', /r[ée]sili/i, 'la résiliation de l’abonnement', 'Code conso L215-1-1');
  if (paiement && abonnement && fr) mention('cgv', 'fr', /reconduction/i, 'l’information avant reconduction', 'Code conso L215-1');
  if (paiement && pros && fr) mention('cgv', 'fr', /indemnit[ée] forfaitaire/i, 'l’indemnité forfaitaire de 40 € et les pénalités de retard', 'Code de commerce L441-10');
  if (ugc && dans(EEE)) {
    mention('cgu', 'fr', /point de contact/i, 'le point de contact unique', 'DSA art. 11 et 12');
    mention('cgu', 'en', /point of contact|contact point/i, 'the single point of contact', 'DSA art. 11-12');
  }
  if (c.avis_clients === true) mention('cgu', 'fr', /avis/i, 'les modalités de contrôle des avis', 'Code conso L111-7-2');
  if (c.place_de_marche === true) mention('cgu', 'fr', /class/i, 'les critères de classement des offres', 'Code conso L111-7');

  const fichiersProjet = [
    { chemin: 'projet/brief.md', des: 1, raison: 'résultat du questionnaire' },
    { chemin: 'projet/journal.md', des: 1, raison: 'journal du projet' },
    { chemin: 'projet/veille-legale.md', des: 1, raison: 'vérification des lois sur les sources officielles' },
    { chemin: 'projet/plan.md', des: 2, raison: 'plan validé' },
    { chemin: 'projet/registre-traitements.md', des: 2, raison: 'registre des traitements de données' },
    { chemin: 'projet/licences.md', des: 2, raison: 'inventaire des licences — règle 06' },
    { chemin: 'projet/maintenance-securite.md', des: 2, raison: 'durée de support, délais de correction, rotation des clés, historique des versions — règle 01, section 13 (directive UE 2024/2853)' },
    { chemin: 'projet/sbom.cdx.json', des: 3, raison: 'liste des composants de la version publiée — règle 01, section 13' },
  ];
  if (ugc && tous.has('GB')) {
    fichiersProjet.push({ chemin: 'projet/evaluation-risques-uk.md', des: 2, raison: 'contenus échangés entre utilisateurs + Royaume-Uni : évaluation des risques de contenus illégaux et d’accès des enfants (Online Safety Act)' });
  }
  if (sensibles || (c.place_de_marche === true && paiement) || c.public_mineurs === 'oui') {
    fichiersProjet.push({ chemin: 'projet/test-intrusion.md', des: 3, raison: 'données sensibles, place de marché avec paiement ou public mineur : test d\'intrusion par un professionnel avant le lancement — règle 01, section 12' });
  }

  return { pages, preuves, controles, mentions, fichiersProjet, zones: { europe: dans(EUROPE), eee: dans(EEE) } };
}
