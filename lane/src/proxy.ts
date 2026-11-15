import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/supabase/env";

const PUBLIC = ["/entrar", "/so-nosso", "/auth/"];

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  const sb = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list) => {
        list.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const path = request.nextUrl.pathname;
  if (PUBLIC.some((p) => path.startsWith(p))) return response;

  const isApi = path.startsWith("/api/");
  const deny = (to: string, status: number) => {
    if (isApi) return NextResponse.json({ error: to }, { status });
    const url = request.nextUrl.clone();
    url.pathname = to;
    url.search = to === "/entrar" && path !== "/" ? `?next=${encodeURIComponent(path)}` : "";
    const r = NextResponse.redirect(url);
    response.cookies.getAll().forEach((c) => r.cookies.set(c));
    return r;
  };

  const { data: { user } } = await sb.auth.getUser();
  if (!user) return deny("/entrar", 401);

  const { data: member } = await sb.rpc("is_member");
  if (!member) return deny("/so-nosso", 403);

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icons/|manifest.webmanifest|sw.js).*)"],
};
