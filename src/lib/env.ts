/**
 * Which backing store the site uses, decided from the environment.
 *
 * - `postgres`: DATABASE_URL is set (Neon on Vercel).
 * - `pglite`:   opt-in local database (`LOCAL_DB=pglite`), for development and
 *               testing the admin without any cloud account. Never used during
 *               `next build`: build workers are separate processes, and an
 *               embedded database must be opened by exactly one.
 * - `static`:   no database; the public site reads `src/content/*` and /admin
 *               reports "not configured". This is the safe default, so a
 *               deployment with no database variables behaves exactly as the
 *               site did before the admin existed.
 *
 * Nothing here reads a secret at import time — everything is evaluated lazily.
 */
export type ContentSourceKind = "postgres" | "pglite" | "static";

export function contentSource(env: NodeJS.ProcessEnv = process.env): ContentSourceKind {
  const forced = env.CONTENT_SOURCE;
  if (forced === "static" || forced === "pglite" || forced === "postgres") return forced;
  if (env.DATABASE_URL) return "postgres";
  const building = env.NEXT_PHASE === "phase-production-build";
  if (env.LOCAL_DB === "pglite" && !building) return "pglite";
  return "static";
}

export function isBuildPhase(env: NodeJS.ProcessEnv = process.env): boolean {
  return env.NEXT_PHASE === "phase-production-build";
}

/** Canonical site origin, used for links in emails. Never derived from a request Host header. */
export function siteUrl(env: NodeJS.ProcessEnv = process.env): string {
  const explicit = env.SITE_URL?.replace(/\/+$/, "");
  if (explicit) return explicit;
  if (env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "http://localhost:3000";
}
