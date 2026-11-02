/**
 * Escola para Damas, upsell depois da compra do e-book Etiqueta Essencial.
 * Oferta: Plano Anual da Escola (12x R$ 39,90). Compra com um clique pelo Funil de Vendas da Hotmart
 * (widget hotmart-sales-funnel). Estilo: src/styles/landing-ebook.css (escopo .lpeb).
 */
import { useEffect, useState } from "react";
import "@/styles/landing-ebook.css";

import cLiteratura from "@/assets/b2/capa-literatura.webp";
import cArte from "@/assets/b2/capa-museu.webp";
import cHistoria from "@/assets/b2/capa-historia.webp";
import cComunicacao from "@/assets/b2/capa-comunicacao.webp";
import cFeminilidade from "@/assets/b2/capa-feminilidade.webp";
import cLinguagens from "@/assets/b2/capa-linguagens.webp";
import cApegos from "@/assets/b2/capa-apegos.webp";
import cTemperamentos from "@/assets/b2/capa-temperamentos.webp";
import cAnfitria from "@/assets/b2/capa-anfitria.webp";
import cRotina from "@/assets/b2/capa-rotina.webp";
import leticiaSorriso from "@/assets/ebook/leticia-sorriso.webp";

declare global {
  interface Window {
    checkoutElements?: { init: (k: string) => { mount: (sel: string) => void } };
  }
}

const FUNNEL_SCRIPT = "https://checkout.hotmart.com/lib/hotmart-checkout-elements.js";
const FALLBACK_URL = "https://pay.hotmart.com/X100700705N?off=vzeeyxtv&checkoutMode=10&src=upsell-ebook-etiqueta";
const FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..700;1,400..700&family=DM+Sans:opsz,wght@9..40,300..700&display=swap";

const CURSOS: [string, string, string, number][] = [
  [cAnfitria, "Guia da Anfitriã Perfeita", "A continuação do seu e-book: etiqueta e hospitalidade para receber bem", 497],
  [cComunicacao, "Comunicação FMA", "Comunicação Feminina, Magnética e Assertiva", 897],
  [cFeminilidade, "Desperte Sua Essência Feminina", "Mais delicadeza e leveza na forma de viver e se relacionar", 997],
  [cLiteratura, "Desvendando a Literatura", "Os grandes clássicos, de Homero a Clarice Lispector", 697],
  [cArte, "Museu da Dama", "Obras, artistas e movimentos para olhar a arte com outros olhos", 497],
  [cHistoria, "Descobrindo a História", "Os acontecimentos que explicam o mundo de hoje", 597],
  [cLinguagens, "Linguagens do Amor", "Como as pessoas demonstram e recebem afeto", 397],
  [cApegos, "Mapa dos Apegos", "Os padrões de apego por trás dos seus vínculos", 597],
  [cTemperamentos, "Os 4 Temperamentos", "O que move o seu comportamento e as suas emoções", 497],
  [cRotina, "Rotina dos Sonhos", "Uma rotina com espaço para o que importa para você", 697],
];
const TOTAL = CURSOS.reduce((t, c) => t + c[3], 0);
const brl = (v: number) => v.toLocaleString("pt-BR");

const Check = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

const OfferBox = ({ id }: { id?: string }) => (
  <div className="up-box">
    <div className="up-was">De R$ {brl(TOTAL)} em cursos avulsos</div>
    <div className="up-price">
      <small>12x de</small>
      <strong>R$ 39,90</strong>
    </div>
    <div className="up-cash">ou R$ 478,80 à vista · Plano Anual</div>
    {id && <div id={id} className="up-widget" />}
  </div>
);

const LandingEbookUpsell = () => {
  const [widgetOk, setWidgetOk] = useState(true);

  useEffect(() => {
    document.title = "Uma oferta para você | Escola para Damas";
    if (!document.querySelector(`link[href="${FONTS_URL}"]`)) {
      const l = document.createElement("link");
      l.rel = "stylesheet";
      l.href = FONTS_URL;
      document.head.appendChild(l);
    }
    const mount = () => {
      try {
        window.checkoutElements?.init("salesFunnel").mount("#hotmart-sales-funnel");
      } catch {
        setWidgetOk(false);
      }
    };
    if (window.checkoutElements) {
      mount();
    } else {
      const s = document.createElement("script");
      s.src = FUNNEL_SCRIPT;
      s.async = true;
      s.onload = mount;
      s.onerror = () => setWidgetOk(false);
      document.body.appendChild(s);
    }
    // se o widget não aparecer (ex.: página aberta fora do fluxo de compra), mostra o botão normal
    const t = window.setTimeout(() => {
      const el = document.getElementById("hotmart-sales-funnel");
      if (!el || el.childElementCount === 0) setWidgetOk(false);
    }, 6000);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className="lpeb">
      <div className="up-top">
        <span className="up-ok"><Check /> Pedido recebido</span>
        <span>Seu e-book chega no seu e-mail em instantes</span>
      </div>

      <section className="eb-hero up-hero" id="up-oferta">
        <div className="eb-wrap eb-center">
          <span className="eb-eye">Espere, antes de fechar esta página</span>
          <h1>
            Você começou pela etiqueta. <em>Que tal levar a Escola inteira?</em>
          </h1>
          <p className="eb-lead up-lead">
            Só para quem acabou de comprar o e-book: entre na Escola para Damas e tenha acesso a todos os cursos da Letícia Fagundes por um ano, incluindo o <b>Guia da Anfitriã Perfeita</b>, que continua exatamente de onde o e-book parou.
          </p>
          <OfferBox id="hotmart-sales-funnel" />
          {!widgetOk && (
            <a className="eb-btn wide up-fallback" href={FALLBACK_URL}>
              <span>Sim, quero a Escola completa</span>
            </a>
          )}
        </div>
      </section>

      <section className="eb-sec eb-cream">
        <div className="eb-wrap">
          <span className="eb-eye">Tudo o que entra no Plano Anual</span>
          <h2>
            10 cursos, 5 pilares e o <em>Clube das Damas</em>
          </h2>
          <ul className="up-list">
            {CURSOS.map(([img, n, d, p]) => (
              <li key={n}>
                <img src={img} alt="" loading="lazy" width={52} height={77} />
                <div>
                  <b>{n}</b>
                  <span>{d}</span>
                </div>
                <em>R$ {brl(p)}</em>
              </li>
            ))}
            <li className="up-club">
              <div>
                <b>Clube das Damas</b>
                <span>Grupo VIP e encontros mensais com a Letícia</span>
              </div>
              <em>incluso</em>
            </li>
          </ul>
          <div className="up-sum">
            <span>Se você comprasse cada curso separado</span>
            <b>R$ {brl(TOTAL)}</b>
          </div>
        </div>
      </section>

      <section className="eb-sec eb-split">
        <div className="eb-wrap eb-split-g">
          <div className="eb-photo">
            <img src={leticiaSorriso} alt="Letícia Fagundes" loading="lazy" />
          </div>
          <div>
            <span className="eb-eye">Por que agora</span>
            <h2>
              O e-book te deu as regras. <em>A Escola te dá o repertório.</em>
            </h2>
            <p>
              Etiqueta é um dos cinco pilares da Escola. Os outros são cultura, comunicação, feminilidade e inteligência emocional, e é a soma deles que faz uma mulher se sentir à vontade em qualquer ambiente.
            </p>
            <p>Com cerca de 15 minutos por dia você assiste a uma aula, e muitas podem ser ouvidas pelo áudio.</p>
            <ul className="eb-checks up-checks">
              <li><Check />Acesso a todos os cursos por 12 meses</li>
              <li><Check />Novos cursos lançados durante o ano</li>
              <li><Check />Clube das Damas: grupo VIP e encontros mensais</li>
              <li><Check />Garantia de 7 dias</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="eb-sec eb-offer">
        <div className="eb-wrap eb-center">
          <h2>
            Aproveite enquanto <em>esta página está aberta</em>
          </h2>
          <OfferBox />
          <a className="eb-btn wide up-fallback" href={widgetOk ? "#up-oferta" : FALLBACK_URL}>
            <span>Sim, quero a Escola completa</span>
          </a>
          <p className="up-guar">
            <b>Garantia de 7 dias:</b> entre, conheça as aulas e, se não for para você, peça o reembolso dentro do prazo.
          </p>
        </div>
      </section>

      <footer className="eb-foot">Escola para Damas · Letícia Fagundes</footer>
    </div>
  );
};

export default LandingEbookUpsell;
