import { NextResponse, type NextRequest } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { GOOGLE_TOKEN_COOKIE } from "@/lib/google";

export async function POST(request: NextRequest) {
  const sb = await supabaseServer();
  await sb.auth.signOut();
  const res = NextResponse.redirect(new URL("/entrar", request.nextUrl), 303);
  res.cookies.delete(GOOGLE_TOKEN_COOKIE);
  return res;
}
