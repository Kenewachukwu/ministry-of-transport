/** Warn this long before the session ends. */
export const SESSION_WARNING_MS = 15 * 60 * 1000;

export type SessionNotice = { level: "ok" } | { level: "soon"; minutes: number } | { level: "ended" };

/**
 * Sessions last a fixed 12 hours and cannot be extended from a page, so the
 * admin tells the person shortly before it ends, while there is still time to
 * save, rather than letting a save fail after a long editing session.
 */
export function sessionNotice(nowMs: number, expiresAtMs: number): SessionNotice {
  if (Number.isNaN(expiresAtMs)) return { level: "ok" };
  const left = expiresAtMs - nowMs;
  if (left <= 0) return { level: "ended" };
  if (left <= SESSION_WARNING_MS) return { level: "soon", minutes: Math.max(1, Math.ceil(left / 60_000)) };
  return { level: "ok" };
}
