# -*- coding: utf-8 -*-
"""Gera os roteiros dos funis Quiz + VSL A (repertório) e B (comunicação) da Escola para Damas."""
import json

A = "https://exclusivo.escolaparadamas.com.br/assets/"
M = "https://heaqjhyxeskscfqvqaev.supabase.co/storage/v1/object/public/midia-funis/quiz-vsl/"
ANUAL10 = "https://pay.hotmart.com/X100700705N?off=9fkas19r&checkoutMode=10"
PREFILL = "&name={{nome}}&email={{email}}&phoneac={{telefone_ddd}}&phonenumber={{telefone_numero}}"
SEND = {"a": "RxuX5n5", "b": "Eyu6nOz"}


def t(text, variant="p", **kw):
    return {"type": "text", "text": text, "variant": variant, **kw}


def q(name, intro, options, **kw):
    return {"type": "options", "name": name, "intro": intro, "options": options, **kw}


def video(corte, ratio="1080/1680", gate=False):
    code = (
        f'<video src="{M}{corte}.mp4" poster="{M}{corte}_poster.jpg" controls playsinline preload="metadata" '
        f'style="width:100%;aspect-ratio:{ratio};border-radius:14px;background:#000;display:block"></video>'
    )
    if gate:
        # Esconde o botão CONTINUAR da etapa até o vídeo terminar (ou dar erro).
        code += (
            "<script>(function(){var s=document.currentScript;var box=s&&s.parentElement;if(!box)return;"
            "var v=box.querySelector('video');var root=box;"
            "while(root&&root.parentElement&&!Array.prototype.some.call(root.querySelectorAll('button'),function(b){return /CONTINUAR/i.test(b.textContent)}))root=root.parentElement;"
            "var btn=Array.prototype.filter.call(root.querySelectorAll('button'),function(b){return /CONTINUAR/i.test(b.textContent)})[0];"
            "if(!v||!btn)return;btn.style.display='none';"
            "function show(){btn.style.display='';btn.scrollIntoView({behavior:'smooth',block:'center'});}"
            "v.addEventListener('ended',show);v.addEventListener('error',show);})();</script>"
        )
    return {"type": "html", "code": code}


def send_script(form):
    # Manda o lead para o formulário próprio do Hotmart Send (uma vez por visita).
    return {"type": "html", "code": (
        "<script>(function(){try{var k='send_" + form + "';if(sessionStorage.getItem(k))return;"
        "var tel=`{{telefone}}`.replace(/\\D/g,'');if(tel&&tel.indexOf('55')!==0)tel='55'+tel;"
        "var d=new FormData();d.append('first_name',`{{nome}}`);d.append('email',`{{email}}`);"
        "if(tel)d.append('phone','+'+tel);d.append('b_" + form + "','');"
        "var qs=location.search?'&'+location.search.slice(1):'';"
        "fetch('https://handler.send.hotmart.com/subscription/" + form + "?hotfeature=53'+qs,{method:'POST',mode:'no-cors',body:d});"
        "sessionStorage.setItem(k,'1');}catch(e){}})();</script>"
    )}


def corte_step(key, title, eyebrow, titulo, apoio, corte, nxt, delay=20):
    return {"key": key, "title": title, "blocks": [
        t(eyebrow, "small"),
        t(titulo, "h2"),
        t(apoio),
        video(corte, gate=True),
        {"type": "button", "text": "CONTINUAR", "goto": nxt, "size": "lg"},
        t("Assista até o fim. O botão para continuar aparece quando o vídeo terminar.", "small"),
    ]}


BLOCO3 = lambda: [
    {"key": "sente", "title": "08 O que sente depois do corte 2", "blocks": [
        q("sente", "Depois desse trecho, o que você sente?", [
            {"label": "Quero aprender mais assim", "value": "quero", "emoji": "✨"},
            {"label": "Gostei, mas tenho pouco tempo", "value": "tempo", "emoji": "⏳"},
            {"label": "Ainda estou só curiosa", "value": "curiosa", "emoji": "👀"},
        ]),
    ]},
    {"key": "tempo", "title": "09 Tempo disponivel", "blocks": [
        q("tempo", "Quanto tempo por dia você conseguiria reservar para você?", [
            {"label": "Menos de 10 minutos", "value": "pouco", "emoji": "⏳"},
            {"label": "15 minutos", "value": "15", "emoji": "☕"},
            {"label": "30 minutos", "value": "30", "emoji": "📚"},
            {"label": "1 hora ou mais", "value": "60", "emoji": "🕰️"},
        ], layout="grid2", textAlign="center"),
    ]},
    {"key": "captura", "title": "10 Captura", "header": {"back": False}, "blocks": [
        t("Sua trilha recomendada está pronta ✨", "h1"),
        t("Preencha para liberar a trilha que a Letícia indica para o seu momento."),
        {"type": "field", "name": "nome", "label": "Seu primeiro nome", "placeholder": "Como você gosta de ser chamada?", "required": True},
        {"type": "email", "name": "email", "label": "Seu melhor e-mail", "placeholder": "seu@email.com", "required": True},
        {"type": "phone", "name": "telefone", "label": "Seu WhatsApp", "placeholder": "(00) 00000-0000", "mask": True, "required": True},
        {"type": "button", "text": "VER MINHA TRILHA", "goto": "analisando", "size": "lg"},
        t("🔒 Seus dados estão seguros e não serão compartilhados.", "small"),
    ]},
]

FAQ = {"type": "faq", "items": [
    {"q": "Não tenho muito tempo. Vou conseguir acompanhar?", "a": "Sim. Com cerca de 15 minutos por dia você assiste a uma aula, e muitas podem ser ouvidas como podcast, no trânsito ou organizando a casa."},
    {"q": "Preciso saber de literatura, arte ou história?", "a": "Não. Os conteúdos foram feitos também para quem está começando do zero."},
    {"q": "Será que já passei da idade?", "a": "A Escola tem alunas do início da vida adulta até perto da aposentadoria. Não existe idade para continuar aprendendo."},
    {"q": "E se não for para mim?", "a": "Você tem 7 dias de garantia. Entre, conheça as aulas e, se não fizer sentido, peça o reembolso dentro do prazo."},
]}


def resultado(v, pilar, dor, trilha, promessa):
    src = f"&src=quiz-vsl-{v}&sck=quiz-vsl-{v}"
    url = ANUAL10 + src + PREFILL
    return {"key": "resultado", "title": "12 Resultado e oferta", "header": {"back": False}, "blocks": [
        send_script(SEND[v]),
        t("{{nome}}, o seu caminho começa pela", "small"),
        t(pilar, "h1"),
        t(dor),
        t("**Sua trilha recomendada:**", "p", textAlign="left"),
        {"type": "checklist", "icon": "", "items": trilha},
        t(promessa),
        t("E isso é só o começo. Na **Escola para Damas** você tem mais de 10 cursos e mais de 200 aulas sobre cultura, comunicação, feminilidade, inteligência emocional e elegância."),
        t("Antes de ver o valor, assista a este recado da Letícia:", "p"),
        video("OFERTA"),
        {"type": "alert", "variant": "info", "icon": "⏱️", "show_if": [["@tempo", "eq", "pouco"]],
         "text": "Você disse que tem pouco tempo: as aulas foram pensadas para **cerca de 15 minutos** e muitas podem ser **ouvidas como podcast**."},
        {"type": "price", "badge": "10% DE DESCONTO NESTA PÁGINA", "title": "Plano Anual · acesso a todos os cursos",
         "oldPrice": "12x R$ 39,90", "price": "12x R$ 35,91", "installments": "ou R$ 430,92 à vista",
         "features": "Todos os cursos, incluindo a sua trilha\nNovos cursos lançados durante o ano\nBônus: curso Instagram da Dama\nBônus: Clube das Damas (grupo VIP e encontros mensais)\nGarantia de 7 dias",
         "cta": "QUERO COMEÇAR MINHA TRILHA", "url": url},
        {"type": "alert", "variant": "success", "icon": "🛡️",
         "text": "**Garantia de 7 dias:** entre, conheça as aulas e, se não for para você, peça o reembolso dentro do prazo."},
        FAQ,
        {"type": "button", "text": "GARANTIR MEUS 10% DE DESCONTO", "url": url, "size": "lg", "pulse": True},
    ]}


ANALISANDO = {"key": "analisando", "title": "11 Analisando", "header": {"back": False}, "blocks": [
    {"type": "loading", "title": "Montando a sua trilha...", "duration": 4, "goto": "resultado", "showTitle": True},
    {"type": "checklist", "icon": "✔️", "items": "Lendo suas respostas\nCruzando com o que a Letícia mostrou nos vídeos\nSeparando os cursos para o seu momento"},
]}

IDADE = {"key": "idade", "title": "02 Idade", "blocks": [
    q("idade", "Para começar, qual é a sua idade?", [
        {"label": "18 a 24", "value": "18-24", "emoji": "🌱"},
        {"label": "25 a 34", "value": "25-34", "emoji": "🌸"},
        {"label": "35 a 44", "value": "35-44", "emoji": "🌹"},
        {"label": "45 ou mais", "value": "45+", "emoji": "💐"},
    ], layout="grid2", textAlign="center"),
]}

THEME = {
    "primary": "#6b1e2e", "primaryText": "#ffffff", "background": "#fbf6f2", "bgType": "none",
    "titleFont": "Playfair Display", "titleColor": "#2a0f12", "titleSize": 27, "titleWeight": 700,
    "textFont": "Inter", "textColor": "#4a3a36", "textSize": 16, "radius": 14, "width": 460, "spacing": 16,
    "cardBg": "#ffffff", "cardBorder": "#ecdcd2", "progressStyle": "thin", "verticalAlign": "top",
    "logoUrl": A + "logo-escola-n7zCSKHS.webp", "logoSize": "normal", "logoPos": "center",
}


def funil_a():
    steps = [
        {"key": "abertura", "title": "01 Abertura", "header": {"progress": False, "back": False}, "blocks": [
            t("O que falta para você ter assunto em **qualquer roda de conversa**?", "h1"),
            t("Responda algumas perguntas rápidas e assista a dois trechos da aula da **Letícia Fagundes**. No fim, você recebe a trilha recomendada para o seu momento."),
            {"type": "button", "text": "COMEÇAR", "goto": "idade", "size": "lg", "pulse": True},
            t("⏱️ 8 perguntas · 2 vídeos curtos", "small"),
        ]},
        IDADE,
        {"key": "roda", "title": "03 Roda de conversa", "blocks": [
            q("roda", "Numa roda de conversa sobre livros, arte ou história, o que você costuma fazer?", [
                {"label": "Participo da conversa", "value": "participo"},
                {"label": "Escuto e só sorrio", "value": "sorrio"},
                {"label": "Mudo de assunto", "value": "mudo"},
                {"label": "Fico quieta e me sinto de fora", "value": "fora"},
            ], variant="indicator"),
        ]},
        {"key": "frases", "title": "04 Frases que ja pensou", "blocks": [
            q("frases", "Qual destas frases você já pensou sobre si mesma? **Marque todas.**", [
                {"label": "Fico de fora das rodas de conversa", "value": "fora"},
                {"label": "Às vezes me sinto rasa", "value": "rasa"},
                {"label": "Tenho potencial, mas não sei por onde começar", "value": "potencial"},
                {"label": "Sou um diamante bruto que precisa ser lapidado", "value": "diamante"},
            ], multiple=True, noAuto=True, variant="check"),
            {"type": "button", "text": "CONTINUAR", "goto": "corte_a1"},
        ]},
        corte_step("corte_a1", "05 Corte A1 Voce se reconhece", "VÍDEO 1 DE 2 · 2 MIN",
                   "Você se reconhece?", "A Letícia conta quem são as mulheres que chegam até ela. Veja se alguma delas é você.",
                   "A1", "reconheceu"),
        {"key": "reconheceu", "title": "06 Se reconheceu", "blocks": [
            q("reconheceu", "Você se reconheceu em alguma dessas mulheres?", [
                {"label": "A que se dedicou só à carreira", "value": "carreira"},
                {"label": "A engraçada do grupo", "value": "engracada"},
                {"label": "Feminina por fora, rígida por dentro", "value": "rigida"},
                {"label": "A que se sente incompleta", "value": "incompleta"},
                {"label": "Em várias delas", "value": "varias"},
            ], variant="indicator"),
        ]},
        {"key": "monalisa", "title": "07 Mona Lisa no jantar", "blocks": [
            {"type": "image", "src": A + "capa-museu--7CnJr0Q.webp", "alt": "Museu da Dama", "radius": 16, "width": 70},
            q("monalisa", "Se alguém comentasse sobre a Mona Lisa num jantar, você saberia continuar a conversa?", [
                {"label": "Sim", "value": "sim", "emoji": "😊"},
                {"label": "Mais ou menos", "value": "mais_ou_menos", "emoji": "🤔"},
                {"label": "Não saberia", "value": "nao", "emoji": "😶"},
            ]),
        ]},
        corte_step("corte_a2", "07b Corte A2 Mona Lisa", "VÍDEO 2 DE 2 · 2 MIN",
                   "A Mona Lisa no jantar", "Uma mini aula da Letícia para você nunca mais ficar sem assunto quando esse quadro aparecer na conversa.",
                   "A2", "sente"),
    ] + BLOCO3() + [ANALISANDO, resultado(
        "a", "CULTURA E REPERTÓRIO",
        "Você tem muito a dizer, mas quando a conversa vai para livros, arte ou história, prefere ficar quieta. Não é falta de inteligência. É falta de repertório, e repertório se constrói.",
        "📖 Desvendando a Literatura: de Homero a Clarice, 21 aulas\n🖼️ Museu da Dama: entender obras e artistas\n🏛️ Descobrindo a História: os contextos que explicam o mundo",
        "Em poucas semanas, você entra numa conversa sobre um clássico, uma exposição ou um fato histórico sabendo o que acrescentar.",
    )]
    return {
        "name": "Quiz + VSL A - Repertório (Escola para Damas)",
        "slug": "quiz-vsl-a",
        "theme": THEME,
        "settings": {"seoTitle": "O que falta para você ter assunto em qualquer conversa? | Escola para Damas",
                     "seoDescription": "Responda algumas perguntas, assista a dois trechos da aula da Letícia Fagundes e receba a sua trilha.",
                     "ogImage": A + "capa-literatura-3lVmkDwE.webp", "webhookOn": "lead"},
        "steps": steps,
    }


def funil_b():
    steps = [
        {"key": "abertura", "title": "01 Abertura", "header": {"progress": False, "back": False}, "blocks": [
            t("Você saberia **como agir e o que falar** num jantar, numa reunião ou com a família dele?", "h1"),
            t("Responda algumas perguntas rápidas e assista a dois trechos da aula da **Letícia Fagundes**. No fim, você recebe a trilha recomendada para o seu momento."),
            {"type": "button", "text": "COMEÇAR", "goto": "idade", "size": "lg", "pulse": True},
            t("⏱️ 8 perguntas · 2 vídeos curtos", "small"),
        ]},
        IDADE,
        {"key": "situacao", "title": "03 Situacao menos segura", "blocks": [
            q("situacao", "Em qual destas situações você se sentiria menos segura hoje?", [
                {"label": "Jantar num restaurante refinado", "value": "jantar", "emoji": "🍽️"},
                {"label": "Reunião de trabalho ou entrevista", "value": "trabalho", "emoji": "💼"},
                {"label": "Primeiro encontro", "value": "encontro", "emoji": "🌹"},
                {"label": "Conhecer a família dele", "value": "familia", "emoji": "🏡"},
            ]),
        ]},
        {"key": "posicionar", "title": "04 Quando precisa se posicionar", "blocks": [
            q("posicionar", "Quando você precisa se posicionar, o que costuma acontecer?", [
                {"label": "Falo e soo dura", "value": "dura"},
                {"label": "Me calo para evitar conflito", "value": "calo"},
                {"label": "Falo, mas não sou levada a sério", "value": "nao_seria"},
                {"label": "Me sinto segura", "value": "segura"},
            ], variant="indicator"),
        ]},
        corte_step("corte_b1", "05 Corte B1 Voce sabe como agir", "VÍDEO 1 DE 2 · 2 MIN",
                   "Você sabe como agir?", "A Letícia fala da mulher que, quando abre a boca, todos param para ouvir, e de onde ela veio.",
                   "B1", "percebam"),
        {"key": "percebam", "title": "06 O que quer que percebam", "blocks": [
            q("percebam", "O que você mais quer que as pessoas percebam em você?", [
                {"label": "Que sou ouvida e respeitada", "value": "respeitada"},
                {"label": "Minha elegância", "value": "elegancia"},
                {"label": "Minha calma", "value": "calma"},
                {"label": "Que tenho assunto", "value": "assunto"},
            ], variant="indicator"),
        ]},
        {"key": "sempre_nunca", "title": "07 Voce sempre voce nunca", "blocks": [
            q("sempre_nunca", "Numa discussão com alguém que você ama, você já disse \"você sempre\" ou \"você nunca\"?", [
                {"label": "Sim, muitas vezes", "value": "muitas", "emoji": "😬"},
                {"label": "Às vezes", "value": "as_vezes", "emoji": "🤏"},
                {"label": "Nunca", "value": "nunca", "emoji": "🙂"},
            ]),
        ]},
        corte_step("corte_b2", "07b Corte B2 Como falar para ser ouvida", "VÍDEO 2 DE 2 · 3 MIN",
                   "Como falar para ser ouvida", "O erro que fecha qualquer conversa e o que dizer no lugar, com firmeza e sem perder a delicadeza.",
                   "B2", "sente"),
    ] + BLOCO3() + [ANALISANDO, resultado(
        "b", "COMUNICAÇÃO",
        "Você sabe o que pensa, mas na hora de falar as palavras não saem como gostaria. Às vezes se cala para evitar conflito, às vezes fala e sente que não foi levada a sério.",
        "🎙️ Comunicação FMA: Feminina, Magnética e Assertiva\n🍽️ Guia da Anfitriã Perfeita: como receber e se portar com elegância\n🧠 Os 4 Temperamentos: entender como cada pessoa reage",
        "Você passa a dizer o que pensa com clareza e firmeza, sem perder a doçura, e a se sentir segura em qualquer ambiente.",
    )]
    return {
        "name": "Quiz + VSL B - Comunicação (Escola para Damas)",
        "slug": "quiz-vsl-b",
        "theme": THEME,
        "settings": {"seoTitle": "Você saberia como agir e o que falar? | Escola para Damas",
                     "seoDescription": "Responda algumas perguntas, assista a dois trechos da aula da Letícia Fagundes e receba a sua trilha.",
                     "ogImage": A + "capa-comunicacao-C-3aHev4.webp", "webhookOn": "lead"},
        "steps": steps,
    }


for nome, f in [("a", funil_a), ("b", funil_b)]:
    json.dump(f(), open(f"/home/claude/quizvsl/roteiro_{nome}.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("ok")
