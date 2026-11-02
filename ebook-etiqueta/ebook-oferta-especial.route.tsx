import { createFileRoute } from "@tanstack/react-router";
import LandingEbookUpsell from "@/pages/LandingEbookUpsell";

const TITLE = "Uma oferta para você | Escola para Damas";
const DESCRIPTION = "Oferta especial da Escola para Damas para quem comprou o e-book.";
const URL = "https://exclusivo.escolaparadamas.com.br/ebook-oferta-especial";

export const Route = createFileRoute("/ebook-oferta-especial")({
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
  component: LandingEbookUpsell,
});
