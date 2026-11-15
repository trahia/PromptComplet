// ZeroTrap — détection de code dangereux : injection SQL, XSS, injection de commandes, TLS désactivé,
// redirection ouverte… Utilisé par le verrou d'écriture (hook), le contrôle avant commit, la vérification
// de conformité et l'audit (scripts/analyser-code.mjs).
//
// Analyse ligne par ligne, volontairement simple et prudente. Elle bloque les erreurs les plus
// fréquentes au moment où le code est écrit. Elle ne remplace ni Semgrep (CI), ni les tests d'attaque
// (règle 01, section 4), ni un test d'intrusion humain.

import fs from 'node:fs';
import path from 'node:path';

/** Fichiers de code analysés. */
export const EXTENSIONS_CODE = /\.(m?[jt]sx?|c[jt]s|vue|svelte|astro|html?|py)$/i;

/** Dossiers jamais analysés : dépendances, fichiers générés, méthode ZeroTrap elle-même. */
const DOSSIERS_IGNORES = new Set(['node_modules', 'dist', 'build', 'out', 'coverage', 'vendor', '.next', '.nuxt',
  '.svelte-kit', '.expo', '.vercel', '.turbo', '.git', 'zerotrap', '.claude', '.githooks', '.zerotrap-source']);

/** Commentaire qui autorise une exception, sur la ligne concernée ou juste au-dessus. */
export const MARQUEUR_EXCEPTION = 'zerotrap-exception:';
const RE_EXCEPTION = /zerotrap-exception:\s*(.{10,})/i;

const SQL = String.raw`(?:SELECT\b[^\x60'"]*\bFROM\b|INSERT\s+INTO\b|UPDATE\s+[\w."]+\s+SET\b|DELETE\s+FROM\b)`;
const ASSAINI = /\b(?:sanitize|purify|escapeHtml|escape)\s*\(/i;

/**
 * Chaque règle : motif sur une ligne ; « sauf » (facultatif) annule si présent dans la fenêtre ;
 * « fenetre » = nombre de lignes suivantes regardées pour « sauf » ; « py » = Python seulement.
 */
export const REGLES_CODE = [
  { id: 'eval', titre: 'du texte exécuté comme du code (eval)', motif: /(^|[^\w.$])eval\s*\(/,
    conseil: 'Supprime eval : utilise JSON.parse pour des données, ou une vraie fonction.' },
  { id: 'new-function', titre: 'du texte exécuté comme du code (new Function)', motif: /\bnew\s+Function\s*\(/,
    conseil: 'Écris une vraie fonction au lieu de construire du code à partir de texte.' },
  { id: 'minuteur-chaine', titre: 'setTimeout/setInterval avec du texte (exécuté comme du code)', motif: /\bset(?:Timeout|Interval)\s*\(\s*['"\x60]/,
    conseil: 'Passe une fonction, pas une chaîne de caractères.' },
  { id: 'inner-html', titre: 'HTML injecté sans nettoyage (innerHTML/outerHTML) — risque de XSS', motif: /\.(?:inner|outer)HTML\s*\+?=(?!=)/,
    sauf: /=\s*(['"\x60])\1|\b(?:sanitize|purify)\s*\(/i,
    conseil: 'Utilise textContent pour du texte, ou DOMPurify.sanitize() si du HTML est vraiment nécessaire.' },
  { id: 'insert-adjacent-html', titre: 'HTML injecté sans nettoyage (insertAdjacentHTML) — risque de XSS', motif: /\.insertAdjacentHTML\s*\(/, sauf: ASSAINI,
    conseil: 'Crée les éléments avec createElement/textContent, ou nettoie avec DOMPurify.sanitize().' },
  { id: 'document-write', titre: 'document.write — risque de XSS', motif: /\bdocument\.write(?:ln)?\s*\(/,
    conseil: 'Crée les éléments avec createElement/textContent.' },
  { id: 'dangerously-set-inner-html', titre: 'dangerouslySetInnerHTML sans nettoyage — risque de XSS', motif: /dangerouslySetInnerHTML/, fenetre: 3, sauf: ASSAINI,
    conseil: 'Affiche le texte normalement dans le JSX (échappement automatique), ou nettoie avec DOMPurify.sanitize().' },
  { id: 'v-html', titre: 'v-html sans nettoyage (Vue) — risque de XSS', motif: /\bv-html\s*=/, sauf: ASSAINI,
    conseil: 'Utilise {{ }} (échappement automatique), ou nettoie avec DOMPurify.sanitize().' },
  { id: 'svelte-html', titre: '{@html} sans nettoyage (Svelte) — risque de XSS', motif: /\{@html\s/, sauf: ASSAINI,
    conseil: 'Affiche le texte normalement, ou nettoie avec DOMPurify.sanitize().' },
  { id: 'sql-non-protege', titre: 'requête SQL brute non protégée — risque d’injection SQL', motif: /\$(?:query|execute)RawUnsafe\s*\(|\bPrisma\.raw\s*\(|\bsql\.raw\s*\(/,
    conseil: 'Utilise la version paramétrée : $queryRaw`... ${valeur}` (Prisma), sql`... ${valeur}` (Drizzle, postgres.js), ou le constructeur de requêtes de l’ORM.' },
  { id: 'sql-gabarit', titre: 'requête SQL construite avec ${…} — risque d’injection SQL', motif: new RegExp(String.raw`(^|[^\w$.])\x60\s*${SQL}[^\x60]*\$\{`, 'i'),
    conseil: 'Ne mets jamais une valeur directement dans le texte SQL : utilise une requête paramétrée (sql`…` étiqueté, $queryRaw`…`, placeholders ? ou $1).' },
  { id: 'sql-concatenation', titre: 'requête SQL construite par concaténation (+) — risque d’injection SQL', motif: new RegExp(String.raw`(['"])\s*${SQL}[^'"]*\1\s*\+`, 'i'),
    conseil: 'Utilise une requête paramétrée (placeholders ? ou $1) au lieu de coller des valeurs dans le texte SQL.' },
  { id: 'requete-brute-gabarit', titre: 'requête brute avec ${…} (raw/query/execute/unsafe) — risque d’injection', motif: /\.(?:raw|query|execute|unsafe)\s*\(\s*\x60[^\x60]*\$\{/,
    conseil: 'Passe les valeurs séparément : knex.raw("… ?", [valeur]), sequelize.query("… :x", { replacements }), ou un gabarit sql`…` étiqueté.' },
  { id: 'filtre-postgrest', titre: 'filtre Supabase/PostgREST construit avec ${…} (.or/.filter) — risque d’injection de filtre', motif: /\.(?:or|filter|textSearch)\s*\(\s*\x60[^\x60]*\$\{/,
    conseil: 'Utilise les méthodes dédiées (.eq, .ilike, .in…) avec la valeur en paramètre, ou valide strictement la valeur (liste blanche) avant.' },
  { id: 'sql-python', titre: 'requête SQL Python formatée (f-string, %, format) — risque d’injection SQL', py: true,
    motif: /\.execute(?:many)?\s*\(\s*f['"]|\.execute(?:many)?\s*\([^)]*['"]\s*%\s*[\w(]|\.execute(?:many)?\s*\([^)]*\.format\s*\(/,
    conseil: 'Passe les valeurs en second argument : cursor.execute("… WHERE id = %s", (valeur,)).' },
  { id: 'commande-construite', titre: 'commande système construite avec des variables — risque d’injection de commande', motif: /\b(?:exec|execSync)\s*\(\s*(?:\x60[^\x60]*\$\{|(['"])[^'"]*\1\s*\+)/,
    conseil: 'Utilise execFile/spawn avec une liste d’arguments (sans shell), et valide chaque argument (liste blanche).' },
  { id: 'shell-active', titre: 'commande lancée avec un shell (shell: true) — risque d’injection de commande', motif: /\bshell\s*:\s*true\b|\bshell\s*=\s*True\b/,
    conseil: 'Lance la commande sans shell, avec une liste d’arguments.' },
  { id: 'os-system', titre: 'os.system/os.popen — risque d’injection de commande', py: true, motif: /\bos\.(?:system|popen)\s*\(/,
    conseil: 'Utilise subprocess.run([...], shell=False) avec une liste d’arguments.' },
  { id: 'tls-desactive', titre: 'vérification des certificats TLS désactivée', motif: /rejectUnauthorized\s*:\s*false|NODE_TLS_REJECT_UNAUTHORIZED\s*=\s*['"]?0|\bverify\s*=\s*False\b/,
    conseil: 'Ne désactive jamais la vérification TLS : corrige le certificat ou la configuration.' },
  { id: 'redirection-ouverte', titre: 'redirection vers une adresse fournie par l’utilisateur — risque de redirection ouverte (phishing)', motif: /\bredirect\s*\(\s*(?:req\.(?:query|body|params)|request\.(?:args|GET|POST|form)|(?:url\.)?searchParams\.get\s*\()/,
    conseil: 'N’accepte que des chemins internes (qui commencent par un seul « / ») ou une liste blanche de destinations.' },
];

function estCommentaire(ligne, py) {
  const t = ligne.trim();
  return t.startsWith('//') || t.startsWith('/*') || t.startsWith('*') || t.startsWith('<!--') || (py && t.startsWith('#'));
}

/**
 * Analyse un texte de code.
 * @returns {{ problemes: {regle:string, titre:string, conseil:string, ligne:number, extrait:string}[],
 *             exceptions: {regle:string, titre:string, ligne:number, raison:string}[] }}
 */
export function analyserCode(texte, chemin = '') {
  const py = /\.py$/i.test(chemin);
  const lignes = String(texte).split(/\r?\n/);
  const problemes = [];
  const exceptions = [];
  lignes.forEach((ligne, i) => {
    if (estCommentaire(ligne, py) || ligne.length > 2000) return;
    for (const r of REGLES_CODE) {
      if (r.py && !py) continue;
      if (!r.motif.test(ligne)) continue;
      const fenetre = lignes.slice(i, i + 1 + (r.fenetre || 0)).join('\n');
      if (r.sauf && r.sauf.test(fenetre)) continue;
      const exc = RE_EXCEPTION.exec(ligne) || (i > 0 ? RE_EXCEPTION.exec(lignes[i - 1]) : null);
      if (exc) exceptions.push({ regle: r.id, titre: r.titre, ligne: i + 1, raison: exc[1].trim().slice(0, 200) });
      else problemes.push({ regle: r.id, titre: r.titre, conseil: r.conseil, ligne: i + 1, extrait: ligne.trim().slice(0, 160) });
      break; // un seul signalement par ligne
    }
  });
  return { problemes, exceptions };
}

/** Le fichier doit-il être analysé ? (chemin relatif à la racine du projet, barres obliques) */
export function doitAnalyser(rel) {
  const n = String(rel).replace(/\\/g, '/');
  if (!EXTENSIONS_CODE.test(n) || /\.min\.js$/i.test(n)) return false;
  return !n.split('/').slice(0, -1).some((d) => DOSSIERS_IGNORES.has(d));
}

/** Analyse tous les fichiers de code d'un dossier (lecture seule). */
export function analyserDossier(racine, { tailleMax = 1024 * 1024 } = {}) {
  const resultats = [];
  const parcourir = (d, prefixe) => {
    let entrees;
    try { entrees = fs.readdirSync(d, { withFileTypes: true }); } catch { return; }
    for (const e of entrees) {
      const rel = prefixe ? `${prefixe}/${e.name}` : e.name;
      const abs = path.join(d, e.name);
      if (e.isDirectory()) { if (!DOSSIERS_IGNORES.has(e.name)) parcourir(abs, rel); continue; }
      if (!e.isFile() || !doitAnalyser(rel)) continue;
      let st; try { st = fs.statSync(abs); } catch { continue; }
      if (st.size > tailleMax) continue;
      let texte; try { texte = fs.readFileSync(abs, 'utf8'); } catch { continue; }
      const r = analyserCode(texte, rel);
      if (r.problemes.length || r.exceptions.length) resultats.push({ fichier: rel, ...r });
    }
  };
  parcourir(racine, '');
  return resultats;
}
