import "server-only";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { GOOGLE_TOKEN_COOKIE, PICKER_API } from "./google";

export type PickedItem = {
  id: string; createTime: string; type: "PHOTO" | "VIDEO" | string;
  mediaFile: { baseUrl: string; mimeType: string; mediaFileMetadata?: { width?: number; height?: number } };
};

export const reauth = () => NextResponse.json({ reauth: true }, { status: 401 });

export async function googleToken(): Promise<string | null> {
  return (await cookies()).get(GOOGLE_TOKEN_COOKIE)?.value ?? null;
}

/** Chama a Photos Picker API. Devolve null quando o Google recusa o token. */
export async function picker<T>(token: string, path: string, init: RequestInit = {}): Promise<T | null | "reauth"> {
  const r = await fetch(`${PICKER_API}${path}`, {
    ...init,
    headers: { ...init.headers, Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    cache: "no-store",
  });
  if (r.status === 401 || r.status === 403) return "reauth";
  if (!r.ok) return null;
  const text = await r.text();
  return (text ? JSON.parse(text) : {}) as T;
}
