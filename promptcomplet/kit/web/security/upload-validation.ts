// PromptComplet — contrôle des fichiers envoyés par les utilisateurs (règle 01, section 4).
//
// À appeler CÔTÉ SERVEUR (route API, Server Action, fonction Edge), sur les octets reçus, AVANT
// tout stockage. Le nom, l'extension et le type annoncés par le navigateur ne sont jamais fiables :
// seule la signature du fichier (ses premiers octets) compte.
//
// Ce contrôle ne suffit pas seul. Il faut aussi :
//   - réencoder les images (ex. `sharp`, qui retire les métadonnées EXIF, dont le GPS, par défaut) ;
//   - analyser les PDF avec un antivirus avant de les montrer à d'autres personnes ;
//   - stocker dans un espace privé et servir avec `downloadHeaders()`.
// Aucune dépendance.

export type AllowedType = "image/jpeg" | "image/png" | "image/webp" | "image/gif" | "application/pdf";

interface Signature {
  type: AllowedType;
  ext: string;
  test: (b: Uint8Array) => boolean;
}

function startsWith(bytes: Uint8Array, prefix: readonly number[], offset = 0): boolean {
  if (bytes.length < offset + prefix.length) return false;
  for (let i = 0; i < prefix.length; i++) if (bytes[offset + i] !== prefix[i]) return false;
  return true;
}

const SIGNATURES: readonly Signature[] = [
  { type: "image/jpeg", ext: "jpg", test: (b) => startsWith(b, [0xff, 0xd8, 0xff]) },
  { type: "image/png", ext: "png", test: (b) => startsWith(b, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]) },
  // GIF87a / GIF89a
  { type: "image/gif", ext: "gif", test: (b) => startsWith(b, [0x47, 0x49, 0x46, 0x38]) && (b[4] === 0x37 || b[4] === 0x39) && b[5] === 0x61 },
  // "RIFF" .... "WEBP"
  { type: "image/webp", ext: "webp", test: (b) => startsWith(b, [0x52, 0x49, 0x46, 0x46]) && startsWith(b, [0x57, 0x45, 0x42, 0x50], 8) },
  // "%PDF-"
  { type: "application/pdf", ext: "pdf", test: (b) => startsWith(b, [0x25, 0x50, 0x44, 0x46, 0x2d]) },
];

/** Détecte le vrai type d'un fichier d'après sa signature. `null` si le type est inconnu. */
export function detectFileType(bytes: Uint8Array): { type: AllowedType; ext: string } | null {
  for (const s of SIGNATURES) if (s.test(bytes)) return { type: s.type, ext: s.ext };
  return null;
}

export interface UploadRules {
  /** Liste blanche. Ne jamais y mettre de SVG, de HTML ou d'archive. */
  allowed: readonly AllowedType[];
  /** Taille maximale en octets (ex. 5 * 1024 * 1024 pour 5 Mo). */
  maxBytes: number;
}

export type UploadCheck =
  | { ok: true; type: AllowedType; ext: string; storageName: string }
  | { ok: false; reason: "vide" | "trop-gros" | "type-inconnu" | "type-refuse" };

/**
 * Valide un fichier reçu. En cas de succès, renvoie un nom de stockage aléatoire : on ne
 * réutilise jamais le nom choisi par l'utilisateur, qui peut contenir des chemins ou du code.
 * Les messages affichés à l'utilisateur sont à traduire ; `reason` sert au code et aux journaux.
 */
export function validateUpload(bytes: Uint8Array, rules: UploadRules): UploadCheck {
  if (bytes.length === 0) return { ok: false, reason: "vide" };
  if (bytes.length > rules.maxBytes) return { ok: false, reason: "trop-gros" };
  const detected = detectFileType(bytes);
  if (!detected) return { ok: false, reason: "type-inconnu" };
  if (!rules.allowed.includes(detected.type)) return { ok: false, reason: "type-refuse" };
  return { ok: true, type: detected.type, ext: detected.ext, storageName: `${globalThis.crypto.randomUUID()}.${detected.ext}` };
}

/**
 * En-têtes pour servir un fichier envoyé par un utilisateur : téléchargement forcé, pas
 * d'interprétation du type par le navigateur, aucun script exécuté même si le fichier est piégé.
 * Pour afficher une image réencodée dans une page, `inline` est acceptable : le reste ne change pas.
 */
export function downloadHeaders(type: AllowedType, disposition: "attachment" | "inline" = "attachment"): Record<string, string> {
  return {
    "Content-Type": type,
    "Content-Disposition": disposition,
    "X-Content-Type-Options": "nosniff",
    "Content-Security-Policy": "default-src 'none'; sandbox",
    "Cache-Control": "private, no-store",
  };
}
