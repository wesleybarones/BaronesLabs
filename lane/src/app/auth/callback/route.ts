import { NextResponse, type NextRequest } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { GOOGLE_TOKEN_COOKIE } from "@/lib/google";
import { safeNext } from "@/lib/safe-next";

export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const next = safeNext(url.searchParams.get("next"));
  const code = url.searchParams.get("code");
  if (!code) return NextResponse.redirect(new URL("/entrar?erro=1", url));

  const sb = await supabaseServer();
  const { data, error } = await sb.auth.exchangeCodeForSession(code);
  if (error) return NextResponse.redirect(new URL("/entrar?erro=1", url));

  const res = NextResponse.redirect(new URL(next, url));
  const token = data.session?.provider_token;
  if (token) {
    // token do Google vale ~1h; guardamos por 50 min só para o seletor de fotos
    res.cookies.set(GOOGLE_TOKEN_COOKIE, token, {
      httpOnly: true, secure: url.protocol === "https:", sameSite: "lax", path: "/", maxAge: 50 * 60,
    });
  }
  return res;
}
