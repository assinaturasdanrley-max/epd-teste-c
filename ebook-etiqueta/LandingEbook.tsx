/**
 * Escola para Damas, página de vendas do e-book Etiqueta Essencial para Damas (R$ 19,90).
 * Fluxo: botões levam à oferta (#oferta) -> botão da oferta abre o formulário (Hotmart Send próprio)
 * -> checkout do e-book (com order bumps) -> upsell do plano anual em /ebook-oferta-especial.
 * Página autocontida: estilo em src/styles/landing-ebook.css (escopo .lpeb), imagens em src/assets/ebook/.
 */
import { useEffect, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import "@/styles/landing-ebook.css";

import capa from "@/assets/ebook/capa.webp";
import pg7 from "@/assets/ebook/pagina-7.webp";
import pg10 from "@/assets/ebook/pagina-10.webp";
import pg13 from "@/assets/ebook/pagina-13.webp";
import pg18 from "@/assets/ebook/pagina-18.webp";
import leticiaXicara from "@/assets/ebook/leticia-xicara.webp";
import leticiaSorriso from "@/assets/ebook/leticia-sorriso.webp";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/* ------------------------------------------------------------------ */
/* Configuração                                                        */
/* ------------------------------------------------------------------ */
const SEND_FORM_ID = "EBOOK_FORM_ID";
const SEND_ACTION = `https://handler.send.hotmart.com/subscription/${SEND_FORM_ID}?hotfeature=53`;
const CHECKOUT_URL = "EBOOK_CHECKOUT_URL";
const PRICE = "19,90";
const FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..700;1,400..700&family=DM+Sans:opsz,wght@9..40,300..700&display=swap";

const SITUACOES = [
  ["Um jantar em um restaurante sofisticado", "Vários talheres e taças à sua frente. Qual usar primeiro?"],
  ["Conhecer a família do homem que você ama", "Como cumprimentar, o que levar e como causar uma boa primeira impressão."],
  ["Receber os colegas do seu marido em casa", "O que preparar antes de a campainha tocar para receber bem."],
  ["Um evento onde você não conhece quase ninguém", "Como se apresentar e começar uma conversa sem ficar desconfortável."],
];

const SUMARIO = [
  "Elegância se aprende",
  "À mesa: antes mesmo do primeiro prato",
  "A mesa posta",
  "À mesa: durante e ao final da refeição",
  "Taças e copos: cada função",
  "A arte de cumprimentar e apresentar",
  "A elegância também está na conversa",
  "Quando você é a convidada",
  "Quando você é a anfitriã",
  "Etiqueta em eventos e ambientes sociais",
  "10 pequenos hábitos que entregam elegância",
  "Uma dama está em constante lapidação",
  "E agora é a sua vez",
];

const APRENDE = [
  "Onde fica cada peça da mesa posta e a ordem certa dos talheres",
  "Para que serve cada taça e como segurar cada uma",
  "O que fazer com a bolsa, o guardanapo e o celular à mesa",
  "Como apresentar duas pessoas de um jeito que puxa conversa",
  "As perguntas que constrangem e os assuntos que pedem cuidado",
  "O que levar, o que evitar e como agradecer quando você é a convidada",
  "O checklist da anfitriã antes de a campainha tocar",
];

const FAQ: [string, string][] = [
  ["Como recebo o e-book?", "Logo depois da confirmação do pagamento você recebe o acesso no seu e-mail. O e-book é em PDF e você pode ler no celular, no computador ou imprimir."],
  ["Preciso saber alguma coisa de etiqueta antes?", "Não. O e-book foi escrito para quem está começando, com situações do dia a dia explicadas de um jeito simples."],
  ["É um livro de regras rígidas?", "Não. A ideia é você saber como agir em diferentes ambientes sem se sentir perdida, e não virar uma mulher preocupada com regras o tempo inteiro."],
  ["Quantas páginas tem?", "São 28 páginas, com ilustrações da mesa posta e das taças, exemplos reais e um checklist para quando você for a anfitriã."],
  ["E se eu não gostar?", "Você tem 7 dias de garantia. Se não for para você, pede o reembolso dentro do prazo pela própria Hotmart."],
];

/* ------------------------------------------------------------------ */
/* Peças                                                               */
/* ------------------------------------------------------------------ */
const Arrow = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
const Check = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

const ToOffer = ({ children, light }: { children: ReactNode; light?: boolean }) => (
  <a href="#oferta" className={`eb-btn${light ? " ghost" : ""}`}>
    <span>{children}</span>
    <Arrow />
  </a>
);

const Eyebrow = ({ children }: { children: ReactNode }) => <span className="eb-eye">{children}</span>;

/* ------------------------------------------------------------------ */
/* Formulário                                                          */
/* ------------------------------------------------------------------ */
const LeadModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string }>({});
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: globalThis.KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const digits = form.phone.replace(/\D/g, "");

  const validate = () => {
    const e: typeof errors = {};
    const words = form.name.trim().split(/\s+/).filter(Boolean);
    if (!/^[a-zA-ZÀ-ÿ'\-\s]+$/.test(form.name.trim()) || words.length < 2) e.name = "Insira seu nome e sobrenome.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = "Insira um e-mail válido.";
    if (digits.length < 10 || digits.length > 13 || /^(\d)\1+$/.test(digits)) e.phone = "Insira um WhatsApp válido com DDD.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate() || sending) return;
    setSending(true);
    const intl = digits.startsWith("55") && digits.length > 11 ? digits : `55${digits}`;
    const fd = new FormData();
    fd.append("first_name", form.name.trim());
    fd.append("email", form.email.trim());
    fd.append("phone", `+${intl}`);
    fd.append(`b_${SEND_FORM_ID}`, "");
    const params = new URLSearchParams(window.location.search).toString();
    try {
      await Promise.race([
        fetch(SEND_ACTION + (params ? "&" + params : ""), { method: "POST", mode: "no-cors", body: fd }),
        new Promise((r) => setTimeout(r, 2500)),
      ]);
    } catch {
      /* segue para o checkout mesmo assim */
    }
    window.fbq?.("track", "Lead");
    const co = new URL(CHECKOUT_URL);
    co.searchParams.set("name", form.name.trim());
    co.searchParams.set("email", form.email.trim());
    co.searchParams.set("phoneac", intl.slice(2, 4));
    co.searchParams.set("phonenumber", intl.slice(4));
    new URLSearchParams(window.location.search).forEach((v, k) => co.searchParams.set(k, v));
    window.location.href = co.toString();
  };

  if (!open) return null;
  const field = (k: "name" | "email" | "phone", label: string, props: Record<string, string>) => (
    <label className="eb-field">
      <span>{label}</span>
      <input
        {...props}
        className={errors[k] ? "bad" : ""}
        value={form[k]}
        onChange={(ev) => {
          setForm((f) => ({ ...f, [k]: ev.target.value }));
          setErrors((x) => ({ ...x, [k]: undefined }));
        }}
      />
      {errors[k] && <em>{errors[k]}</em>}
    </label>
  );

  return (
    <div className="eb-modal" role="dialog" aria-modal="true" aria-labelledby="eb-modal-t" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="eb-modal-box">
        <button type="button" className="eb-x" onClick={onClose} aria-label="Fechar">×</button>
        <img src={capa} alt="" className="eb-modal-cover" />
        <h3 id="eb-modal-t">Só mais um <em>passo</em></h3>
        <p>Preencha seus dados para ir ao pagamento. O e-book chega no seu e-mail logo depois da compra.</p>
        <form onSubmit={submit} noValidate autoComplete="on">
          {field("name", "Nome completo", { placeholder: "Seu nome e sobrenome", autoComplete: "name" })}
          {field("email", "E-mail", { type: "email", placeholder: "seuemail@exemplo.com", autoComplete: "email", inputMode: "email" })}
          {field("phone", "WhatsApp", { type: "tel", placeholder: "(41) 99999-9999", autoComplete: "tel", inputMode: "tel" })}
          <button type="submit" className="eb-btn wide" disabled={sending}>
            <span>{sending ? "Abrindo o pagamento" : `Ir para o pagamento · R$ ${PRICE}`}</span>
            <Arrow />
          </button>
          <small>Pagamento seguro pela Hotmart · 7 dias de garantia</small>
        </form>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */
const LandingEbook = () => {
  const [modal, setModal] = useState(false);
  const [faq, setFaq] = useState<number | null>(0);
  const [showBar, setShowBar] = useState(false);
  const offerRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    document.title = "Etiqueta Essencial para Damas | E-book da Letícia Fagundes";
    if (!document.querySelector(`link[href="${FONTS_URL}"]`)) {
      const l = document.createElement("link");
      l.rel = "stylesheet";
      l.href = FONTS_URL;
      document.head.appendChild(l);
    }
    let pastHero = false;
    let atOffer = false;
    const upd = () => setShowBar(pastHero && !atOffer);
    const io = new IntersectionObserver((ents) => {
      ents.forEach((e) => {
        if (e.target === heroRef.current) pastHero = !e.isIntersecting && e.boundingClientRect.top < 0;
        if (e.target === offerRef.current) atOffer = e.isIntersecting;
      });
      upd();
    });
    if (heroRef.current) io.observe(heroRef.current);
    if (offerRef.current) io.observe(offerRef.current);
    const rv = new IntersectionObserver(
      (ents) => ents.forEach((e) => e.isIntersecting && (e.target.classList.add("in"), rv.unobserve(e.target))),
      { rootMargin: "0px 0px -8% 0px" },
    );
    document.querySelectorAll(".lpeb .rv").forEach((el) => rv.observe(el));
    return () => {
      io.disconnect();
      rv.disconnect();
    };
  }, []);

  const openForm = () => {
    window.fbq?.("track", "InitiateCheckout", { value: 19.9, currency: "BRL" });
    setModal(true);
  };

  return (
    <div className="lpeb">
      {/* HERO */}
      <section className="eb-hero" ref={heroRef}>
        <div className="eb-wrap eb-brand">ESCOLA PARA DAMAS</div>
        <div className="eb-wrap eb-hero-g">
          <div className="eb-hero-t">
            <Eyebrow>E-book · Letícia Fagundes</Eyebrow>
            <h1>
              Saiba exatamente como agir <em>à mesa, numa conversa e em qualquer evento</em>
            </h1>
            <p className="eb-lead">
              O e-book <b>Etiqueta Essencial para Damas</b> reúne as regras que a Letícia Fagundes considera essenciais para você se sentir segura, confortável e elegante nos ambientes que frequenta.
            </p>
            <ToOffer>Quero o e-book</ToOffer>
            <div className="eb-mini">
              <span>28 páginas</span>
              <span>PDF para ler no celular</span>
              <span>Acesso imediato</span>
            </div>
          </div>
          <div className="eb-hero-art">
            <img src={pg7} alt="Página A mesa posta do e-book" className="eb-pg p1" />
            <img src={capa} alt="Capa do e-book Etiqueta Essencial para Damas" className="eb-cover" fetchPriority="high" />
            <img src={pg10} alt="Página Taças e copos do e-book" className="eb-pg p2" />
          </div>
        </div>
      </section>

      {/* SITUAÇÕES */}
      <section className="eb-sec eb-cream">
        <div className="eb-wrap">
          <Eyebrow>Pense nas situações</Eyebrow>
          <h2 className="rv">
            Você já ficou sem saber <em>como agir</em> em algum desses momentos?
          </h2>
          <div className="eb-sit">
            {SITUACOES.map(([t, d], i) => (
              <div className="eb-sit-c rv" key={t}>
                <span className="n">{String(i + 1).padStart(2, "0")}</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
          <p className="eb-center rv">
            <b>É para momentos assim que se aprende etiqueta.</b> Quanto mais você conhece esses pequenos códigos, menos precisa se preocupar com eles.
          </p>
        </div>
      </section>

      {/* ELEGÂNCIA SE APRENDE */}
      <section className="eb-sec eb-split">
        <div className="eb-wrap eb-split-g">
          <div className="eb-photo rv">
            <img src={leticiaXicara} alt="Letícia Fagundes segurando uma xícara" loading="lazy" />
          </div>
          <div>
            <Eyebrow>O ponto de partida</Eyebrow>
            <h2 className="rv">
              Elegância não é dom. <em>Elegância se aprende.</em>
            </h2>
            <p className="rv">
              Elegância não é privilégio de quem nasceu em uma família rica ou aprendeu etiqueta desde criança. É um conjunto de comportamentos que podem ser conhecidos, praticados e incorporados, em qualquer idade.
            </p>
            <p className="rv">
              O e-book não quer transformar você em uma mulher rígida, preocupada com regras o tempo inteiro. Quer que você saiba como agir em diferentes ambientes sem se sentir perdida ou deslocada.
            </p>
            <div className="eb-quote rv">
              "Uma pequena dúvida de etiqueta passa despercebida. O nervosismo de querer mostrar que sabe tudo costuma chamar muito mais atenção."
              <span>Trecho do e-book</span>
            </div>
            <ToOffer>Quero aprender</ToOffer>
          </div>
        </div>
      </section>

      {/* O QUE VOCÊ VAI APRENDER */}
      <section className="eb-sec eb-cream">
        <div className="eb-wrap eb-learn-g">
          <div>
            <Eyebrow>Dentro do e-book</Eyebrow>
            <h2 className="rv">
              O que você vai <em>saber fazer</em> depois de ler
            </h2>
            <ul className="eb-checks">
              {APRENDE.map((x) => (
                <li className="rv" key={x}>
                  <Check />
                  {x}
                </li>
              ))}
            </ul>
          </div>
          <div className="eb-sum rv">
            <div className="eb-sum-h">Sumário</div>
            <ol>
              {SUMARIO.map((x, i) => (
                <li key={x}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  {x}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* POR DENTRO */}
      <section className="eb-sec">
        <div className="eb-wrap">
          <Eyebrow>Por dentro</Eyebrow>
          <h2 className="rv">
            Ilustrado, direto e <em>feito para consultar</em>
          </h2>
          <p className="eb-sub rv">A mesa posta peça por peça, cada taça com a sua função, exemplos reais de conversa e o checklist da anfitriã.</p>
          <div className="eb-pages">
            {[
              [pg7, "A mesa posta"],
              [pg10, "Taças e copos"],
              [pg13, "Como apresentar duas pessoas"],
              [pg18, "Quando você é a anfitriã"],
            ].map(([src, t]) => (
              <figure className="rv" key={t}>
                <img src={src} alt={`Página: ${t}`} loading="lazy" />
                <figcaption>{t}</figcaption>
              </figure>
            ))}
          </div>
          <div className="eb-center">
            <ToOffer>Quero o e-book</ToOffer>
          </div>
        </div>
      </section>

      {/* LETÍCIA */}
      <section className="eb-sec eb-split">
        <div className="eb-wrap eb-split-g rev">
          <div>
            <Eyebrow>Quem escreveu</Eyebrow>
            <h2 className="rv">
              Letícia <em>Fagundes</em>
            </h2>
            <p className="rv">
              Psicanalista, terapeuta e mentora de mulheres. Fundadora da Escola para Damas, onde ensina cultura, comunicação, feminilidade, inteligência emocional e elegância.
            </p>
            <p className="rv">
              Neste e-book ela reuniu as regras de etiqueta que considera essenciais para uma mulher que quer se sentir mais preparada nas diferentes fases da vida: do primeiro jantar com a família dele ao dia em que você recebe convidados em casa.
            </p>
          </div>
          <div className="eb-photo rv">
            <img src={leticiaSorriso} alt="Letícia Fagundes" loading="lazy" />
          </div>
        </div>
      </section>

      {/* OFERTA */}
      <section className="eb-sec eb-offer" id="oferta" ref={offerRef}>
        <div className="eb-wrap">
          <div className="eb-card rv">
            <img src={capa} alt="Capa do e-book" className="eb-card-cover" loading="lazy" />
            <div className="eb-card-b">
              <Eyebrow>E-book Etiqueta Essencial para Damas</Eyebrow>
              <ul>
                <li><Check />28 páginas ilustradas em PDF</li>
                <li><Check />13 capítulos, da mesa posta à anfitriã</li>
                <li><Check />Checklist para receber convidados</li>
                <li><Check />Acesso imediato no seu e-mail</li>
              </ul>
              <div className="eb-price">
                <small>Pagamento único</small>
                <strong>R$ {PRICE}</strong>
              </div>
              <button type="button" className="eb-btn wide" onClick={openForm}>
                <span>Quero meu e-book agora</span>
                <Arrow />
              </button>
              <div className="eb-guar">
                <b>Garantia de 7 dias.</b> Se não for para você, peça o reembolso dentro do prazo.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="eb-sec eb-cream">
        <div className="eb-wrap eb-narrow">
          <Eyebrow>Dúvidas</Eyebrow>
          <h2 className="rv">
            Perguntas <em>frequentes</em>
          </h2>
          <div className="eb-faq">
            {FAQ.map(([q, a], i) => (
              <div className={`eb-faq-i${faq === i ? " open" : ""}`} key={q}>
                <button type="button" onClick={() => setFaq(faq === i ? null : i)} aria-expanded={faq === i}>
                  {q}
                  <span>{faq === i ? "−" : "+"}</span>
                </button>
                {faq === i && <p>{a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL */}
      <section className="eb-sec eb-final">
        <div className="eb-wrap eb-center">
          <h2 className="rv">
            Na próxima mesa posta, <em>você vai saber por onde começar</em>
          </h2>
          <ToOffer>Quero o e-book por R$ {PRICE}</ToOffer>
        </div>
      </section>

      <footer className="eb-foot">Escola para Damas · Letícia Fagundes</footer>

      <div className={`eb-bar${showBar ? " show" : ""}`}>
        <span>
          E-book <b>R$ {PRICE}</b>
        </span>
        <a href="#oferta" className="eb-btn small">
          <span>Quero o e-book</span>
        </a>
      </div>

      <LeadModal open={modal} onClose={() => setModal(false)} />
    </div>
  );
};

export default LandingEbook;
