"use client";
// ZeroTrap — liens légaux du pied de page (une seule fois, dans le layout racine).
// Passe la liste des pages exigées par la matrice d'obligations (node zerotrap/scripts/verifier-conformite.mjs --json).

import { openConsentSettings } from "../consent/consent";
import { LEGAL_PAGES, type LegalPageId } from "./legal-pages";

export type LegalLinksProps = {
  pages: LegalPageId[];
  basePath?: string;
  /** Affiche « Gérer mes cookies » (obligatoire si un bandeau de consentement existe). */
  showCookieSettings?: boolean;
  labels?: Partial<Record<LegalPageId | "cookieSettings" | "nav", string>>;
};

export function LegalLinks({ pages, basePath = "/legal", showCookieSettings = false, labels = {} }: LegalLinksProps) {
  return (
    <nav aria-label={labels.nav ?? "Informations légales"} className="legal-links">
      <ul>
        {pages.map((page) => (
          <li key={page}>
            <a href={`${basePath}/${page}`}>{labels[page] ?? LEGAL_PAGES[page]}</a>
          </li>
        ))}
        {showCookieSettings && (
          <li>
            <button type="button" className="legal-links__button" onClick={openConsentSettings}>
              {labels.cookieSettings ?? "Gérer mes cookies"}
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}
