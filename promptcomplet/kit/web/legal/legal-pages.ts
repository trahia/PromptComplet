// PromptComplet — liste des pages légales (source unique : legal/<langue>/<page>.md).

export const LEGAL_PAGES = {
  "mentions-legales": "Mentions légales",
  "politique-confidentialite": "Politique de confidentialité",
  cgu: "Conditions générales d'utilisation",
  cgv: "Conditions générales de vente",
  cookies: "Politique cookies",
  "declaration-accessibilite": "Déclaration d'accessibilité",
  // Seulement pour un logiciel vendu à des professionnels (RGPD art. 28) : à lier depuis les CGV ou l'espace client.
  "dpa-clients": "Accord de traitement des données",
} as const;

export type LegalPageId = keyof typeof LEGAL_PAGES;

export function isLegalPageId(value: string): value is LegalPageId {
  return Object.prototype.hasOwnProperty.call(LEGAL_PAGES, value);
}

export function isLanguageCode(value: string): boolean {
  return /^[a-z]{2,3}(-[A-Z]{2})?$/.test(value);
}
