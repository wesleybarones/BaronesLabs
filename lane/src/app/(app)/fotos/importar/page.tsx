"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { GoogleButton } from "@/components/GoogleButton";
import type { PickedItem } from "@/lib/picker";

type Stage =
  | { k: "inicio" } | { k: "reauth" } | { k: "escolhendo" }
  | { k: "importando"; done: number; total: number; novas: number }
  | { k: "pronto"; novas: number; repetidas: number; falhas: number }
  | { k: "erro"; msg: string };

class Reauth extends Error {}
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const r = await fetch(url, init);
  if (r.status === 401) throw new Reauth();
  if (!r.ok) throw new Error(String(r.status));
  return r.json();
}

export default function Importar() {
  const [stage, setStage] = useState<Stage>({ k: "inicio" });
  const cancel = useRef(false);

  async function start() {
    cancel.current = false;
    // abre a janela já no clique (celulares bloqueiam janelas abertas depois de um await)
    const win = window.open("", "_blank");
    let sessionId: string | null = null;
    try {
      const s = await api<{ id: string; pickerUri: string }>("/api/picker/session", { method: "POST" });
      sessionId = s.id;
      const uri = `${s.pickerUri}/autoclose`;
      if (win) win.location.href = uri; else window.open(uri, "_blank");
      setStage({ k: "escolhendo" });

      for (;;) {
        if (cancel.current) throw new Error("cancelado");
        const st = await api<{ ready: boolean; pollMs: number }>(`/api/picker/session/${s.id}`);
        if (st.ready) break;
        await sleep(st.pollMs);
      }

      const items: PickedItem[] = [];
      let next: string | null = null;
      do {
        const page: { items: PickedItem[]; next: string | null } =
          await api(`/api/picker/session/${s.id}/items${next ? `?pageToken=${encodeURIComponent(next)}` : ""}`);
        items.push(...page.items);
        next = page.next;
      } while (next);

      const fotos = items.filter((i) => i.type === "PHOTO");
      let done = 0, novas = 0, repetidas = 0, falhas = 0;
      setStage({ k: "importando", done, total: fotos.length, novas });
      const queue = [...fotos];
      const worker = async () => {
        for (let it = queue.shift(); it; it = queue.shift()) {
          try {
            const r = await api<{ status: string }>("/api/picker/import-item", {
              method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(it),
            });
            if (r.status === "imported") novas++; else if (r.status === "duplicate") repetidas++;
          } catch (e) {
            if (e instanceof Reauth) throw e;
            falhas++;
          }
          done++;
          setStage({ k: "importando", done, total: fotos.length, novas });
        }
      };
      await Promise.all([worker(), worker(), worker()]);
      setStage({ k: "pronto", novas, repetidas, falhas });
    } catch (e) {
      win?.close();
      if (e instanceof Reauth) setStage({ k: "reauth" });
      else if ((e as Error).message === "cancelado") setStage({ k: "inicio" });
      else setStage({ k: "erro", msg: "Algo deu errado ao falar com o Google Fotos." });
    } finally {
      if (sessionId) fetch(`/api/picker/session/${sessionId}`, { method: "DELETE" }).catch(() => {});
    }
  }

  return (
    <main className="space-y-8">
      <Link href="/fotos" className="text-sm text-suave">← Fotos</Link>
      <h1 className="titulo">Trazer fotos do Google Fotos</h1>

      {stage.k === "inicio" && (
        <div className="space-y-6">
          <ol className="list-decimal space-y-2 pl-5 text-tinta/90">
            <li>Toque no botão abaixo. O Google Fotos vai abrir.</li>
            <li>Na busca, procure <b>Wesley e Lane</b> (ou o álbum de vocês).</li>
            <li>Selecione as fotos (dá para marcar várias de uma vez) e toque em <b>Concluído</b>.</li>
            <li>Volte para cá: o Lane guarda uma cópia de cada uma.</li>
          </ol>
          <button className="botao w-full" onClick={start}>Abrir o Google Fotos</button>
          <p className="text-xs text-suave">Fotos que já estão no Lane não são duplicadas. Vídeos ficam para depois.</p>
        </div>
      )}

      {stage.k === "escolhendo" && (
        <div className="space-y-4 text-center">
          <p className="coracao text-4xl text-vinho">♥</p>
          <p className="font-serif text-2xl">Escolha as fotos no Google Fotos…</p>
          <p className="text-sm text-suave">Quando tocar em “Concluído”, a importação começa sozinha aqui.</p>
          <button className="botao-leve" onClick={() => (cancel.current = true)}>Cancelar</button>
        </div>
      )}

      {stage.k === "importando" && (
        <div className="space-y-3 text-center">
          <p className="font-serif text-2xl">Guardando nossas fotos…</p>
          <div className="h-2 overflow-hidden rounded-full bg-rosa-claro">
            <div className="h-full bg-vinho transition-[width]" style={{ width: `${stage.total ? (stage.done / stage.total) * 100 : 0}%` }} />
          </div>
          <p className="text-sm tabular-nums text-suave">{stage.done} de {stage.total}</p>
          <p className="text-xs text-suave">Pode deixar a tela aberta até terminar.</p>
        </div>
      )}

      {stage.k === "pronto" && (
        <div className="space-y-4 text-center">
          <p className="font-serif text-3xl text-vinho">Prontinho ♥</p>
          <p>{stage.novas} {stage.novas === 1 ? "foto nova" : "fotos novas"}
            {stage.repetidas > 0 && ` · ${stage.repetidas} já estavam aqui`}
            {stage.falhas > 0 && ` · ${stage.falhas} não vieram (tente de novo)`}</p>
          <div className="flex justify-center gap-3">
            <Link href="/fotos" className="botao">Ver fotos</Link>
            <button className="botao-leve" onClick={() => setStage({ k: "inicio" })}>Trazer mais</button>
          </div>
        </div>
      )}

      {stage.k === "reauth" && (
        <div className="space-y-4 text-center">
          <p>Para abrir o Google Fotos, preciso que você entre com o Google de novo (é rapidinho).</p>
          <div className="flex justify-center"><GoogleButton next="/fotos/importar" label="Entrar de novo com Google" /></div>
        </div>
      )}

      {stage.k === "erro" && (
        <div className="space-y-4 text-center">
          <p>{stage.msg}</p>
          <button className="botao" onClick={() => setStage({ k: "inicio" })}>Tentar de novo</button>
        </div>
      )}
    </main>
  );
}
