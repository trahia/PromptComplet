"use client";
// PromptComplet — bandeau de consentement aux cookies (web, React), conforme aux recommandations de la CNIL :
// - rien de non essentiel avant le consentement ;
// - « Tout refuser » aussi visible et accessible que « Tout accepter » (même style, même niveau) ;
// - fermer le bandeau = refuser ;
// - choix par finalité, modifiable à tout moment (openConsentSettings) ;
// - choix conservé 6 mois (DUREE_JOURS), puis redemandé.
// À inclure UNE SEULE FOIS dans le layout racine. Ne s'affiche pas s'il n'y a aucune catégorie non essentielle.

import { useEffect, useId, useState, type ReactNode } from "react";
import {
  ALL_REFUSED,
  CONSENT_CHANGE_EVENT,
  CONSENT_OPEN_EVENT,
  readConsent,
  saveConsent,
  type ConsentCategory,
  type ConsentChoices,
} from "./consent";
import "./consent.css";

export type ConsentCategoryInfo = { id: ConsentCategory; label: string; description: string };

export type CookieConsentProps = {
  /** Catégories non essentielles réellement utilisées par le site. Vide = pas de bandeau. */
  categories: ConsentCategoryInfo[];
  policyHref?: string;
  labels?: Partial<typeof LABELS_FR>;
  /** Facultatif : journaliser la preuve du consentement côté serveur (sans donnée personnelle superflue). */
  onChange?: (choix: ConsentChoices) => void;
};

const LABELS_FR = {
  title: "Vos choix sur les cookies",
  text: "Nous utilisons des cookies nécessaires au fonctionnement du site. Avec votre accord, nous utilisons aussi d'autres cookies pour les finalités ci-dessous. Vous pouvez changer d'avis à tout moment via « Gérer mes cookies ».",
  refuseAll: "Tout refuser",
  acceptAll: "Tout accepter",
  customize: "Personnaliser",
  save: "Enregistrer mes choix",
  close: "Fermer (refuser)",
  policy: "Politique cookies",
};

export function CookieConsent({ categories, policyHref = "/legal/cookies", labels: custom, onChange }: CookieConsentProps) {
  const labels = { ...LABELS_FR, ...custom };
  const [visible, setVisible] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [draft, setDraft] = useState<ConsentChoices>(ALL_REFUSED);
  const titleId = useId();

  useEffect(() => {
    if (categories.length === 0) return;
    const stored = readConsent();
    if (!stored) setVisible(true);
    else setDraft(stored.choix);
    const reopen = () => {
      setDraft(readConsent()?.choix ?? ALL_REFUSED);
      setCustomizing(true);
      setVisible(true);
    };
    window.addEventListener(CONSENT_OPEN_EVENT, reopen);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, reopen);
  }, [categories.length]);

  if (categories.length === 0 || !visible) return null;

  const decide = (choix: ConsentChoices) => {
    saveConsent(choix);
    onChange?.(choix);
    setVisible(false);
    setCustomizing(false);
  };
  const all = (value: boolean): ConsentChoices => {
    const choix = { ...ALL_REFUSED };
    for (const c of categories) choix[c.id] = value;
    return choix;
  };

  return (
    <section className="cc-banner" role="region" aria-labelledby={titleId}>
      <div className="cc-header">
        <h2 id={titleId}>{labels.title}</h2>
        <button type="button" className="cc-close" aria-label={labels.close} onClick={() => decide(all(false))}>
          <span aria-hidden="true">×</span>
        </button>
      </div>
      <p>
        {labels.text} <a href={policyHref}>{labels.policy}</a>
      </p>

      {customizing && (
        <ul className="cc-categories">
          {categories.map((c) => (
            <li key={c.id}>
              <label>
                <input
                  type="checkbox"
                  checked={draft[c.id]}
                  onChange={(e) => setDraft({ ...draft, [c.id]: e.target.checked })}
                />
                <span>
                  <strong>{c.label}</strong> — {c.description}
                </span>
              </label>
            </li>
          ))}
        </ul>
      )}

      <div className="cc-actions">
        <button type="button" className="cc-button" onClick={() => decide(all(false))}>
          {labels.refuseAll}
        </button>
        {customizing ? (
          <button type="button" className="cc-button" onClick={() => decide(draft)}>
            {labels.save}
          </button>
        ) : (
          <button type="button" className="cc-button" onClick={() => setCustomizing(true)}>
            {labels.customize}
          </button>
        )}
        <button type="button" className="cc-button" onClick={() => decide(all(true))}>
          {labels.acceptAll}
        </button>
      </div>
    </section>
  );
}

/** Vrai quand la catégorie est acceptée ; se met à jour en direct. */
export function useConsent(category: ConsentCategory): boolean {
  const [granted, setGranted] = useState(false);
  useEffect(() => {
    const refresh = () => setGranted(readConsent()?.choix[category] === true);
    refresh();
    window.addEventListener(CONSENT_CHANGE_EVENT, refresh);
    return () => window.removeEventListener(CONSENT_CHANGE_EVENT, refresh);
  }, [category]);
  return granted;
}

/** N'affiche un contenu tiers (vidéo, carte, réseau social) qu'après consentement. */
export function ConsentGate({
  category = "contenus_tiers",
  children,
  label = "Ce contenu est fourni par un service tiers qui peut déposer des cookies.",
  allowLabel = "Autoriser et afficher",
}: {
  category?: ConsentCategory;
  children: ReactNode;
  label?: string;
  allowLabel?: string;
}) {
  const granted = useConsent(category);
  if (granted) return <>{children}</>;
  return (
    <div className="cc-gate">
      <p>{label}</p>
      <button
        type="button"
        className="cc-button"
        onClick={() => saveConsent({ ...(readConsent()?.choix ?? ALL_REFUSED), [category]: true })}
      >
        {allowLabel}
      </button>
    </div>
  );
}
