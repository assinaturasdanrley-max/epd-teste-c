import { createFileRoute } from "@tanstack/react-router";
import LandingCulturaBonus from "@/pages/LandingCulturaBonus";

const TITLE = "Escola para Damas | Amplie seu repertório cultural";
const DESCRIPTION =
  "Aprenda arte, filosofia, história e literatura do zero, em aulas leves e no seu ritmo, com Letícia Fagundes.";
const URL = "https://exclusivo.escolaparadamas.com.br/cultura-bonus";

export const Route = createFileRoute("/cultura-bonus")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "theme-color", content: "#1c0507" },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: LandingCulturaBonus,
});
