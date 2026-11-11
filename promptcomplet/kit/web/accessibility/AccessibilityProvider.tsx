"use client";
// PromptComplet — module d'accessibilité (web, React).
// À inclure UNE SEULE FOIS dans le layout racine, avec <main id="contenu"> autour du contenu :
//   <AccessibilityProvider declarationHref="/legal/declaration-accessibilite" />
// Il complète l'accessibilité du code (WCAG 2.2 AA dans chaque composant), il ne la remplace pas.
// Les préférences restent sur l'appareil (localStorage) : réglage demandé par l'utilisateur, sans consentement requis.

import { useEffect, useId, useRef, useState } from "react";
import "./accessibility.css";

type TextScale = 100 | 115 | 130 | 150;

type Preferences = {
  textScale: TextScale;
  contrast: boolean;
  readableFont: boolean;
  spacing: boolean;
  underlineLinks: boolean;
  reduceMotion: boolean;
  bigCursor: boolean;
};

type ToggleKey = Exclude<keyof Preferences, "textScale">;

const SCALES: readonly TextScale[] = [100, 115, 130, 150];
const STORAGE_KEY = "a11y-preferences";
const DEFAULTS: Preferences = {
  textScale: 100,
  contrast: false,
  readableFont: false,
  spacing: false,
  underlineLinks: false,
  reduceMotion: false,
  bigCursor: false,
};

export type AccessibilityLabels = {
  skipLink: string;
  open: string;
  title: string;
  close: string;
  textSize: string;
  decrease: string;
  increase: string;
  contrast: string;
  readableFont: string;
  spacing: string;
  underlineLinks: string;
  reduceMotion: string;
  bigCursor: string;
  readAloud: string;
  stopReading: string;
  reset: string;
  declaration: string;
  speechUnavailable: string;
};

export const LABELS_FR: AccessibilityLabels = {
  skipLink: "Aller au contenu",
  open: "Ouvrir les options d'accessibilité",
  title: "Accessibilité",
  close: "Fermer les options d'accessibilité",
  textSize: "Taille du texte",
  decrease: "Réduire la taille du texte",
  increase: "Agrandir la taille du texte",
  contrast: "Contraste renforcé",
  readableFont: "Police plus lisible",
  spacing: "Espacement du texte",
  underlineLinks: "Souligner les liens",
  reduceMotion: "Réduire les animations",
  bigCursor: "Grand curseur",
  readAloud: "Lire la page à voix haute",
  stopReading: "Arrêter la lecture",
  reset: "Réinitialiser",
  declaration: "Déclaration d'accessibilité",
  speechUnavailable: "La lecture à voix haute n'est pas disponible sur ce navigateur.",
};

const TOGGLES: readonly ToggleKey[] = ["contrast", "readableFont", "spacing", "underlineLinks", "reduceMotion", "bigCursor"];

function loadPreferences(): Preferences {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw) as Partial<Preferences>;
    const next: Preferences = { ...DEFAULTS };
    if (SCALES.includes(parsed.textScale as TextScale)) next.textScale = parsed.textScale as TextScale;
    for (const key of TOGGLES) next[key] = parsed[key] === true;
    return next;
  } catch {
    return DEFAULTS;
  }
}

function savePreferences(p: Preferences): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    /* stockage indisponible (navigation privée) : les préférences valent pour cette page */
  }
}

function applyPreferences(p: Preferences): void {
  const el = document.documentElement;
  el.style.setProperty("--a11y-text-scale", String(p.textScale / 100));
  const set = (name: string, on: boolean, value: string) => {
    if (on) el.setAttribute(name, value);
    else el.removeAttribute(name);
  };
  set("data-a11y-contrast", p.contrast, "high");
  set("data-a11y-font", p.readableFont, "readable");
  set("data-a11y-spacing", p.spacing, "large");
  set("data-a11y-links", p.underlineLinks, "underline");
  set("data-a11y-motion", p.reduceMotion, "reduce");
  set("data-a11y-cursor", p.bigCursor, "large");
}

export type AccessibilityProviderProps = {
  /** Lien vers la déclaration d'accessibilité (page légale obligatoire). */
  declarationHref?: string;
  /** id de l'élément <main> (cible du lien « Aller au contenu » et de la lecture à voix haute). */
  contentId?: string;
  /** Langue de la synthèse vocale (par défaut : attribut lang de <html>). */
  lang?: string;
  /** Textes traduits (par défaut : français). */
  labels?: Partial<AccessibilityLabels>;
};

export function AccessibilityProvider({
  declarationHref = "/legal/declaration-accessibilite",
  contentId = "contenu",
  lang,
  labels: customLabels,
}: AccessibilityProviderProps) {
  const labels = { ...LABELS_FR, ...customLabels };
  const toggleLabels: Record<ToggleKey, string> = {
    contrast: labels.contrast,
    readableFont: labels.readableFont,
    spacing: labels.spacing,
    underlineLinks: labels.underlineLinks,
    reduceMotion: labels.reduceMotion,
    bigCursor: labels.bigCursor,
  };
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState<Preferences>(DEFAULTS);
  const [speaking, setSpeaking] = useState(false);
  const [status, setStatus] = useState("");
  const panelId = useId();
  const titleId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const p = loadPreferences();
    setPrefs(p);
    applyPreferences(p);
    return () => {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector<HTMLElement>("button, a")?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const update = (patch: Partial<Preferences>) => {
    const next = { ...prefs, ...patch };
    setPrefs(next);
    applyPreferences(next);
    savePreferences(next);
  };

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  const scaleIndex = SCALES.indexOf(prefs.textScale);

  const readAloud = () => {
    if (!("speechSynthesis" in window)) {
      setStatus(labels.speechUnavailable);
      return;
    }
    const root = document.getElementById(contentId) ?? document.querySelector("main") ?? document.body;
    const text = (root.innerText || "").replace(/\s+/g, " ").trim().slice(0, 30000);
    if (!text) return;
    window.speechSynthesis.cancel();
    // Découpage en phrases : certains navigateurs coupent les lectures longues.
    const chunks = text.match(/[^.!?]+[.!?]*/g) ?? [text];
    const language = lang || document.documentElement.lang || "fr";
    chunks.forEach((chunk, index) => {
      const utterance = new SpeechSynthesisUtterance(chunk.trim());
      utterance.lang = language;
      if (index === chunks.length - 1) utterance.onend = () => setSpeaking(false);
      window.speechSynthesis.speak(utterance);
    });
    setSpeaking(true);
  };

  const stopReading = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  return (
    <>
      <a className="a11y-skip-link" href={`#${contentId}`}>
        {labels.skipLink}
      </a>
      <button
        ref={triggerRef}
        type="button"
        className="a11y-trigger"
        aria-label={labels.open}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
      >
        <AccessibilityIcon />
      </button>
      {open && (
        <div ref={panelRef} id={panelId} className="a11y-panel" role="dialog" aria-modal="false" aria-labelledby={titleId}>
          <div className="a11y-panel__header">
            <h2 id={titleId}>{labels.title}</h2>
            <button type="button" className="a11y-close" aria-label={labels.close} onClick={close}>
              <span aria-hidden="true">×</span>
            </button>
          </div>

          <fieldset className="a11y-scale">
            <legend>{labels.textSize}</legend>
            <button
              type="button"
              aria-label={labels.decrease}
              disabled={scaleIndex <= 0}
              onClick={() => update({ textScale: SCALES[Math.max(0, scaleIndex - 1)] })}
            >
              A−
            </button>
            <output aria-live="polite">{prefs.textScale} %</output>
            <button
              type="button"
              aria-label={labels.increase}
              disabled={scaleIndex >= SCALES.length - 1}
              onClick={() => update({ textScale: SCALES[Math.min(SCALES.length - 1, scaleIndex + 1)] })}
            >
              A+
            </button>
          </fieldset>

          <ul className="a11y-toggles">
            {TOGGLES.map((key) => (
              <li key={key}>
                <button type="button" aria-pressed={prefs[key]} onClick={() => update({ [key]: !prefs[key] })}>
                  {toggleLabels[key]}
                </button>
              </li>
            ))}
          </ul>

          <div className="a11y-speech">
            {speaking ? (
              <button type="button" onClick={stopReading}>
                {labels.stopReading}
              </button>
            ) : (
              <button type="button" onClick={readAloud}>
                {labels.readAloud}
              </button>
            )}
          </div>
          <p role="status" className="a11y-status">
            {status}
          </p>

          <div className="a11y-panel__footer">
            <button type="button" onClick={() => update(DEFAULTS)}>
              {labels.reset}
            </button>
            <a href={declarationHref}>{labels.declaration}</a>
          </div>
        </div>
      )}
    </>
  );
}

/** Icône dessinée pour PromptComplet (personne dans un cercle) : aucun logo protégé n'est reproduit. */
function AccessibilityIcon() {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="28" height="28">
      <circle cx="12" cy="12" r="10.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="6.6" r="1.7" fill="currentColor" />
      <path
        d="M6.6 9.3 12 10.5l5.4-1.2M12 10.5v4.1m0 0-2.7 4.7M12 14.6l2.7 4.7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
