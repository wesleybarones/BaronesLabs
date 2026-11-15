export const PHOTOS_SCOPE = "https://www.googleapis.com/auth/photospicker.mediaitems.readonly";
export const PICKER_API = "https://photospicker.googleapis.com/v1";
export const GOOGLE_TOKEN_COOKIE = "g_token";

/** Só baixamos imagens servidas pelo Google (evita SSRF). */
export function isAllowedGoogleUrl(u: string): boolean {
  try {
    const url = new URL(u);
    return url.protocol === "https:" &&
      (url.hostname === "googleusercontent.com" || url.hostname.endsWith(".googleusercontent.com"));
  } catch {
    return false;
  }
}

export function photoPaths(googleId: string) {
  const safe = googleId.replace(/[^A-Za-z0-9_-]/g, "_");
  return { full: `photos/${safe}.jpg`, thumb: `photos/thumbs/${safe}.jpg` };
}
