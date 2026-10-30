/**
 * Escola para Damas, Landing Cultura BÔNUS (teste A/B da /cultura)
 * Diferenças: sem botão no hero e nas seções I e II; os botões levam à pilha de valor
 * (#bonus) e o preço real só aparece depois, na seção de planos.
 * Página autocontida: todo o estilo está em
 * src/styles/landing-b2.css (escopo .lpb2) e as imagens em src/assets/b2/.
 * Checkout: formulários próprios no Hotmart Send ([PLANO MENSAL/ANUAL] CULTURA BONUS ESCOLA DAMAS).
 */
import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, FormEvent, KeyboardEvent, PointerEvent, ReactNode } from "react";
import "@/styles/landing-b2.css";
import "@/styles/landing-cultura.css";
import "@/styles/landing-cultura-bonus.css";
import DepoimentosLoop from "@/components/b2/DepoimentosLoop";

import hero1920 from "@/assets/b2/hero-1920.webp";
import hero1280 from "@/assets/b2/hero-1280.webp";
import heroMobile from "@/assets/b2/hero-mobile.webp";
import col1920 from "@/assets/b2/colunata-1920.webp";
import col1280 from "@/assets/b2/colunata-1280.webp";
import colMobile from "@/assets/b2/colunata-mobile.webp";
import jantar from "@/assets/b2/jantar.webp";
import biblioteca from "@/assets/b2/biblioteca.webp";
import celularLivro from "@/assets/b2/celular-livro.webp";
import pilar1 from "@/assets/b2/pilar-1.webp";
import pilar2 from "@/assets/b2/pilar-2.webp";
import pilar3 from "@/assets/b2/pilar-3.webp";
import pilar4 from "@/assets/b2/pilar-4.webp";
import pilar5 from "@/assets/b2/pilar-5.webp";
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
import dep1 from "@/assets/b2/depoimento-1.webp";
import dep2 from "@/assets/b2/depoimento-2.webp";
import dep3 from "@/assets/b2/depoimento-3.webp";
import dep4 from "@/assets/b2/depoimento-4.webp";
import leticiaRetrato from "@/assets/b2/leticia-retrato.webp";
import leticiaAvatar from "@/assets/b2/leticia-avatar.webp";
import logoEscola from "@/assets/b2/logo-escola.webp";
import heroC1920 from "@/assets/cultura/hero-cultura-1920.webp.asset.json";
import heroC1280 from "@/assets/cultura/hero-cultura-1280.webp.asset.json";
import heroCMobile from "@/assets/cultura/hero-cultura-mobile.webp";
import cult9598 from "@/assets/cultura/cultura-9598.webp";
import cult9609 from "@/assets/cultura/cultura-9609.webp";
import cult9614 from "@/assets/cultura/cultura-9614.webp";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/* ------------------------------------------------------------------ */
/* Configuração                                                        */
/* ------------------------------------------------------------------ */
const KLICKSEND_MONTHLY_ID = "woul7YL";
const KLICKSEND_ANNUAL_ID = "7auwp7z";
const HOTMART_SEND_MONTHLY_ACTION = "https://handler.send.hotmart.com/subscription/woul7YL?hotfeature=53";
const MONTHLY_CHECKOUT_URL = "https://pay.hotmart.com/C107209576O?checkoutMode=10";
const HOTMART_SEND_ANNUAL_ACTION = "https://handler.send.hotmart.com/subscription/7auwp7z?hotfeature=53";
const ANNUAL_CHECKOUT_URL = "https://pay.hotmart.com/X100700705N?off=vzeeyxtv&checkoutMode=10";
const WHATSAPP_URL =
  "https://wa.me/5541998875240?text=Ol%C3%A1%20equipe%2C%20gostaria%20de%20tirar%20uma%20d%C3%BAvida%20sobre%20a%20Escola%20para%20Damas";

type Plan = "mensal" | "anual";
const FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,200..800,0..100,0..1;1,9..144,200..800,0..100,0..1&family=DM+Sans:ital,opsz,wght@0,9..40,300..700;1,9..40,300..500&display=swap";
// atributo nativo fetchpriority (React 18 não conhece a prop camelCase)
const HIGH_PRIORITY = { fetchpriority: "high" } as Record<string, string>;

/* ------------------------------------------------------------------ */
/* Ícones (traço fino)                                                 */
/* ------------------------------------------------------------------ */
const Arrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
    <path d="M7 17L17 7M17 7H8M17 7v9" />
  </svg>
);
const ArrowRight = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
const Check = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="hsl(142 60% 48%)" strokeWidth="1.5" style={{ flexShrink: 0, marginTop: ".15rem" }} aria-hidden="true">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);
const Cross = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="hsl(355 50% 50%)" strokeWidth="1.5" style={{ flexShrink: 0, marginTop: ".3rem" }} aria-hidden="true">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);
const WhatsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
    <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
  </svg>
);

/* ------------------------------------------------------------------ */
/* Conteúdo                                                            */
/* ------------------------------------------------------------------ */
const HEADLINE = "Amplie seu repertório cultural".split(" ");
const CULTURE_CHIPS = ["Arte", "Filosofia", "História", "Literatura"];
const CULTURE_COURSES = [
  { img: cLiteratura, name: "Desvendando a Literatura", pillar: "Cultura", text: "Os grandes clássicos e seus autores, de Homero, Dante e Shakespeare a Jane Austen, Dostoiévski, Machado de Assis e Clarice Lispector." },
  { img: cArte, name: "Museu da Dama", pillar: "Cultura", text: "Aproxime-se da arte e aprenda a entender obras, artistas e movimentos. Especial para quem gosta de museus e viagens." },
  { img: cHistoria, name: "Descobrindo a História", pillar: "Cultura", text: "Acontecimentos e contextos que ajudam a compreender a sociedade e a cultura de hoje." },
  { img: biblioteca, name: "Filosofia", pillar: "Cultura", text: "Os principais pensadores e suas ideias, explicados de um jeito leve e aplicado à vida real." },
];
const MARQUEE = ["Cultura", "Comunicação", "Feminilidade", "Inteligência emocional", "Elegância", "Literatura", "Arte", "História", "Etiqueta"];

const PILLARS = [
  { name: "Cultura", img: pilar2, text: "Tenha mais cultura com aulas de literatura, história, filosofia e artes, aumentando seu repertório e suas referências para compreender melhor o mundo e participar de conversas sobre diferentes assuntos." },
  { name: "Comunicação", img: pilar1, text: "Aprenda a expressar seus pensamentos e sentimentos com mais clareza e a se posicionar com firmeza e educação por meio do método Comunicação FMA: Feminina, Magnética e Assertiva." },
  { name: "Feminilidade", img: pilar4, text: "Desenvolva uma feminilidade mais madura e natural por meio do curso Desperte Sua Essência Feminina, levando mais delicadeza, cuidado e leveza para a sua maneira de agir e se relacionar." },
  { name: "Inteligência emocional", img: pilar5, text: "Entenda melhor suas emoções, comportamentos e padrões para reagir com mais maturidade às situações do dia a dia. As aulas ajudam você a desenvolver mais paciência, equilíbrio e consciência sobre a maneira como lida consigo mesma e com as outras pessoas." },
  { name: "Elegância", img: pilar3, text: "Aprenda sobre postura, boas maneiras, etiqueta e comportamento para se sentir mais segura em diferentes ambientes, desde um almoço em família até um jantar, uma reunião profissional, uma viagem ou um evento mais sofisticado." },
];

const COURSES = [
  { img: cLiteratura, name: "Desvendando a Literatura", pillar: "Cultura", text: "Algumas das principais obras da literatura clássica, seus autores, contextos e ideias. Entre as aulas: Homero, Dante, Shakespeare, Jane Austen, Dostoiévski, Tolstói, Machado de Assis, George Orwell, Clarice Lispector e outros grandes nomes." },
  { img: cArte, name: "Museu da Dama", pillar: "Cultura", text: "Aproxime-se da arte e desenvolva referências para compreender obras, artistas e movimentos. Especial para quem gosta de visitar museus, viajar e conhecer lugares históricos." },
  { img: cHistoria, name: "Descobrindo a História", pillar: "Cultura", text: "Amplie seu repertório histórico e conheça acontecimentos e contextos que ajudam a compreender melhor a sociedade e a cultura." },
  { img: cComunicacao, name: "Comunicação FMA", pillar: "Comunicação", text: "Uma comunicação Feminina, Magnética e Assertiva para falar com mais clareza, expressar sentimentos e opiniões e se posicionar melhor." },
  { img: cFeminilidade, name: "Desperte Sua Essência Feminina", pillar: "Feminilidade", text: "Para mulheres que desejam desenvolver ou recuperar a feminilidade, trazendo mais delicadeza e leveza para a maneira como vivem e se relacionam." },
  { img: cLinguagens, name: "Linguagens do Amor", pillar: "Inteligência emocional", text: "Entenda as diferentes maneiras pelas quais as pessoas demonstram e recebem afeto e compreenda melhor seus relacionamentos." },
  { img: cApegos, name: "Mapa dos Apegos", pillar: "Inteligência emocional", text: "Conheça os diferentes padrões de apego e observe como eles aparecem na maneira como você se relaciona e estabelece vínculos." },
  { img: cTemperamentos, name: "Os 4 Temperamentos", pillar: "Inteligência emocional", text: "Conheça melhor o seu temperamento e o que influencia seu comportamento, suas emoções e a convivência com outras pessoas." },
  { img: cAnfitria, name: "Guia da Anfitriã Perfeita", pillar: "Elegância", text: "Princípios de etiqueta e hospitalidade para receber pessoas com mais segurança, cuidado e atenção aos detalhes." },
  { img: cRotina, name: "Rotina dos Sonhos", pillar: "Elegância", text: "Organize sua rotina de forma mais consciente, com espaço para as responsabilidades e para aquilo que é importante para você." },
];

type StackItem = { name: string; img: string; price?: number; note: string };
const CULT_STACK: StackItem[] = [
  { name: "Desvendando a Literatura", img: cLiteratura, price: 697, note: "Os grandes clássicos e seus autores, de Homero a Clarice Lispector" },
  { name: "Museu da Dama", img: cArte, price: 497, note: "Obras, artistas e movimentos para olhar a arte com outros olhos" },
  { name: "Descobrindo a História", img: cHistoria, price: 597, note: "Os acontecimentos que explicam o mundo de hoje" },
  { name: "Filosofia", img: biblioteca, note: "Os grandes pensadores, explicados de um jeito leve" },
];
const BONUS_STACK: StackItem[] = [
  { name: "Comunicação FMA", img: cComunicacao, price: 897, note: "Comunicação Feminina, Magnética e Assertiva" },
  { name: "Desperte Sua Essência Feminina", img: cFeminilidade, price: 997, note: "Mais delicadeza e leveza na forma de viver e se relacionar" },
  { name: "Linguagens do Amor", img: cLinguagens, price: 397, note: "Como as pessoas demonstram e recebem afeto" },
  { name: "Mapa dos Apegos", img: cApegos, price: 597, note: "Os padrões de apego por trás dos seus vínculos" },
  { name: "Os 4 Temperamentos", img: cTemperamentos, price: 497, note: "O que move o seu comportamento e as suas emoções" },
  { name: "Guia da Anfitriã Perfeita", img: cAnfitria, price: 497, note: "Etiqueta e hospitalidade para receber bem" },
  { name: "Rotina dos Sonhos", img: cRotina, price: 697, note: "Uma rotina com espaço para o que importa para você" },
];
const sumStack = (a: StackItem[]) => a.reduce((t, x) => t + (x.price ?? 0), 0);
const CULT_TOTAL = sumStack(CULT_STACK); // 1791
const BONUS_TOTAL = sumStack(BONUS_STACK); // 4579
const STACK_TOTAL = CULT_TOTAL + BONUS_TOTAL; // 6370
const brl = (v: number) => v.toLocaleString("pt-BR");

const OBJECTIONS: { q: string; a: string[] }[] = [
  {
    q: "“Mas eu não tenho tempo para assistir às aulas.”",
    a: [
      "Você não precisa passar horas por dia estudando para aproveitar a Escola. As aulas foram pensadas para caber na rotina e, com cerca de 15 minutos disponíveis, você já consegue assistir a um conteúdo e avançar aos poucos.",
      "Também é possível acompanhar muitas aulas apenas pelo áudio. Assim, você consegue estudar durante uma caminhada, enquanto organiza a casa, no deslocamento ou em outro momento que já faça parte do seu dia.",
      "Talvez você não tenha horas livres para estudar, mas alguns minutos que hoje acabam sendo consumidos pelas redes sociais podem se transformar em um tempo reservado para algo que você realmente gostaria de conhecer.",
    ],
  },
  {
    q: "“Acho que a Escola não é para mim porque não sou elegante ou feminina.”",
    a: [
      "Muitas mulheres entram justamente porque querem desenvolver essas características e nunca tiveram alguém que as ensinasse. Algumas contam que não aprenderam sobre postura, etiqueta ou boas maneiras na infância; outras dizem que a rotina e as responsabilidades fizeram com que se afastassem da própria feminilidade.",
      "Você não precisa chegar à Escola sabendo como se portar em todas as situações ou dominando os assuntos das aulas. É possível começar com pouco repertório, timidez, dificuldade de comunicação ou insegurança e escolher o ponto que mais precisa de atenção neste momento.",
    ],
  },
  {
    q: "“Será que já passei da idade?”",
    a: [
      "A Escola tem alunas em diferentes fases da vida, incluindo mulheres que estão começando a vida adulta e outras que estão próximas da aposentadoria. Os motivos também variam: carreira, casamento, maternidade, relacionamentos, crescimento pessoal ou simplesmente o desejo de voltar a estudar assuntos que sempre despertaram interesse.",
      "Muitas passaram anos dedicando a maior parte do tempo ao trabalho e à família e agora querem voltar a investir nelas mesmas. Não existe uma idade específica para melhorar sua comunicação, ampliar sua cultura ou aprender algo que sempre quis conhecer.",
    ],
  },
];

const FAQ: [string, string][] = [
  ["A Escola para Damas é um curso ou uma plataforma?", "É uma plataforma que reúne diversos cursos e aulas sobre cultura, elegância, comunicação, inteligência emocional, feminilidade, comportamento, relacionamentos e outros temas ligados à formação feminina."],
  ["Preciso assistir aos cursos em uma ordem específica?", "Não. Você pode começar pela área que mais desperta seu interesse ou que considera mais importante desenvolver neste momento e organizar seus estudos a partir daí."],
  ["Quanto tempo preciso ter disponível?", "Você pode adaptar o estudo à sua rotina. Com aproximadamente 15 minutos, já é possível assistir a muitas das aulas e avançar gradualmente."],
  ["Preciso ter conhecimento prévio sobre literatura, história, filosofia ou arte?", "Não. Os conteúdos também atendem mulheres que estão começando a desenvolver seu repertório e querem uma orientação para estudar esses assuntos."],
  ["Novos conteúdos são adicionados?", "Sim. A Escola recebe novos conteúdos, permitindo que sua formação continue ao longo da assinatura."],
  ["Como funciona a garantia?", "Você tem 7 dias para conhecer a Escola. Se decidir que o conteúdo não corresponde ao que procurava, poderá solicitar o reembolso dentro desse período, conforme as condições da garantia."],
  ["Ainda estou com dúvida. Posso falar com alguém?", "Sim. Clique no botão abaixo para conversar com nossa equipe pelo WhatsApp antes de fazer sua inscrição."],
];

/* ------------------------------------------------------------------ */
/* Pequenos componentes                                                */
/* ------------------------------------------------------------------ */
const d = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

const SectionHead = ({ n, label, center, rule = true }: { n: string; label: string; center?: boolean; rule?: boolean }) => (
  <div className="sh rv" style={center ? { justifyContent: "center" } : undefined}>
    <span className="n">{n}</span>
    <span className="l">{label}</span>
    {rule && <span className="r" />}
  </div>
);

const CtaLink = ({ children, variant = "", href = "#bonus" }: { children: ReactNode; variant?: string; href?: string }) => (
  <a href={href} className={`btn ${variant}`.trim()}>
    <span className="lbl">{children}</span>
    <span className="o"><Arrow /></span>
  </a>
);

const AccordionItem = ({
  open, onToggle, title, big, children,
}: { open: boolean; onToggle: () => void; title: string; big?: boolean; children: ReactNode }) => (
  <div className="rv">
    <div className={`ai${open ? " open" : ""}`}>
      <button type="button" className="ab" onClick={onToggle} aria-expanded={open}>
        <span className={`t serif${big ? " big" : ""}`}>{title}</span>
        <span className="x" aria-hidden="true" />
      </button>
      <div className="ad"><div>{children}</div></div>
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/* Modal de inscrição (mesma lógica da página principal)              */
/* ------------------------------------------------------------------ */
const LeadModal = ({ plan, onClose }: { plan: Plan | null; onClose: () => void }) => {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", countryCode: "+55" });
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string }>({});
  const formRef = useRef<HTMLFormElement>(null);
  const formId = plan === "mensal" ? KLICKSEND_MONTHLY_ID : KLICKSEND_ANNUAL_ID;

  useEffect(() => {
    if (plan) {
      setForm({ name: "", email: "", phone: "", countryCode: "+55" });
      setErrors({});
      setMounted(true);
      const r = requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
      document.body.style.overflow = "hidden";
      return () => cancelAnimationFrame(r);
    }
    setVisible(false);
    document.body.style.overflow = "";
    const t = window.setTimeout(() => setMounted(false), 500);
    return () => window.clearTimeout(t);
  }, [plan]);

  useEffect(() => {
    if (!plan) return;
    const onKey = (e: globalThis.KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [plan, onClose]);

  const phonePayload = (() => {
    const digits = form.phone.replace(/\D/g, "");
    const cc = form.countryCode.replace(/\D/g, "");
    const isBR = form.countryCode === "+55" && (digits.length === 10 || digits.length === 11);
    return {
      digits,
      phoneAc: isBR ? digits.slice(0, 2) : "",
      phoneNumber: isBR ? digits.slice(2) : digits,
      internationalPhone: `${cc}${digits}`,
    };
  })();

  const isObviousSequence = (digits: string) => {
    const asc = "0123456789", desc = "9876543210";
    if (digits.length >= 7 && (asc.includes(digits) || desc.includes(digits))) return true;
    for (let i = 0; i <= digits.length - 8; i++) {
      const chunk = digits.slice(i, i + 8);
      if (asc.includes(chunk) || desc.includes(chunk)) return true;
    }
    return false;
  };

  const isFakeNameWord = (word: string) => {
    const blacklist = ["teste", "test", "asdf", "qwerty", "qwer", "fulano", "ciclano", "beltrano", "abcdef", "abcde"];
    if (blacklist.includes(word.toLowerCase())) return true;
    if (/(.)\1{4,}/i.test(word)) return true;
    if (word.length >= 8) {
      const vowels = (word.match(/[aeiouáàâãéèêíìîóòôõúùûü]/gi) || []).length;
      const consonants = (word.match(/[bcdfghjklmnpqrstvwxyzçñ]/gi) || []).length;
      if (vowels === 0 || consonants === 0) return true;
    }
    return false;
  };

  const validate = () => {
    const e: typeof errors = {};
    const name = form.name.trim();
    const words = name.split(/\s+/).filter(Boolean);
    if (!/^[a-zA-ZÀ-ÿ'\-\s]+$/.test(name) || words.length < 2 || words.some(isFakeNameWord)) {
      e.name = "Insira seu nome e sobrenome reais.";
    }
    const email = form.email.toLowerCase().trim();
    const fakePattern = /^(teste?|test|fake|asd|qwe|abc|xxx|yyy|zzz|asdf|qwer|sample|example|noreply)/;
    const fakeDomain = /(hmail\.com|mailinator\.com|tempmail\.com|guerrillamail\.com|yopmail\.com|throwaway\.|fakeinbox\.com)/;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || fakePattern.test(email.split("@")[0]) || fakeDomain.test(email) || /^[bcdfghjklmnpqrstvwxyz]{5,}@/i.test(email)) {
      e.email = "Insira um e-mail válido e real.";
    }
    const dg = phonePayload.digits;
    if (dg.length < 8 || dg.length > 15 || /^(\d)\1+$/.test(dg) || /(\d)\1{6,}/.test(dg) || isObviousSequence(dg)) {
      e.phone = "Insira um número de WhatsApp válido.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formRef.current || !validate()) return;
    const fd = new FormData();
    const sendId = plan === "mensal" ? "woul7YL" : "7auwp7z";
    fd.append("first_name", form.name.trim());
    fd.append("phone", `+${phonePayload.internationalPhone}`);
    fd.append("email", form.email.trim());
    fd.append(`b_${sendId}`, "");
    const pageParams = new URLSearchParams(window.location.search).toString();
    const action = (plan === "mensal" ? HOTMART_SEND_MONTHLY_ACTION : HOTMART_SEND_ANNUAL_ACTION) + (pageParams ? "&" + pageParams : "");
    try {
      await Promise.race([
        fetch(action, { method: "POST", mode: "no-cors", body: fd }),
        new Promise((r) => setTimeout(r, 2500)),
      ]);
    } catch { /* segue para o checkout mesmo assim */ }
    const co = new URL(plan === "mensal" ? MONTHLY_CHECKOUT_URL : ANNUAL_CHECKOUT_URL);
    co.searchParams.set("name", form.name.trim());
    co.searchParams.set("email", form.email.trim());
    co.searchParams.set("phonenumber", `+${phonePayload.internationalPhone}`);
    new URLSearchParams(window.location.search).forEach((v, k) => co.searchParams.set(k, v));
    window.location.href = co.toString();
  };

  if (!mounted) return null;

  return (
    <div
      className={`modal show${visible ? " vis" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="b2-modal-title"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bz"><div className="cr">
        <button type="button" onClick={onClose} aria-label="Fechar"
          style={{ position: "absolute", top: "1.2rem", right: "1.2rem", width: "2.4rem", height: "2.4rem", borderRadius: 99, border: 0, background: "hsl(36 40% 94%/.06)", color: "var(--mute)", cursor: "pointer", display: "grid", placeItems: "center" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>
        <div style={{ textAlign: "center", marginBottom: "1.8rem" }}>
          <span className="eb"><i />{plan === "mensal" ? "Plano mensal · R$ 49,90/mês" : "Plano anual · 12x R$ 39,90"}</span>
          <h3 id="b2-modal-title" className="serif" style={{ fontSize: "var(--h3)", fontWeight: 300, marginTop: "1.1rem" }}>
            Só mais um <em className="gold">passo</em>
          </h3>
          <p className="mute" style={{ fontSize: ".88rem", marginTop: ".4rem" }}>Preencha seus dados e finalize sua inscrição no próximo passo.</p>
        </div>
        <form ref={formRef} onSubmit={handleSubmit} method="post" autoComplete="off" noValidate
          action={`https://handler.send.hotmart.com/subscription/${formId}?hotfeature=53`}>
          <div style={{ marginBottom: "1rem" }}>
            <label className="fl" htmlFor="b2-name">Nome completo</label>
            <input id="b2-name" className={`fld${errors.name ? " bad" : ""}`} name="first_name" placeholder="Seu nome e sobrenome" autoComplete="name"
              value={form.name} onChange={(e) => { setForm((f) => ({ ...f, name: e.target.value })); setErrors((x) => ({ ...x, name: undefined })); }} />
            {errors.name && <p className="err">{errors.name}</p>}
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label className="fl" htmlFor="b2-email">E-mail</label>
            <input id="b2-email" className={`fld${errors.email ? " bad" : ""}`} type="email" name="email" placeholder="seuemail@exemplo.com" autoComplete="email" inputMode="email"
              value={form.email} onChange={(e) => { setForm((f) => ({ ...f, email: e.target.value })); setErrors((x) => ({ ...x, email: undefined })); }} />
            {errors.email && <p className="err">{errors.email}</p>}
          </div>
          <div style={{ marginBottom: "1.6rem" }}>
            <label className="fl" htmlFor="b2-phone">WhatsApp</label>
            <div style={{ display: "flex", gap: ".5rem" }}>
              <input className="fld" style={{ width: "5rem", textAlign: "center", paddingInline: ".4rem" }} aria-label="DDI"
                value={form.countryCode} onChange={(e) => setForm((f) => ({ ...f, countryCode: e.target.value }))} />
              <input id="b2-phone" className={`fld${errors.phone ? " bad" : ""}`} type="tel" name="phone_display" placeholder="(41) 99887-5240" autoComplete="tel" inputMode="tel"
                value={form.phone} onChange={(e) => { setForm((f) => ({ ...f, phone: e.target.value })); setErrors((x) => ({ ...x, phone: undefined })); }} />
            </div>
            {errors.phone && <p className="err">{errors.phone}</p>}
          </div>
          <input type="hidden" name="phone" value={phonePayload.internationalPhone} />
          <input type="hidden" name="phoneac" value={phonePayload.phoneAc} />
          <input type="hidden" name="phonenumber" value={phonePayload.phoneNumber} />
          <div style={{ position: "absolute", left: "-5000px" }} aria-hidden="true">
            <input type="text" autoComplete="new-password" name={`b_${formId}`} tabIndex={-1} defaultValue="" />
          </div>
          <button type="submit" className="btn wide"><span className="lbl">Finalizar inscrição</span><span className="o"><Arrow /></span></button>
        </form>
      </div></div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */
const LandingCulturaBonus = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const phonesRef = useRef<HTMLDivElement>(null);
  const [phoneEdge, setPhoneEdge] = useState({ start: true, end: false });
  const phoneAnim = useRef(0);
  const [activePillar, setActivePillar] = useState(0);
  const [openObjection, setOpenObjection] = useState<number | null>(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [openCourses, setOpenCourses] = useState<Set<string>>(() => new Set());
  const toggleCourse = (i: string) =>
    setOpenCourses((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  const [plan, setPlan] = useState<Plan | null>(null);
  const [total, setTotal] = useState(0);
  const [totalCut, setTotalCut] = useState(false);
  // CTAs só aparecem depois das duas primeiras seções; depois dos planos, os botões levam aos planos
  const [ctaOn, setCtaOn] = useState(false);
  const [pastPlans, setPastPlans] = useState(false);

  const openPlan = (p: Plan) => {
    if (typeof window.fbq !== "undefined") window.fbq("track", "InitiateCheckout");
    setPlan(p);
  };
  const closePlan = useCallback(() => setPlan(null), []);

  // <head>: título, descrição e fontes (sem depender de bibliotecas extras)
  useEffect(() => {
    document.title = "Escola para Damas | Amplie seu repertório cultural";
    const setMeta = (name: string, content: string) => {
      let m = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
      if (!m) { m = document.createElement("meta"); m.name = name; document.head.appendChild(m); }
      m.content = content;
    };
    setMeta("description", "Aprenda arte, filosofia, história e literatura do zero, em aulas leves e no seu ritmo, com Letícia Fagundes.");
    setMeta("theme-color", "#1c0507");
    if (!document.querySelector('link[href*="family=Fraunces"]')) {
      const l = document.createElement("link");
      l.rel = "stylesheet";
      l.href = FONTS_URL;
      document.head.appendChild(l);
    }
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const html = document.documentElement;
    const prev = { ox: html.style.overflowX, sb: html.style.scrollBehavior, cs: html.style.colorScheme, bg: document.body.style.background };
    html.style.overflowX = "clip";
    html.style.colorScheme = "dark"; // barra de rolagem escura
    html.style.scrollBehavior = "smooth";
    document.body.style.background = "hsl(355 70% 6.5%)";

    const $ = <T extends Element>(s: string) => root.querySelector<T>(s);
    const $$ = (s: string) => Array.from(root.querySelectorAll(s));
    const observers: IntersectionObserver[] = [];

    // revelação ao rolar
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    $$(".rv,.rv-img").forEach((el) => io.observe(el));
    observers.push(io);

    // perguntas que "acendem" no centro da tela
    const hio = new IntersectionObserver((es) => es.forEach((e) => e.target.classList.toggle("on", e.isIntersecting)), { rootMargin: "-38% 0px -38% 0px" });
    $$(".hl,.hl2").forEach((el) => hio.observe(el));
    observers.push(hio);

    // barra de progresso + menu que se esconde
    const pb = $<HTMLDivElement>(".prog"), nav = $<HTMLElement>(".nav");
    let ly = 0, ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY, h = document.documentElement.scrollHeight - window.innerHeight;
        if (pb) pb.style.transform = `scaleX(${h > 0 ? y / h : 0})`;
        nav?.classList.toggle("hide", y > ly && y > window.innerHeight * 0.9);
        ly = y;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // CTA fixo no celular (some no hero, nos planos e no fechamento)
    const mc = $<HTMLDivElement>(".mcta");
    let pastIntro = false;
    const hidden = new Set<Element>();
    const upd = () => mc?.classList.toggle("show", pastIntro && hidden.size === 0);
    const introEnd = $("#caminho");
    if (introEnd) {
      const o = new IntersectionObserver(([e]) => {
        pastIntro = e.isIntersecting || e.boundingClientRect.top < 0;
        setCtaOn(pastIntro);
        upd();
      });
      o.observe(introEnd); observers.push(o);
    }
    const plansEl = $("#planos");
    if (plansEl) {
      const o = new IntersectionObserver(([e]) => setPastPlans(e.boundingClientRect.top < 0), { threshold: [0, 0.5, 1] });
      o.observe(plansEl); observers.push(o);
    }
    const pio = new IntersectionObserver((es) => { es.forEach((e) => (e.isIntersecting ? hidden.add(e.target) : hidden.delete(e.target))); upd(); }, { threshold: 0.15 });
    [$("#bonus"), $("#planos"), $(".fin")].forEach((el) => el && pio.observe(el));
    observers.push(pio);

    // contador da "nota fiscal"
    let raf = 0;
    const receipt = $("#stk-total");
    if (receipt) {
      const o = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return;
        o.disconnect();
        const t0 = performance.now(), D = 1600;
        const step = (t: number) => {
          const k = Math.min(1, (t - t0) / D);
          setTotal(Math.round(STACK_TOTAL * (1 - Math.pow(1 - k, 4))));
          if (k < 1) raf = requestAnimationFrame(step);
          else setTotalCut(true);
        };
        raf = requestAnimationFrame(step);
      }, { threshold: 0.5 });
      o.observe(receipt); observers.push(o);
    }

    return () => {
      observers.forEach((o) => o.disconnect());
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
      html.style.overflowX = prev.ox;
      html.style.scrollBehavior = prev.sb;
      html.style.colorScheme = prev.cs;
      document.body.style.background = prev.bg;
      document.body.style.overflow = "";
    };
  }, []);

  // carrossel dos depoimentos (setas no tablet/celular)
  const updatePhoneEdge = useCallback(() => {
    const ph = phonesRef.current;
    if (!ph) return;
    const max = ph.scrollWidth - ph.clientWidth;
    setPhoneEdge({ start: ph.scrollLeft <= 4, end: ph.scrollLeft >= max - 4 });
  }, []);
  useEffect(() => {
    const ph = phonesRef.current;
    if (!ph) return;
    const onS = () => requestAnimationFrame(updatePhoneEdge);
    ph.addEventListener("scroll", onS, { passive: true });
    window.addEventListener("resize", onS);
    updatePhoneEdge();
    return () => {
      ph.removeEventListener("scroll", onS);
      window.removeEventListener("resize", onS);
      cancelAnimationFrame(phoneAnim.current);
    };
  }, [updatePhoneEdge]);
  const slidePhones = (dir: number) => {
    const ph = phonesRef.current;
    if (!ph) return;
    cancelAnimationFrame(phoneAnim.current);
    const card = ph.querySelector<HTMLElement>(".phn");
    const step = card ? card.getBoundingClientRect().width + parseFloat(getComputedStyle(ph).columnGap || "0") : ph.clientWidth;
    const from = ph.scrollLeft, max = ph.scrollWidth - ph.clientWidth;
    const to = Math.max(0, Math.min(max, Math.round((from + dir * step) / step) * step));
    const t0 = performance.now(), D = 560;
    ph.style.scrollSnapType = "none"; // o encaixe atrapalha a animação; religa no fim
    const frame = (t: number) => {
      const k = Math.min(1, (t - t0) / D), e = 1 - Math.pow(1 - k, 3);
      ph.scrollLeft = from + (to - from) * e;
      if (k < 1) phoneAnim.current = requestAnimationFrame(frame);
      else { ph.style.scrollSnapType = ""; updatePhoneEdge(); }
    };
    phoneAnim.current = requestAnimationFrame(frame);
  };

  const renderCourse = (c: (typeof COURSES)[number], key: string) => {
    const open = openCourses.has(key);
    return (
      <article className={`cc${open ? " open" : ""}`} onPointerMove={tilt} onPointerLeave={untilt}>
        <div className="cv"><img src={c.img} alt={c.name} loading="lazy" decoding="async" width={480} height={714} /></div>
        <span className="pl">{c.pillar}</span>
        <button type="button" className="sm" aria-expanded={open} onClick={() => toggleCourse(key)}>
          <span className="pm" aria-hidden="true" />
          <span className="t">{open ? "Fechar" : "Ver mais"}</span>
        </button>
        <div className="cd"><div><h4>{c.name}</h4><p>{c.text}</p></div></div>
      </article>
    );
  };

  // pilares: hover no desktop, toque no celular
  const canHover = typeof window !== "undefined" && window.matchMedia("(hover:hover) and (min-width:901px)").matches;
  const onPillarKey = (i: number) => (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setActivePillar(i); }
  };

  // capas dos cursos com inclinação 3D (só com mouse)
  const tilt = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = e.currentTarget, r = el.getBoundingClientRect();
    el.style.setProperty("--ry", `${((e.clientX - r.left) / r.width - 0.5) * 12}deg`);
    el.style.setProperty("--rx", `${-((e.clientY - r.top) / r.height - 0.5) * 10}deg`);
  };
  const untilt = (e: PointerEvent<HTMLElement>) => {
    e.currentTarget.style.setProperty("--ry", "0deg");
    e.currentTarget.style.setProperty("--rx", "0deg");
  };

  return (
    <div className="lpb2" ref={rootRef}>

      <div className="grain" aria-hidden="true" />
      <div className="prog" aria-hidden="true" />

      <nav className="nav" aria-label="Navegação">
        <a href="#topo" className="brand logo" aria-label="Escola para Damas, início"><img src={logoEscola} alt="Escola para Damas" width={42} height={42} /></a>
        <a href="#cultura" className="lk">Cultura</a>
        <a href="#cursos" className="lk">Cursos</a>
        <a href="#alunas" className="lk">Alunas</a>
        <a href="#duvidas" className="lk">Dúvidas</a>
        {ctaOn && <CtaLink href={pastPlans ? "#planos" : "#bonus"}>{pastPlans ? "Ver planos" : "Ver o que está incluso"}</CtaLink>}
      </nav>

      {/* ============ HERO ============ */}
      <section className="hero hero-cult" id="topo">
        <div className="bg">
          <img className="d" src={heroC1920.url} srcSet={`${heroC1280.url} 1280w, ${heroC1920.url} 1920w`} sizes="100vw"
            alt="Letícia Fagundes, fundadora da Escola para Damas" {...HIGH_PRIORITY} decoding="async" />
          <img className="m" src={heroCMobile} alt="" {...HIGH_PRIORITY} decoding="async" />
        </div>
        <div className="shade" />
        <div className="wrap in-w">
          <span className="eb fade-in" style={d(0.15)}><i />Escola para Damas</span>
          <p className="kick fade-in" style={d(0.25)}>Para a mulher que quer ter o que dizer <em>quando a conversa fica boa</em></p>
          <h1 className="serif" aria-label="Amplie seu repertório cultural">
            {[HEADLINE.slice(0, 2), HEADLINE.slice(2)].map((line, li) => (
              <span className="ln" key={li}>
                {line.map((w, j) => {
                  const i = li * 2 + j;
                  return (
                    <span key={i}>
                      <span className="w"><span style={{ "--i": i } as CSSProperties} className={i > 1 ? "gold it" : undefined}>{w}</span></span>
                      {j < line.length - 1 ? " " : null}
                    </span>
                  );
                })}
                {li === 0 ? " " : null}
              </span>
            ))}
          </h1>
          <p className="sub fade-in" style={d(1.05)}>
            Aulas de arte, filosofia, história e literatura explicadas do zero, em aulas leves e no seu ritmo. Sem precisar ter lido nada antes.
          </p>
          <ul className="cchips fade-in" style={d(1.12)} aria-label="Assuntos">
            {CULTURE_CHIPS.map((c) => <li key={c}>{c}</li>)}
          </ul>
          <a href="#cultura" className="hcue fade-in" style={d(1.2)}>Role para continuar<span aria-hidden="true" /></a>
          <div className="lchip fade-in" style={d(1.35)}>
            <img src={leticiaAvatar} alt="Letícia Fagundes" width={56} height={56} />
            <p><b>com Letícia Fagundes</b>fundadora da Escola e mentora de mulheres</p>
          </div>
        </div>
        <div className="scrollcue" aria-hidden="true">Role</div>
      </section>

      {/* ============ I O JANTAR ============ */}
      <section className="sup pad" id="cultura">
        <div className="wrap sup-g">
          <div className="stick">
            <div className="bz rv-img"><div className="cr ph"><img src={cult9598} alt="Letícia Fagundes segurando uma xícara de chá" loading="lazy" decoding="async" /></div></div>
            <p className="rv mute" style={{ fontSize: ".85rem", marginTop: "1.1rem", fontStyle: "italic" }}>E você ali, sorrindo e mexendo no copo.</p>
          </div>
          <div>
            <SectionHead n="I" label="Você já viveu isso?" />
            <h2 className="h2 serif rv">O jantar estava ótimo até alguém falar de <em className="gold">Van Gogh</em>.</h2>
            <div style={{ marginTop: "2.5rem", borderTop: "1px solid var(--hair)" }}>
              <p className="hl">Depois veio Dostoiévski. Depois, uma frase de Platão. <span className="q">E você torcendo para ninguém perguntar o que você achava.</span></p>
              <p className="hl">Você até queria entrar na conversa, <span className="q">mas não sabia por onde começar.</span></p>
              <p className="hl">E saiu de lá com a sensação de que todo mundo leu alguma coisa que você não leu.</p>
            </div>
            <div className="ans rv">
              <p className="p" style={{ color: "hsl(36 40% 94%/.85)" }}>
                Não é falta de inteligência.{" "}
                <span className="serif it" style={{ color: "var(--gold-2)", fontSize: "1.12em" }}>É falta de alguém que te explique cultura de um jeito simples.</span>{" "}
                Foi para isso que a Escola para Damas nasceu.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ II NA PRÁTICA ============ */}
      <section className="light pad">
        <div className="wrap six-g">
          <div className="stack">
            <div className="a bz lt rv" style={d(0.05)}><div className="cr"><img src={cult9609} alt="Letícia Fagundes lendo um livro na cadeira" loading="lazy" decoding="async" /></div></div>
            <div className="b bz lt rv" style={d(0.2)}><div className="cr"><img src={cult9614} alt="Letícia Fagundes lendo sentada no tapete" loading="lazy" decoding="async" /></div></div>
            <span className="tag t-rep rv" style={{ left: "44%", top: "46%", ...d(0.45) }}>mais repertório</span>
            <span className="tag rv" style={{ left: "-2%", top: "6%", ...d(0.55) }}>mais segurança</span>
          </div>
          <div>
            <SectionHead n="II" label="Na prática" />
            <h2 className="h2 serif rv" style={{ color: "var(--ink)" }}>Assuntos que toda <em style={{ color: "var(--wine-2)" }}>mulher interessante</em> domina</h2>
            <ul className="imag">
              {[
                "Por que a Mona Lisa é tão famosa, e o que olhar quando você estiver diante de um quadro.",
                "O que os filósofos gregos ensinam sobre a vida, a felicidade e as relações.",
                "Quais clássicos da literatura valem a leitura, e por onde começar cada um.",
                "Como a história ajuda a entender o mundo de hoje, das notícias às viagens.",
                "Como trazer tudo isso para uma conversa de forma natural, sem parecer que está dando aula.",
              ].map((t, i) => (
                <li key={i} className="rv hl2" style={d(i * 0.05)}><span className="k">{["i.", "ii.", "iii.", "iv.", "v."][i]}</span><span>{t}</span></li>
              ))}
            </ul>
            <p className="pull rv hl2">Cultura não é decorar datas. É ter o que dizer quando a conversa fica boa.</p>
          </div>
        </div>
      </section>

      {/* ============ III CURSOS DE CULTURA ============ */}
      <section className="pil pad" id="caminho">
        <div className="wrap">
          <SectionHead n="III" label="Seu caminho na cultura" />
          <h2 className="h2 serif rv" style={{ maxWidth: "15ch" }}>Quatro cursos para <em className="gold">construir seu repertório</em></h2>
          <div className="cgrid cgrid4">
            {CULTURE_COURSES.map((c, i) => (
              <div key={c.name} className="rv" style={d(i * 0.06)}>
                {renderCourse(c, `cult${i}`)}
              </div>
            ))}
          </div>
          <div className="more rv">
            <p>Tudo explicado do básico. Você começa do zero e avança no seu ritmo, pelo celular, quando quiser.</p>
            <CtaLink variant="gold-b">Ver tudo o que está incluso</CtaLink>
          </div>
        </div>
      </section>

      {/* ============ IV BÔNUS ============ */}
      <section className="pil pad" id="pilares">
        <div className="wrap">
          <SectionHead n="IV" label="Incluído na mesma assinatura" />
          <h2 className="h2 serif rv" style={{ maxWidth: "15ch" }}>E você ainda leva <em className="gold">a Escola inteira</em></h2>
          <p className="p mute rv" style={{ marginTop: "1.6rem", maxWidth: "40rem" }}>A assinatura não libera só os cursos de cultura. Você tem acesso aos outros pilares da Escola para Damas, sem pagar nada a mais.</p>
          <div className="acc5 rv">
            {PILLARS.slice(1).map((p, i) => (
              <div
                key={p.name}
                className={`pn${activePillar === i ? " on" : ""}`}
                tabIndex={0}
                role="button"
                aria-label={p.name}
                aria-expanded={activePillar === i}
                onClick={() => setActivePillar(i)}
                onMouseEnter={canHover ? () => setActivePillar(i) : undefined}
                onKeyDown={onPillarKey(i)}
              >
                <img src={p.img} alt="" loading="lazy" decoding="async" />
                <div className="sh2" />
                <span className="num">0{i + 1}</span>
                <span className="vt">{p.name}</span>
                <div className="tx"><span className="k">Pilar 0{i + 1}</span><h3>{p.name}</h3><p>{p.text}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ V CURSOS ============ */}
      <section className="crs pad" id="cursos">
        <div className="wrap">
          <SectionHead n="V" label="Os cursos" />
          <h2 className="h2 serif rv" style={{ maxWidth: "15ch" }}>Conheça os cursos da <em className="gold">Escola para Damas</em></h2>
          <div className="cgrid">
            {COURSES.map((c, i) => (
              <div key={c.name} className="rv" style={d((i % 5) * 0.06)}>
                {renderCourse(c, `g${i}`)}
              </div>
            ))}
          </div>
          {/* desktop: fileira de cima anda para a esquerda, a de baixo para a direita (pausa ao passar o mouse) */}
          <div className="cmq">
            {[COURSES.slice(0, 5), COURSES.slice(5)].map((row, r) => (
              <div key={r} className={`cmq-row rv${r === 1 ? " rev" : ""}`}>
                <div className="cmq-tr">
                  {[0, 1].map((copy) => row.map((c, i) => <div key={`${copy}-${i}`}>{renderCourse(c, `m${r}-${copy}-${i}`)}</div>))}
                </div>
              </div>
            ))}
          </div>
          <div className="more rv">
            <p>Além dos cursos que já estão disponíveis, novas aulas e conteúdos continuam sendo adicionados à Escola.</p>
            <CtaLink>Quero ver tudo o que eu levo</CtaLink>
          </div>
          <div className="stats rv">
            <div className="stat"><b>+10</b><span>cursos inclusos</span></div>
            <div className="stat"><b>5</b><span>pilares de formação</span></div>
            <div className="stat"><b>15<small style={{ fontSize: ".45em" }}> min</small></b><span>para avançar por dia</span></div>
            <div className="stat"><b>7<small style={{ fontSize: ".45em" }}> dias</small></b><span>de garantia</span></div>
          </div>
        </div>
      </section>

      {/* ============ VI DEPOIMENTOS ============ */}
      <section className="dep pad" id="alunas">
        <div className="wrap">
          <div className="narrow" style={{ textAlign: "center", maxWidth: "46rem" }}>
            <SectionHead n="VI" label="A voz das alunas" center rule={false} />
            <h2 className="h2 serif rv">Veja o que as alunas <em className="gold">estão falando</em></h2>
            <p className="p mute rv" style={{ marginTop: "1.6rem" }}>Mulheres de diferentes idades e fases da vida já fazem parte da Escola. Algumas chegaram buscando mais cultura, outras queriam melhorar a comunicação, a elegância ou a feminilidade, e há também quem tenha encontrado na Escola uma maneira de voltar a reservar tempo para si mesma.</p>
          </div>
          <DepoimentosLoop />
          <div className="rv" style={{ display: "flex", justifyContent: "center", marginTop: "3.5rem" }}>
            <CtaLink variant="gold-b">Ver o que está incluso</CtaLink>
          </div>
        </div>
      </section>

      {/* ============ VII PILHA DE VALOR (destino dos botões) ============ */}
      <section className="stk pad" id="bonus">
        <div className="wrap" style={{ maxWidth: "64rem" }}>
          <div className="narrow" style={{ textAlign: "center" }}>
            <SectionHead n="VII" label="Tudo o que você recebe" center rule={false} />
            <h2 className="h2 serif rv">Antes do preço, veja <em className="gold">tudo o que você leva</em></h2>
            <p className="p mute rv" style={{ marginTop: "1.6rem" }}>Este é o conteúdo do Plano Anual. Ao lado de cada curso está quanto ele custaria se você comprasse separado.</p>
          </div>

          {/* bloco 1: a formação em cultura */}
          <div className="stk-blk main rv">
            <div className="stk-hd">
              <span className="k">O que você veio buscar</span>
              <h3>Formação em Cultura</h3>
            </div>
            <ul className="stk-list">
              {CULT_STACK.map((c) => (
                <li key={c.name}>
                  <img src={c.img} alt="" loading="lazy" decoding="async" width={52} height={77} />
                  <div className="nm"><b>{c.name}</b><span>{c.note}</span></div>
                  <span className="pv">{c.price ? `R$ ${brl(c.price)}` : "incluso"}</span>
                </li>
              ))}
            </ul>
            <div className="stk-sub"><span>Só a formação em cultura</span><b>R$ {brl(CULT_TOTAL)}</b></div>
          </div>

          <p className="stk-note serif rv">Só isso já custaria mais do que <em>um ano inteiro de Escola</em>. E ainda tem mais.</p>

          {/* bloco 2: bônus, o resto da Escola */}
          <div className="stk-blk rv">
            <div className="stk-hd">
              <span className="k">De bônus na mesma assinatura</span>
              <h3>Os outros cursos da Escola</h3>
            </div>
            <ul className="stk-list">
              {BONUS_STACK.map((c, i) => (
                <li key={c.name}>
                  <img src={c.img} alt="" loading="lazy" decoding="async" width={52} height={77} />
                  <div className="nm"><i>Bônus {String(i + 1).padStart(2, "0")}</i><b>{c.name}</b><span>{c.note}</span></div>
                  <span className="pv">R$ {brl(c.price ?? 0)}</span>
                </li>
              ))}
              <li className="club">
                <span className="ic" aria-hidden="true">✦</span>
                <div className="nm"><i>Bônus {String(BONUS_STACK.length + 1).padStart(2, "0")}</i><b>Clube das Damas</b><span>Grupo VIP no WhatsApp e encontros mensais</span></div>
                <span className="pv">exclusivo</span>
              </li>
            </ul>
            <div className="stk-sub"><span>Bônus</span><b>R$ {brl(BONUS_TOTAL)}</b></div>
          </div>

          {/* total */}
          <div className="stk-tot rv" id="stk-total">
            <span className="k">Se você comprasse tudo separado</span>
            <span className={`v${totalCut ? " cut" : ""}`}>R$ {brl(total)}</span>
            <p>Mas você não vai pagar nem perto disso.</p>
            <a href="#planos" className="stk-go">Role e veja o valor real<span aria-hidden="true" /></a>
          </div>
        </div>
      </section>

      {/* ============ VIII PLANOS ============ */}
      <section className="plans-s pad" id="planos">
        <div className="wrap" style={{ maxWidth: "66rem" }}>
          <div className="narrow" style={{ textAlign: "center" }}>
            <SectionHead n="VIII" label="O valor real" center rule={false} />
            <h2 className="h2 serif rv">Tudo isso, por <em className="gold">muito menos</em></h2>
            <p className="p mute rv" style={{ marginTop: "1.4rem" }}>Você viu que só a formação em cultura passaria de R$ {brl(CULT_TOTAL)}. No Plano Anual, você leva ela e todos os bônus por bem menos do que isso.</p>
          </div>
          <div className="plans">
            <div className="plan bz rv"><div className="cr">
              <h3>Plano Mensal</h3>
              <div className="pr"><b>R$ 49,90</b><span className="mute">/mês</span></div>
              <p className="pnote">Acesso por 30 dias · cancele quando quiser</p>
              <ul className="inc">
                {["Acesso às aulas da Lê", "Desperte Sua Essência Feminina", "Rotina dos Sonhos", "Os 4 Temperamentos", "Linguagens do Amor", "Um curso novo liberado por mês"].map((x) => (
                  <li key={x}><Check /><span>{x}</span></li>
                ))}
              </ul>
              <p className="incl no-t">Não inclui:</p>
              <ul className="inc">
                <li className="no"><Cross /><span>Os outros 9 cursos <em>(Comunicação FMA, Literatura, História, Filosofia…)</em></span></li>
                <li className="no"><Cross /><span>Bônus: Clube das Damas</span></li>
                <li className="no"><Cross /><span>Pagamento em até 12x sem juros</span></li>
              </ul>
              <div className="cta">
                <button type="button" className="btn ghost wide" onClick={() => openPlan("mensal")}>
                  <span className="lbl">Assinar plano mensal</span><span className="o" style={{ background: "hsl(38 70% 57%/.1)" }}><Arrow /></span>
                </button>
              </div>
            </div></div>
            <div className="plan y rv" style={d(0.1)}>
              <span className="ribbon">Inclui o Clube das Damas</span>
              <div className="cr">
                <h3>Plano Anual</h3>
                <p className="was">De <s>R$ {brl(STACK_TOTAL)}</s> por</p>
                <div className="pr"><span className="mute" style={{ fontSize: "1.1rem" }}>12x</span><b className="gold">R$ 39,90</b></div>
                <p className="pnote">ou R$ 478,80 à vista · 12 meses de acesso</p>
                <p className="incl">Tudo do mensal, mais:</p>
                <div className="chips">
                  {["Comunicação FMA", "Desvendando a Literatura", "Museu da Dama", "Descobrindo a História", "Mapa dos Apegos", "Guia da Anfitriã Perfeita", "Filosofia", "Inteligência Emocional", "Instagram da Dama"].map((x) => (
                    <span key={x}>{x}</span>
                  ))}
                </div>
                <ul className="inc">
                  <li><Check /><span><b style={{ color: "var(--gold-2)", fontWeight: 600 }}>Bônus: Clube das Damas</b> — grupo VIP no WhatsApp e encontros mensais</span></li>
                  <li><Check /><span>Todos os cursos novos lançados no ano</span></li>
                  <li><Check /><span>Em até 12x sem juros</span></li>
                  <li><Check /><span>Acesso completo por 12 meses</span></li>
                  <li><Check /><span>Um ano de conteúdo exclusivo</span></li>
                </ul>
                <div className="cta">
                  <button type="button" className="btn wide" onClick={() => openPlan("anual")}>
                    <span className="lbl">Quero o plano anual</span><span className="o"><Arrow /></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ IX OBJEÇÕES + GARANTIA ============ */}
      <section className="pad" style={{ background: "var(--ink)" }}>
        <div className="wrap narrow" style={{ maxWidth: "56rem" }}>
          <SectionHead n="IX" label="A Escola é para você" />
          <div className="ac">
            {OBJECTIONS.map((o, i) => (
              <AccordionItem key={i} big title={o.q} open={openObjection === i} onToggle={() => setOpenObjection(openObjection === i ? null : i)}>
                {o.a.map((p, j) => <p key={j}>{p}</p>)}
              </AccordionItem>
            ))}
          </div>
          <div className="guar">
            <div className="seal rv">
              <svg className="sring" viewBox="0 0 200 200" aria-hidden="true">
                <defs><path id="b2-cp" d="M100,100 m-82,0 a82,82 0 1,1 164,0 a82,82 0 1,1 -164,0" /></defs>
                <text fontSize="11.5" letterSpacing="4.2" fill="hsl(38 70% 65%)" fontFamily="DM Sans" fontWeight={600}>
                  <textPath href="#b2-cp">GARANTIA DE 7 DIAS ✦ RISCO ZERO ✦ GARANTIA DE 7 DIAS ✦ RISCO ZERO ✦</textPath>
                </text>
              </svg>
              <div className="c"><div><b>7</b><span>dias</span></div></div>
            </div>
            <div>
              <span className="eb rv"><i />Garantia de 7 dias</span>
              <h3 className="serif rv" style={{ fontSize: "var(--h3)", fontWeight: 300, lineHeight: 1.15, margin: "1.2rem 0 1.1rem" }}>
                Entre, conheça a Escola e veja se ela <em className="gold">faz sentido para você.</em>
              </h3>
              <p className="p mute rv">Você terá 7 dias para acessar a plataforma, conhecer os cursos e assistir às aulas. Esse período permite que você avalie a experiência com mais segurança antes de decidir continuar.</p>
              <p className="p mute rv" style={{ marginTop: ".8rem" }}>Caso perceba dentro do prazo da garantia que a Escola não corresponde ao que procurava, basta solicitar o cancelamento e o reembolso conforme as condições informadas na compra.</p>
              <div className="rv" style={{ marginTop: "2rem" }}><CtaLink variant="gold-b" href="#planos">Quero conhecer a Escola</CtaLink></div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ X LETÍCIA ============ */}
      <section className="let pad" style={{ background: "radial-gradient(ellipse 60% 60% at 20% 40%,hsl(355 55% 18%/.5),transparent 70%),var(--deep)" }}>
        <div className="wrap let-g">
          <div className="port rv">
            <div className="bz"><div className="cr"><img src={leticiaRetrato} alt="Letícia Fagundes" loading="lazy" decoding="async" /></div></div>
            <div className="sig"><b>Letícia Fagundes</b><span>Psicanalista &amp; mentora</span></div>
          </div>
          <div>
            <SectionHead n="X" label="Quem criou a Escola" />
            <h2 className="h2 serif rv">Conheça <em className="gold">Letícia Fagundes</em></h2>
            <div className="rv" style={{ display: "flex", flexDirection: "column", gap: "1.2rem", marginTop: "1.8rem" }}>
              <p className="p mute">Sou psicanalista, terapeuta e mentora de mulheres. Há anos estudo temas relacionados à feminilidade, cultura, comunicação, elegância, comportamento e inteligência emocional, assuntos que acabaram se encontrando na criação da Escola para Damas.</p>
              <p className="p mute">Percebi que muitas mulheres tinham vontade de estudar esses temas, mas encontravam o conhecimento espalhado. Era preciso procurar uma referência para literatura, outra para arte, alguém para falar sobre comunicação e conteúdos isolados sobre elegância, relacionamentos e feminilidade.</p>
              <p className="p mute">Também percebi quantas mulheres sentiam que poderiam se desenvolver mais, mesmo sendo inteligentes, competentes e tendo uma vida já construída. Algumas queriam recuperar interesses que ficaram esquecidos, enquanto outras estavam apenas começando a descobrir a mulher que gostariam de ser.</p>
              <p className="p" style={{ color: "var(--cream)" }}>Criei a Escola para organizar essa formação em um só lugar e torná-la parte da rotina de mulheres que desejam continuar aprendendo e se aprimorando ao longo da vida.</p>
            </div>
            <div className="bq rv"><p>Para mim, ser uma dama tem muito mais relação com aquilo que uma mulher cultiva do que com uma imagem perfeita. Conhecimento, educação, postura, gentileza, inteligência, feminilidade e a disposição de continuar evoluindo fazem parte desse processo.</p></div>
            <div className="rv" style={{ marginTop: "2.2rem" }}><CtaLink href="#planos">Quero ser aluna da Letícia</CtaLink></div>
          </div>
        </div>
      </section>

      {/* ============ XI FAQ ============ */}
      <section className="pad" id="duvidas" style={{ background: "var(--ink)" }}>
        <div className="wrap narrow" style={{ maxWidth: "56rem" }}>
          <SectionHead n="XI" label="Dúvidas frequentes" />
          <h2 className="h2 serif rv" style={{ marginBottom: "2.5rem" }}>Dúvidas <em className="gold">frequentes</em></h2>
          <div className="ac">
            {FAQ.map(([q, a], i) => (
              <AccordionItem key={i} title={q} open={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? null : i)}>
                <p>{a}</p>
              </AccordionItem>
            ))}
          </div>
          <div className="rv" style={{ marginTop: "2.5rem" }}>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn ghost">
              <span style={{ display: "flex", alignItems: "center", gap: ".7rem" }}><WhatsIcon /><span className="lbl">Falar com uma especialista</span></span>
            </a>
          </div>
        </div>
      </section>

      {/* ============ XII FECHAMENTO ============ */}
      <section className="fin">
        <div className="bg">
          <img className="d" src={col1920} srcSet={`${col1280} 1280w, ${col1920} 1920w`} sizes="100vw" alt="" loading="lazy" decoding="async" />
          <img className="m" src={colMobile} alt="" loading="lazy" decoding="async" />
        </div>
        <div className="shade" />
        <div className="wrap" style={{ width: "100%", paddingBlock: "8rem" }}>
          <span className="eb rv"><i />Daqui para frente</span>
          <h2 className="serif rv" style={{ marginTop: "1.6rem" }}>Na próxima conversa, <em className="gold">você entra nela.</em></h2>
          <p className="p rv" style={{ maxWidth: "34rem", marginTop: "1.8rem", color: "hsl(36 40% 94%/.72)" }}>Você pode entrar na Escola porque quer finalmente entender melhor literatura e arte, porque gostaria de falar com mais segurança, porque sente falta de ser mais feminina ou simplesmente porque percebeu que passou tempo demais consumindo conteúdos que pouco acrescentaram à sua vida.</p>
          <p className="p rv" style={{ maxWidth: "34rem", marginTop: "1rem", color: "var(--cream)" }}>Independentemente do ponto de partida, você encontrará uma escola em que estudar, desenvolver repertório e cuidar da própria formação voltam a ocupar um espaço na sua rotina.</p>
          <div className="rv" style={{ marginTop: "2.4rem" }}><CtaLink variant="gold-b" href="#planos">Quero me tornar uma dama</CtaLink></div>
          <p className="rv" style={{ marginTop: "2.6rem", maxWidth: "30rem", fontSize: ".85rem", lineHeight: 1.6, color: "var(--faint)" }}>
            <span className="serif it" style={{ color: "var(--gold-2)", fontSize: "1.1rem" }}>Escola para Damas</span>. Cultura, elegância, comunicação, inteligência emocional e feminilidade reunidas em uma formação para mulheres que querem continuar se aprimorando.
          </p>
        </div>
      </section>

      <footer>© {new Date().getFullYear()} Escola para Damas · Todos os direitos reservados</footer>

      {/* barra flutuante (celular): antes dos planos leva à pilha de bônus, depois leva aos planos */}
      <div className="mcta">
        <p><b>+10 cursos inclusos</b>7 dias de garantia</p>
        <a href={pastPlans ? "#planos" : "#bonus"} className="btn">
          <span className="lbl">{pastPlans ? "Ver planos" : "Ver o que está incluso"}</span>
          <span className="o"><Arrow /></span>
        </a>
      </div>

      <LeadModal plan={plan} onClose={closePlan} />
    </div>
  );
};

export default LandingCulturaBonus;
