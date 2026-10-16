import "server-only";
import { eq, sql } from "drizzle-orm";
import { getDb } from "@/db/client";
import { rateLimits } from "@/db/schema";

/**
 * Fixed-window counter in the database (so it holds across serverless
 * instances). One atomic upsert: opens a new window when the old one expired,
 * otherwise increments. Returns true once `limit` is exceeded.
 */
export async function hitRateLimit(key: string, limit: number, windowSeconds: number): Promise<boolean> {
  const db = await getDb();
  const expired = sql`${rateLimits.windowStart} < now() - make_interval(secs => ${windowSeconds})`;
  const [row] = await db
    .insert(rateLimits)
    .values({ key, count: 1 })
    .onConflictDoUpdate({
      target: rateLimits.key,
      set: {
        count: sql`CASE WHEN ${expired} THEN 1 ELSE ${rateLimits.count} + 1 END`,
        windowStart: sql`CASE WHEN ${expired} THEN now() ELSE ${rateLimits.windowStart} END`,
      },
    })
    .returning({ count: rateLimits.count });
  return (row?.count ?? 1) > limit;
}

export async function clearRateLimit(key: string): Promise<void> {
  const db = await getDb();
  await db.delete(rateLimits).where(eq(rateLimits.key, key));
}
