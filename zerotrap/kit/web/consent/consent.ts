// ZeroTrap — stockage du consentement aux cookies et traceurs (sans dépendance).
// Le choix est mémorisé sur l'appareil (strictement nécessaire), puis redemandé après DUREE_JOURS.
// Incrémente CONSENT_VERSION quand les finalités changent : le consentement est alors redemandé.

export type ConsentCategory = "mesure" | "publicite" | "contenus_tiers";
export type ConsentChoices = Record<ConsentCategory, boolean>;

type StoredConsent = { version: number; date: string; choix: ConsentChoices };

export const CONSENT_VERSION = 1;
/** Durée de conservation du choix (recommandation CNIL : 6 mois). Vérifie la règle de chaque pays. */
export const DUREE_JOURS = 182;
const STORAGE_KEY = "consentement-cookies";
export const CONSENT_CHANGE_EVENT = "consentement-change";
export const CONSENT_OPEN_EVENT = "consentement-ouvrir";

export const ALL_REFUSED: ConsentChoices = { mesure: false, publicite: false, contenus_tiers: false };

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function readConsent(): StoredConsent | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const stored = JSON.parse(raw) as StoredConsent;
    if (stored.version !== CONSENT_VERSION) return null;
    const ageDays = (Date.now() - new Date(stored.date).getTime()) / 86_400_000;
    if (!Number.isFinite(ageDays) || ageDays > DUREE_JOURS) return null;
    return { ...stored, choix: { ...ALL_REFUSED, ...stored.choix } };
  } catch {
    return null;
  }
}

export function saveConsent(choix: ConsentChoices): void {
  if (!isBrowser()) return;
  const stored: StoredConsent = { version: CONSENT_VERSION, date: new Date().toISOString(), choix };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch {
    /* stockage indisponible : le choix vaut pour la page en cours */
  }
  window.dispatchEvent(new CustomEvent<ConsentChoices>(CONSENT_CHANGE_EVENT, { detail: choix }));
}

/**
 * Signal « Global Privacy Control » envoyé par le navigateur (Firefox, Brave, extensions…).
 * Il vaut refus de la vente et du partage des données, au sens de la CCPA en Californie et d'autres
 * lois d'États américains. ZeroTrap le respecte partout : il bloque la publicité ciblée.
 */
export function globalPrivacyControlActive(): boolean {
  if (!isBrowser()) return false;
  return (window.navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true;
}

/** Vrai seulement si la personne a explicitement accepté cette catégorie (et, pour la publicité, sans signal GPC). */
export function hasConsent(category: ConsentCategory): boolean {
  if (category === "publicite" && globalPrivacyControlActive()) return false;
  return readConsent()?.choix[category] === true;
}

/** À appeler depuis un lien ou un bouton « Gérer mes cookies ». */
export function openConsentSettings(): void {
  if (isBrowser()) window.dispatchEvent(new Event(CONSENT_OPEN_EVENT));
}
