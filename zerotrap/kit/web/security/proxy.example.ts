// ZeroTrap — exemple : src/proxy.ts (Next.js 16+). Pour une version antérieure : src/middleware.ts,
// avec une fonction nommée « middleware ». Vérifie la convention de la version installée dans la doc officielle.
// Le nonce est transmis via l'en-tête « x-nonce » : Next.js l'applique à ses propres scripts.
// Lis-le avec headers() pour l'ajouter à tes scripts tiers autorisés (<Script nonce={nonce} />).

import { NextResponse, type NextRequest } from "next/server";
import { buildCsp, generateNonce, securityHeaders } from "@/components/security/security-headers";

export function proxy(request: NextRequest) {
  const nonce = generateNonce();
  const isDev = process.env.NODE_ENV !== "production";
  const csp = buildCsp({
    nonce,
    isDev,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    stripe: process.env.NEXT_PUBLIC_STRIPE_ENABLED === "true",
  });

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  for (const [name, value] of Object.entries(securityHeaders(csp, { isDev }))) response.headers.set(name, value);
  return response;
}

export const config = {
  matcher: [
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico|.well-known).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
