import { createFileRoute } from "@tanstack/react-router";
import LandingAulaEscola from "@/pages/LandingAulaEscola";

const TITLE = "Aula gratuita com Letícia Fagundes | Escola para Damas";
const DESCRIPTION = "Como se tornar uma mulher mais interessante, inteligente e refinada. Assista à aula gratuita da Letícia Fagundes.";
const URL = "https://exclusivo.escolaparadamas.com.br/aula-escola";

export const Route = createFileRoute("/aula-escola")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "theme-color", content: "#200810" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: LandingAulaEscola,
});
