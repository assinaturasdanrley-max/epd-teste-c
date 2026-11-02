import { createFileRoute } from "@tanstack/react-router";
import LandingEbookObrigado from "@/pages/LandingEbookObrigado";

const TITLE = "Parabéns, Dama! | Escola para Damas";
const DESCRIPTION = "Compra confirmada. Veja como acessar o seu e-book Etiqueta Essencial para Damas.";
const URL = "https://exclusivo.escolaparadamas.com.br/ebook-obrigado";

export const Route = createFileRoute("/ebook-obrigado")({
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
  component: LandingEbookObrigado,
});
