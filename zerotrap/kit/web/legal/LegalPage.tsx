// ZeroTrap — affiche une page légale depuis legal/<langue>/<page>.md (composant serveur, Next.js App Router).
// Sécurité : liste blanche des pages et des langues (pas de traversée de chemin), aucun HTML brut rendu.
//
// Exemple — src/app/legal/[page]/page.tsx :
//   import { notFound } from "next/navigation";
//   import { LegalPage } from "@/components/legal/LegalPage";
//   export default async function Page({ params }: { params: Promise<{ page: string }> }) {
//     const { page } = await params;
//     const content = await LegalPage({ page, lang: "fr" });
//     if (!content) notFound();
//     return content;
//   }

import { readFile } from "node:fs/promises";
import path from "node:path";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { isLanguageCode, isLegalPageId } from "./legal-pages";

export type LegalPageProps = {
  page: string;
  lang: string;
  /** Dossier des pages légales (monorepo : chemin vers la racine/legal). */
  legalDir?: string;
};

export async function LegalPage({ page, lang, legalDir = path.join(process.cwd(), "legal") }: LegalPageProps) {
  if (!isLegalPageId(page) || !isLanguageCode(lang)) return null;
  let markdown: string;
  try {
    markdown = await readFile(path.join(legalDir, lang, `${page}.md`), "utf8");
  } catch {
    return null;
  }
  // Les commentaires de travail destinés à l'IA ne sont jamais affichés.
  markdown = markdown.replace(/<!--[\s\S]*?-->/g, "");
  return (
    <article className="legal-page" lang={lang}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </article>
  );
}
