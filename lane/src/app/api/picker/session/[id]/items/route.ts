import { NextResponse, type NextRequest } from "next/server";
import { googleToken, picker, reauth, type PickedItem } from "@/lib/picker";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[A-Za-z0-9_-]{1,200}$/.test(id)) return NextResponse.json({ error: "id" }, { status: 400 });
  const token = await googleToken();
  if (!token) return reauth();
  const q = new URLSearchParams({ sessionId: id, pageSize: "100" });
  const pageToken = req.nextUrl.searchParams.get("pageToken");
  if (pageToken) q.set("pageToken", pageToken);
  const r = await picker<{ mediaItems?: PickedItem[]; nextPageToken?: string }>(token, `/mediaItems?${q}`);
  if (r === "reauth") return reauth();
  if (!r) return NextResponse.json({ error: "picker" }, { status: 502 });
  return NextResponse.json({ items: r.mediaItems ?? [], next: r.nextPageToken ?? null });
}
