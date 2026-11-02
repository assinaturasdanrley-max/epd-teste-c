#!/usr/bin/env python3
"""Acesso do agente à plataforma Funis (API do agente no Lovable Cloud).

Configuração (uma vez): arquivo ~/.config/funis-agent/config.json com permissão 600:
  {"url": "https://criador-funis.lovable.app/api/public/agent-api",
   "url_preview": "(opcional) endereco de pre-visualizacao, usado com --preview",
   "anon_key": "(opcional, so se a API exigir)",
   "agent_key": "<mesmo valor do segredo AGENT_API_KEY no Lovable Cloud>"}
Nunca copie essas chaves para o Obsidian, para a conversa ou para arquivos do projeto.

Uso:
  python3 funis_api.py listar
  python3 funis_api.py exportar-funil SLUG saida.json
  python3 funis_api.py exportar-respostas SLUG saida.json [--dias 30]
  python3 funis_api.py criar-rascunho funil.json      (arquivo gerado pelo build_funnel.py)
  python3 funis_api.py exportar-vendas saida.json [--dias 30] [--src quiz-SLUG]   (vendas da Hotmart via webhook)

A API só lê e cria rascunhos. Publicar, editar o que está no ar e apagar são feitos pela equipe no painel.
"""
import json
import os
import sys
import time
import urllib.error
import urllib.request

CFG = os.path.expanduser("~/.config/funis-agent/config.json")


def cfg():
    if not os.path.exists(CFG):
        sys.exit(f"Configuração não encontrada em {CFG}. Veja as instruções no topo deste arquivo.")
    with open(CFG, encoding="utf-8") as f:
        c = json.load(f)
    missing = [k for k in ("url", "agent_key") if not c.get(k) or "<" in c.get(k, "")]
    if "--preview" in sys.argv and c.get("url_preview"):
        c["url"] = c["url_preview"]
    if missing:
        sys.exit(f"Preencha em {CFG}: {', '.join(missing)}")
    return c


def call(action, **payload):
    c = cfg()
    req = urllib.request.Request(
        c["url"],
        data=json.dumps({"action": action, **payload}).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Accept": "application/json",
            # O Cloudflare na frente do Lovable bloqueia o User-Agent padrão do Python (erro 1010).
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36 FunisAgent/1.0",
            "x-agent-key": c["agent_key"],
            **({"Authorization": f"Bearer {c['anon_key']}", "apikey": c["anon_key"]} if c.get("anon_key") else {}),
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return json.loads(r.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", "ignore")
        sys.exit(f"Erro {e.code}: {body[:500]}")


def main():
    a = [x for x in sys.argv[1:] if x != "--preview"]
    if not a:
        print(__doc__)
        return
    cmd = a[0]
    if cmd == "listar":
        res = call("list_funnels")
        for f in res.get("funnels", []):
            status = "publicado" if f.get("published_at") else "rascunho"
            print(f"{f['slug']:40} {status:10} visitas={f.get('visitas', 0):5} leads={f.get('leads', 0):5}  {f['name']}")
    elif cmd == "exportar-funil" and len(a) == 3:
        res = call("get_funnel", slug=a[1])
        json.dump(res["funnel"], open(a[2], "w", encoding="utf-8"), ensure_ascii=False)
        print(f"OK: {a[2]}")
    elif cmd == "exportar-respostas" and len(a) >= 3:
        since = None
        if "--dias" in a:
            since = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime(time.time() - int(a[a.index("--dias") + 1]) * 86400))
        res = call("get_sessions", slug=a[1], **({"since": since} if since else {}))
        json.dump(res["sessions"], open(a[2], "w", encoding="utf-8"), ensure_ascii=False)
        print(f"OK: {a[2]} ({len(res['sessions'])} respostas)")
    elif cmd == "exportar-vendas" and len(a) >= 2:
        payload = {}
        if "--dias" in a:
            payload["since"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime(time.time() - int(a[a.index("--dias") + 1]) * 86400))
        if "--src" in a:
            payload["src"] = a[a.index("--src") + 1]
        res = call("get_sales", **payload)
        json.dump(res["sales"], open(a[1], "w", encoding="utf-8"), ensure_ascii=False)
        print(f"OK: {a[1]} ({len(res['sales'])} eventos de venda)")
    elif cmd == "criar-rascunho" and len(a) == 2:
        funnel = json.load(open(a[1], encoding="utf-8"))
        res = call("create_draft", funnel=funnel)
        print(json.dumps(res, ensure_ascii=False, indent=1))
    else:
        print(__doc__)
        sys.exit(1)


if __name__ == "__main__":
    main()
