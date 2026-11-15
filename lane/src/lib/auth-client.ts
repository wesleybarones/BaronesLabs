"use client";
import { supabaseBrowser } from "./supabase/client";
import { PHOTOS_SCOPE } from "./google";

/** Login com Google pedindo também acesso ao seletor do Google Fotos. */
export async function signInWithGoogle(next = "/") {
  const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
  await supabaseBrowser().auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo, scopes: PHOTOS_SCOPE },
  });
}
