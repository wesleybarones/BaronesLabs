import { NextResponse } from "next/server";
import { googleToken, picker, reauth } from "@/lib/picker";

type Session = { mediaItemsSet?: boolean; pollingConfig?: { pollInterval?: string }; expireTime?: string };
const validId = (id: string) => /^[A-Za-z0-9_-]{1,200}$/.test(id);

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!validId(id)) return NextResponse.json({ error: "id" }, { status: 400 });
  const token = await googleToken();
  if (!token) return reauth();
  const s = await picker<Session>(token, `/sessions/${id}`);
  if (s === "reauth") return reauth();
  if (!s) return NextResponse.json({ error: "picker" }, { status: 502 });
  const interval = parseFloat(s.pollingConfig?.pollInterval ?? "3") || 3;
  return NextResponse.json({ ready: !!s.mediaItemsSet, pollMs: Math.max(1000, interval * 1000), expireTime: s.expireTime });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const token = await googleToken();
  if (token && validId(id)) await picker(token, `/sessions/${id}`, { method: "DELETE" });
  return NextResponse.json({ ok: true });
}
