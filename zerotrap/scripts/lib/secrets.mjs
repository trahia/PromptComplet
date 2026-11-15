// ZeroTrap — détection de secrets (clés, jetons, mots de passe).
// Partagé par le hook d'écriture, le hook de commandes, le pre-commit et le script de conformité.

/** Valeurs manifestement fictives : on ne les signale pas. */
const FICTIF = /(x{5,}|\*{4,}|\.{3}|<[^>]{1,40}>|\$\{|\{\{|your[_-]?|votre|example|exemple|placeholder|changeme|change[_-]me|dummy|fake|redacted|0{12,})/i;

/** Hôtes de développement local (mots de passe par défaut acceptés). */
const HOTE_LOCAL = /@(localhost|127\.0\.0\.1|0\.0\.0\.0|host\.docker\.internal|db|postgres|supabase_db[\w-]*)(:\d+)?(\/|$)/i;

export const MOTIFS = [
  { nom: 'clé privée', re: /-----BEGIN (?:RSA |EC |DSA |OPENSSH |PGP |ENCRYPTED )?PRIVATE KEY(?: BLOCK)?-----/g, bloquant: true },
  { nom: "clé d'accès AWS", re: /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/g, bloquant: true },
  { nom: 'clé secrète Stripe', re: /\b(?:sk|rk)_(?:live|test)_[0-9a-zA-Z]{20,}\b/g, bloquant: true },
  { nom: 'secret de webhook Stripe', re: /\bwhsec_[0-9a-zA-Z]{24,}\b/g, bloquant: true },
  { nom: 'jeton GitHub', re: /\b(?:ghp|gho|ghu|ghs|ghr)_[0-9A-Za-z]{36,}\b/g, bloquant: true },
  { nom: 'jeton GitHub (fine-grained)', re: /\bgithub_pat_[0-9A-Za-z_]{60,}\b/g, bloquant: true },
  { nom: 'jeton Slack', re: /\bxox[abprs]-[0-9A-Za-z-]{10,}\b/g, bloquant: true },
  { nom: 'clé Anthropic', re: /\bsk-ant-[A-Za-z0-9_-]{30,}\b/g, bloquant: true },
  { nom: 'clé OpenAI', re: /\bsk-(?:proj|svcacct|admin)-[A-Za-z0-9_-]{30,}\b/g, bloquant: true },
  { nom: 'clé SendGrid', re: /\bSG\.[A-Za-z0-9_-]{16,}\.[A-Za-z0-9_-]{30,}\b/g, bloquant: true },
  { nom: 'clé secrète Supabase', re: /\bsb_secret_[A-Za-z0-9_-]{20,}\b/g, bloquant: true },
  { nom: 'jeton npm', re: /\bnpm_[A-Za-z0-9]{36}\b/g, bloquant: true },
  { nom: 'clé API Twilio', re: /\bSK[0-9a-f]{32}\b/g, bloquant: true },
  { nom: 'mot de passe dans une URL', re: /\b[a-z][a-z0-9+.-]{1,20}:\/\/[^\s:@/'"`]{1,64}:([^\s:@/'"`]{8,})@[^\s/'"`]+/gi, bloquant: true, url: true },
  // Les clés Google « AIza… » sont souvent publiques par conception (Firebase) : simple avertissement.
  { nom: 'clé API Google (à restreindre)', re: /\bAIza[0-9A-Za-z_-]{35}\b/g, bloquant: false },
];

/** Masque un secret pour l'afficher sans le révéler. */
export function masquer(valeur) {
  const v = String(valeur);
  return v.length <= 8 ? '••••' : `${v.slice(0, 6)}…(${v.length} caractères)`;
}

/**
 * Cherche des secrets dans un texte.
 * @returns {{nom:string, bloquant:boolean, ligne:number, extrait:string}[]}
 */
export function scannerTexte(texte, { max = 20 } = {}) {
  if (typeof texte !== 'string' || texte.length === 0) return [];
  if (texte.includes('\u0000')) return []; // binaire
  const trouves = [];
  for (const motif of MOTIFS) {
    motif.re.lastIndex = 0;
    let m;
    while ((m = motif.re.exec(texte)) !== null) {
      const valeur = m[0];
      if (motif.url) {
        const mdp = m[1] || '';
        if (FICTIF.test(mdp) || HOTE_LOCAL.test(valeur) || /^(postgres|password|root|admin|secret|motdepasse)$/i.test(mdp)) continue;
      } else if (FICTIF.test(valeur)) {
        continue;
      }
      const ligne = texte.slice(0, m.index).split('\n').length;
      trouves.push({ nom: motif.nom, bloquant: motif.bloquant, ligne, extrait: masquer(valeur) });
      if (trouves.length >= max) return trouves;
    }
  }
  return trouves;
}
