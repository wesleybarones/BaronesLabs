import { NextResponse } from "next/server";
import { googleToken, reauth, type PickedItem } from "@/lib/picker";
import { isAllowedGoogleUrl, photoPaths } from "@/lib/google";
import { supabaseServer } from "@/lib/supabase/server";

export const maxDuration = 60;

async function download(url: string, token: string) {
  const r = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
  if (r.status === 401 || r.status === 403) throw new Error("reauth");
  if (!r.ok) throw new Error(`download ${r.status}`);
  return new Uint8Array(await r.arrayBuffer());
}

export async function POST(req: Request) {
  const token = await googleToken();
  if (!token) return reauth();
  const item = (await req.json().catch(() => null)) as PickedItem | null;
  const base = item?.mediaFile?.baseUrl;
  if (!item?.id || !base || !isAllowedGoogleUrl(base)) return NextResponse.json({ error: "item" }, { status: 400 });
  if (item.type !== "PHOTO") return NextResponse.json({ status: "skipped" });

  const sb = await supabaseServer();
  const { data: exists } = await sb.from("photos").select("id").eq("google_id", item.id).maybeSingle();
  if (exists) return NextResponse.json({ status: "duplicate" });

  const paths = photoPaths(item.id);
  try {
    const [full, thumb] = await Promise.all([
      download(`${base}=w2400-h2400`, token),
      download(`${base}=w600-h600-c`, token),
    ]);
    const up = await Promise.all([
      sb.storage.from("lane").upload(paths.full, full, { contentType: "image/jpeg", upsert: true }),
      sb.storage.from("lane").upload(paths.thumb, thumb, { contentType: "image/jpeg", upsert: true }),
    ]);
    if (up.some((u) => u.error)) return NextResponse.json({ error: "storage" }, { status: 500 });
  } catch (e) {
    if ((e as Error).message === "reauth") return reauth();
    return NextResponse.json({ error: "download" }, { status: 502 });
  }

  const meta = item.mediaFile.mediaFileMetadata;
  const { error } = await sb.from("photos").upsert(
    {
      google_id: item.id, full_path: paths.full, thumb_path: paths.thumb,
      taken_at: item.createTime ?? new Date().toISOString(),
      width: meta?.width ?? null, height: meta?.height ?? null,
    },
    { onConflict: "google_id", ignoreDuplicates: true },
  );
  if (error) return NextResponse.json({ error: "db" }, { status: 500 });
  return NextResponse.json({ status: "imported" });
}
