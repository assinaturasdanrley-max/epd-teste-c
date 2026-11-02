/**
 * Escola para Damas, página de obrigado do funil do e-book Etiqueta Essencial.
 * Recebe quem comprou só o e-book e quem também entrou na Escola (as duas saídas do Funil de Vendas da Hotmart).
 * Estilo: src/styles/landing-ebook.css (escopo .lpeb, classes .ty-*).
 */
import { useEffect } from "react";
import "@/styles/landing-ebook.css";
import capa from "@/assets/ebook/capa.webp";
import leticiaSorriso from "@/assets/ebook/leticia-sorriso.webp";

const FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..700;1,400..700&family=DM+Sans:opsz,wght@9..40,300..700&display=swap";
const AREA_URL = "https://consumer.hotmart.com";
const SUPORTE_WHATS =
  "https://wa.me/5541998875240?text=" +
  encodeURIComponent("Olá equipe, comprei o e-book Etiqueta Essencial para Damas e preciso de ajuda com o meu acesso.");
const SUPORTE_EMAIL = "contato@leticiafagundes.com.br";

const PASSOS: [string, string][] = [
  ["Abra o seu e-mail", "A Hotmart envia o acesso para o mesmo e-mail que você usou na compra. Pode levar alguns minutos para chegar."],
  ["Não achou? Olhe nas outras abas", "Confira a caixa de spam, a aba Promoções e a aba Atualizações. Procure por \"Hotmart\"."],
  ["Entre na sua área de compras", "Faça login na Hotmart com o e-mail da compra. Se for o primeiro acesso, crie uma senha pelo link do e-mail."],
  ["Comece pelo e-book", "Ele está na área de membros da Escola para Damas, pronto para ler no celular ou baixar em PDF."],
];

const LandingEbookObrigado = () => {
  useEffect(() => {
    document.title = "Parabéns, Dama! | Escola para Damas";
    if (!document.querySelector(`link[href="${FONTS_URL}"]`)) {
      const l = document.createElement("link");
      l.rel = "stylesheet";
      l.href = FONTS_URL;
      document.head.appendChild(l);
    }
  }, []);

  return (
    <div className="lpeb">
      <section className="eb-hero ty-hero">
        <div className="eb-wrap ty-grid">
          <div>
            <div className="eb-brand">ESCOLA PARA DAMAS</div>
            <span className="eb-eye">Compra confirmada</span>
            <h1>
              Parabéns, <em>Dama!</em>
            </h1>
            <p className="eb-lead">
              Você acabou de dar um passo que muita mulher adia: aprender a se portar com segurança à mesa, numa
              conversa ou em qualquer evento. Seu acesso já está a caminho do seu e-mail.
            </p>
            <a className="eb-btn" href={AREA_URL} target="_blank" rel="noopener">
              Acessar minha área
            </a>
          </div>
          <img className="ty-capa" src={capa} alt="Capa do e-book Etiqueta Essencial para Damas" />
        </div>
      </section>

      <section className="eb-cream ty-sec">
        <div className="eb-wrap">
          <span className="eb-eye ty-eye-dark">Como acessar</span>
          <h2 className="ty-h2">Seu acesso em 4 passos</h2>
          <ol className="ty-steps">
            {PASSOS.map(([t, d], i) => (
              <li key={t}>
                <span className="ty-n">{i + 1}</span>
                <div>
                  <h3>{t}</h3>
                  <p>{d}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="ty-note">
            <b>Também entrou na Escola?</b> O acesso aos cursos chega no mesmo e-mail e fica na mesma área de membros,
            com o mesmo login.
          </p>
        </div>
      </section>

      <section className="eb-split ty-sec">
        <div className="eb-wrap ty-sup">
          <img className="ty-foto" src={leticiaSorriso} alt="Letícia Fagundes" />
          <div>
            <span className="eb-eye">Precisa de ajuda?</span>
            <h2 className="ty-h2">
              A gente está <em>aqui com você</em>
            </h2>
            <p className="ty-p">
              Se o e-mail não chegou, se você digitou o e-mail errado na compra ou se teve qualquer dificuldade para
              entrar, fale com o nosso suporte. A equipe responde pelo WhatsApp.
            </p>
            <a className="eb-btn ty-whats" href={SUPORTE_WHATS} target="_blank" rel="noopener">
              Falar com o suporte
            </a>
            <p className="ty-mail">
              Se preferir, escreva para <a href={`mailto:${SUPORTE_EMAIL}`}>{SUPORTE_EMAIL}</a>
            </p>
          </div>
        </div>
      </section>

      <footer className="ty-foot">Escola para Damas · Letícia Fagundes</footer>
    </div>
  );
};

export default LandingEbookObrigado;
