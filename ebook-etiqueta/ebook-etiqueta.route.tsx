import { createFileRoute } from "@tanstack/react-router";
import LandingEbook from "@/pages/LandingEbook";

const TITLE = "Etiqueta Essencial para Damas | E-book da Letícia Fagundes";
const DESCRIPTION = "As regras de etiqueta que a Letícia Fagundes considera essenciais, em um e-book ilustrado de 28 páginas.";
const URL = "https://exclusivo.escolaparadamas.com.br/ebook-etiqueta";

export const Route = createFileRoute("/ebook-etiqueta")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "theme-color", content: "#200810" },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: LandingEbook,
});
