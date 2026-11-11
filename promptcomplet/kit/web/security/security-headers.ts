// PromptComplet — en-têtes de sécurité HTTP et Content-Security-Policy à nonce (sans dépendance).
// Utilisé par le proxy / middleware (voir proxy.example.ts). Règle 01, section 5.

export type CspOptions = {
  nonce: string;
  isDev?: boolean;
  /** URL du projet Supabase (NEXT_PUBLIC_SUPABASE_URL), pour l'API et le temps réel. */
  supabaseUrl?: string;
  /** Active les domaines de Stripe (Checkout, Elements, 3-D Secure). */
  stripe?: boolean;
  extra?: Partial<Record<"script-src" | "style-src" | "img-src" | "connect-src" | "frame-src" | "font-src" | "media-src", string[]>>;
};

export function generateNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

export function buildCsp({ nonce, isDev = false, supabaseUrl, stripe = false, extra = {} }: CspOptions): string {
  const supabase = supabaseUrl ? [supabaseUrl, supabaseUrl.replace(/^https:/, "wss:")] : [];
  const stripeScript = stripe ? ["https://js.stripe.com", "https://*.js.stripe.com"] : [];
  const stripeFrame = stripe ? ["https://js.stripe.com", "https://*.js.stripe.com", "https://hooks.stripe.com"] : [];
  const stripeConnect = stripe ? ["https://api.stripe.com"] : [];

  const directives: Record<string, string[]> = {
    "default-src": ["'self'"],
    "script-src": ["'self'", `'nonce-${nonce}'`, "'strict-dynamic'", ...stripeScript, ...(isDev ? ["'unsafe-eval'"] : []), ...(extra["script-src"] ?? [])],
    "style-src": ["'self'", ...(isDev ? ["'unsafe-inline'"] : [`'nonce-${nonce}'`]), ...(extra["style-src"] ?? [])],
    "img-src": ["'self'", "data:", "blob:", ...(supabaseUrl ? [supabaseUrl] : []), ...(extra["img-src"] ?? [])],
    "font-src": ["'self'", ...(extra["font-src"] ?? [])],
    "media-src": ["'self'", ...(extra["media-src"] ?? [])],
    "connect-src": ["'self'", ...supabase, ...stripeConnect, ...(isDev ? ["ws:"] : []), ...(extra["connect-src"] ?? [])],
    "frame-src": [...stripeFrame, ...(extra["frame-src"] ?? [])],
    "frame-ancestors": ["'none'"],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
  };
  if (directives["frame-src"].length === 0) directives["frame-src"] = ["'none'"];

  const parts = Object.entries(directives).map(([name, values]) => `${name} ${values.join(" ")}`);
  if (!isDev) parts.push("upgrade-insecure-requests");
  return parts.join("; ");
}

export function securityHeaders(csp: string, { isDev = false }: { isDev?: boolean } = {}): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Security-Policy": csp,
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=(), usb=(), payment=(self)",
    "Cross-Origin-Opener-Policy": "same-origin",
    "X-Frame-Options": "DENY",
  };
  // HSTS seulement en production (HTTPS). Ajoute « ; preload » après avoir vérifié tous les sous-domaines.
  if (!isDev) headers["Strict-Transport-Security"] = "max-age=63072000; includeSubDomains";
  return headers;
}
