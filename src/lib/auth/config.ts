export const SESSION_TTL_SECONDS = 12 * 60 * 60; // 12 hours, fixed (cookies can't be refreshed during render)
export const INVITE_TTL_MS = 72 * 60 * 60 * 1000;
export const RESET_TTL_MS = 60 * 60 * 1000;

export const PASSWORD_MIN = 12;
export const PASSWORD_MAX = 128;

/** `__Host-` pins the cookie to this exact host over HTTPS, with Path=/ and no Domain. */
export function sessionCookieName(env: NodeJS.ProcessEnv = process.env): string {
  return env.NODE_ENV === "production" ? "__Host-mot_admin" : "mot_admin";
}

const DEV_SECRET = "development-only-secret-do-not-use-in-production!!";

/**
 * Key that signs session cookies. In production a missing/short SESSION_SECRET
 * disables the admin entirely (returns null) rather than falling back to
 * something guessable; in development a fixed key keeps local work easy.
 */
export function sessionSecret(env: NodeJS.ProcessEnv = process.env): Uint8Array | null {
  const configured = env.SESSION_SECRET;
  if (configured && configured.length >= 32) return new TextEncoder().encode(configured);
  if (env.NODE_ENV !== "production") return new TextEncoder().encode(DEV_SECRET);
  return null;
}
