/**
 * Escola para Damas, página de captura da aula gratuita (VSL).
 * Fluxo: anúncio -> esta página -> formulário próprio no Hotmart Send ([VSL] AULA ESCOLA DAMAS)
 * -> página da aula em aula.escolaparadamas.com.br (com as UTMs repassadas).
 * Estilo: src/styles/landing-ebook.css (escopo .lpeb, classes ae-*).
 */
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import "@/styles/landing-ebook.css";

import leticiaSorriso from "@/assets/ebook/leticia-sorriso.webp";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

const SEND_FORM_ID = "Mou1dQL";
const SEND_ACTION = `https://handler.send.hotmart.com/subscription/${SEND_FORM_ID}?hotfeature=53`;
const AULA_URL = "https://aula.escolaparadamas.com.br/";
const FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..700;1,400..700&family=DM+Sans:opsz,wght@9..40,300..700&display=swap";

const TEMAS = [
  ["Presença", "Como a postura, o olhar e a calma fazem você ser notada antes de dizer uma palavra."],
  ["Conversa", "Falar pouco e dizer muito: o que separa a mulher interessante da que só ocupa espaço."],
  ["Cultura", "Por que repertório muda a forma como você é vista, num jantar ou numa entrevista."],
  ["À mesa", "Guardanapo, talheres e taças: os detalhes que entregam se você sabe ou não se portar."],
  ["Firmeza", "Como transformar a raiva em força serena e ser respeitada sem levantar a voz."],
];

const LandingAulaEscola = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string }>({});
  const [sending, setSending] = useState(false);

  useEffect(() => {
    document.title = "Aula gratuita com Letícia Fagundes | Escola para Damas";
    if (!document.querySelector(`link[href="${FONTS_URL}"]`)) {
      const l = document.createElement("link");
      l.rel = "stylesheet";
      l.href = FONTS_URL;
      document.head.appendChild(l);
    }
  }, []);

  const digits = form.phone.replace(/\D/g, "");

  const validate = () => {
    const e: typeof errors = {};
    if (!/^[a-zA-ZÀ-ÿ'\-\s]+$/.test(form.name.trim()) || form.name.trim().length < 2) e.name = "Insira seu nome.";
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
    fd.append("phone", `+${intl}`);
    fd.append("email", form.email.trim());
    fd.append(`b_${SEND_FORM_ID}`, "");
    const params = new URLSearchParams(window.location.search).toString();
    try {
      await Promise.race([
        fetch(SEND_ACTION + (params ? "&" + params : ""), { method: "POST", mode: "no-cors", body: fd }),
        new Promise((r) => setTimeout(r, 2500)),
      ]);
    } catch {
      /* segue para a aula mesmo assim */
    }
    window.fbq?.("track", "Lead");
    const dest = new URL(AULA_URL);
    new URLSearchParams(window.location.search).forEach((v, k) => dest.searchParams.set(k, v));
    window.location.href = dest.toString();
  };

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
    <div className="lpeb">
      <section className="ae-hero">
        <div className="eb-wrap eb-brand">ESCOLA PARA DAMAS</div>
        <div className="eb-wrap ae-grid">
          <div className="ae-copy">
            <span className="eb-eye">Aula gratuita · Letícia Fagundes</span>
            <h1>
              Como se tornar uma mulher mais <em>interessante, inteligente e refinada</em>
            </h1>
            <p className="eb-lead">
              Uma aula de cerca de 40 minutos sobre o que ninguém ensinou às mulheres: <b>presença, conversa, cultura e elegância</b> para ser respeitada e admirada em qualquer ambiente.
            </p>
            <div className="ae-photo">
              <img src={leticiaSorriso} alt="Letícia Fagundes" fetchPriority="high" />
              <div>
                <b>Letícia Fagundes</b>
                <span>Fundadora da Escola para Damas</span>
              </div>
            </div>
          </div>

          <div className="ae-card" id="inscricao">
            <h2>
              Assista <em>agora</em>, de graça
            </h2>
            <p>Preencha para liberar a aula. Ela abre logo em seguida, nesta mesma tela.</p>
            <form onSubmit={submit} noValidate autoComplete="on">
              {field("name", "Seu nome", { placeholder: "Como você gosta de ser chamada", autoComplete: "given-name" })}
              {field("phone", "WhatsApp", { type: "tel", placeholder: "(41) 99999-9999", autoComplete: "tel", inputMode: "tel" })}
              {field("email", "E-mail", { type: "email", placeholder: "seuemail@exemplo.com", autoComplete: "email", inputMode: "email" })}
              <button type="submit" className="eb-btn wide" disabled={sending}>
                <span>{sending ? "Abrindo a aula" : "Quero assistir à aula"}</span>
              </button>
              <small>Seus dados ficam só com a equipe da Escola para Damas.</small>
            </form>
          </div>
        </div>
      </section>

      <section className="eb-sec eb-cream">
        <div className="eb-wrap">
          <span className="eb-eye">Na aula</span>
          <h2>
            O que a Letícia vai <em>te mostrar</em>
          </h2>
          <div className="ae-temas">
            {TEMAS.map(([t, d], i) => (
              <div className="eb-sit-c" key={t}>
                <span className="n">{String(i + 1).padStart(2, "0")}</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
          <div className="eb-center">
            <a href="#inscricao" className="eb-btn">
              Quero assistir à aula
            </a>
          </div>
        </div>
      </section>

      <footer className="eb-foot">Escola para Damas · Letícia Fagundes</footer>
    </div>
  );
};

export default LandingAulaEscola;
