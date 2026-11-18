"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";

const text = (f: FormData, k: string, max = 20000) => String(f.get(k) ?? "").trim().slice(0, max);

export async function deletePhoto(id: string) {
  const sb = await supabaseServer();
  const { data } = await sb.from("photos").delete().eq("id", id).select("full_path,thumb_path").maybeSingle();
  if (data) await sb.storage.from("lane").remove([data.full_path, data.thumb_path]);
  revalidatePath("/fotos");
}

export async function saveMemory(id: string | null, f: FormData) {
  const sb = await supabaseServer();
  const row = { date: text(f, "date", 10), title: text(f, "title", 200), body: text(f, "body") };
  if (!row.date || !row.title) throw new Error("Data e título são obrigatórios");
  const photoIds = f.getAll("photos").map(String).slice(0, 30);
  let memoryId = id;
  if (id) {
    const { error } = await sb.from("memories").update(row).eq("id", id);
    if (error) throw error;
    await sb.from("memory_photos").delete().eq("memory_id", id);
  } else {
    const { data, error } = await sb.from("memories").insert(row).select("id").single();
    if (error) throw error;
    memoryId = data.id;
  }
  if (photoIds.length) {
    await sb.from("memory_photos").insert(photoIds.map((photo_id) => ({ memory_id: memoryId, photo_id })));
  }
  revalidatePath("/lembrancas");
  redirect(`/lembrancas#m-${memoryId}`);
}

export async function deleteMemory(id: string) {
  const sb = await supabaseServer();
  await sb.from("memories").delete().eq("id", id);
  revalidatePath("/lembrancas");
  redirect("/lembrancas");
}

export async function savePoem(id: string | null, f: FormData) {
  const sb = await supabaseServer();
  const row = { title: text(f, "title", 200), body: text(f, "body"), author: text(f, "author", 60) || "Wesley" };
  if (!row.title || !row.body) throw new Error("Título e poema são obrigatórios");
  let poemId = id;
  if (id) {
    const { error } = await sb.from("poems").update({ ...row, updated_at: new Date().toISOString() }).eq("id", id);
    if (error) throw error;
  } else {
    const { data, error } = await sb.from("poems").insert(row).select("id").single();
    if (error) throw error;
    poemId = data.id;
  }
  revalidatePath("/poemas");
  redirect(`/poemas/${poemId}`);
}

export async function deletePoem(id: string) {
  const sb = await supabaseServer();
  await sb.from("poems").delete().eq("id", id);
  revalidatePath("/poemas");
  redirect("/poemas");
}

const AUDIO_EXT = ["mp3", "m4a", "aac", "wav", "ogg", "opus", "flac"];

/** Gera um endereço de envio assinado para o arquivo da música (só membros). */
export async function songUploadUrl(ext: string): Promise<{ path: string; token: string }> {
  const clean = ext.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (!AUDIO_EXT.includes(clean)) throw new Error("formato de áudio não suportado");
  const sb = await supabaseServer();
  const { data: ok } = await sb.rpc("is_member");
  if (!ok) throw new Error("sem permissão");
  const path = `music/${Date.now()}.${clean}`;
  const { data, error } = await sb.storage.from("lane").createSignedUploadUrl(path);
  if (error || !data) throw new Error(error?.message ?? "não consegui preparar o envio");
  return { path, token: data.token };
}

/** Chamado depois que o navegador já enviou o arquivo de áudio: entra no fim da playlist. */
export async function addSong(path: string, title: string, lyrics: string | null = null) {
  if (!/^music\/[A-Za-z0-9._-]+$/.test(path)) throw new Error("caminho inválido");
  const sb = await supabaseServer();
  const { data: ultima } = await sb.from("songs").select("position").order("position", { ascending: false }).limit(1).maybeSingle();
  const { error } = await sb.from("songs").insert({
    path, title: title.trim().slice(0, 120) || "Nossa música",
    lyrics: lyrics?.trim().slice(0, 20000) || null, position: (ultima?.position ?? -1) + 1,
  });
  if (error) throw error;
  revalidatePath("/", "layout");
}
