import { NextResponse } from "next/server";
import { googleToken, picker, reauth } from "@/lib/picker";

export async function POST() {
  const token = await googleToken();
  if (!token) return reauth();
  const s = await picker<{ id: string; pickerUri: string }>(token, "/sessions", { method: "POST", body: "{}" });
  if (s === "reauth") return reauth();
  if (!s) return NextResponse.json({ error: "picker" }, { status: 502 });
  return NextResponse.json({ id: s.id, pickerUri: s.pickerUri });
}
