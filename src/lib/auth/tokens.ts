import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { and, eq, gt, isNull, sql } from "drizzle-orm";
import { getDb, type Db } from "@/db/client";
import { authTokens } from "@/db/schema";
import { INVITE_TTL_MS, RESET_TTL_MS } from "./config";

export type TokenPurpose = "invite" | "reset";

/** Only this hash is stored; the raw token exists in the emailed link and nowhere else. */
export const hashToken = (raw: string) => createHash("sha256").update(raw).digest("hex");

/**
 * Issues a new one-time token, voiding any earlier unused token of the same
 * purpose for that user (so there is only ever one live link).
 */
export async function issueToken(
  userId: string,
  purpose: TokenPurpose,
  createdBy?: string,
  database?: Db
): Promise<string> {
  const db = database ?? (await getDb());
  const raw = randomBytes(32).toString("base64url");
  const ttl = purpose === "invite" ? INVITE_TTL_MS : RESET_TTL_MS;
  await db.transaction(async (tx) => {
    await tx
      .update(authTokens)
      .set({ usedAt: new Date() })
      .where(and(eq(authTokens.userId, userId), eq(authTokens.purpose, purpose), isNull(authTokens.usedAt)));
    await tx.insert(authTokens).values({
      userId,
      purpose,
      tokenHash: hashToken(raw),
      expiresAt: new Date(Date.now() + ttl),
      createdBy: createdBy ?? null,
    });
  });
  return raw;
}

/**
 * Looks at a token WITHOUT using it. Opening a link must never consume it:
 * mail scanners and link-preview bots fetch URLs before the recipient does.
 */
export async function peekToken(raw: string, purpose: TokenPurpose): Promise<string | null> {
  const db = await getDb();
  const [row] = await db
    .select({ userId: authTokens.userId })
    .from(authTokens)
    .where(
      and(
        eq(authTokens.tokenHash, hashToken(raw)),
        eq(authTokens.purpose, purpose),
        isNull(authTokens.usedAt),
        gt(authTokens.expiresAt, sql`now()`)
      )
    )
    .limit(1);
  return row?.userId ?? null;
}

/** Uses the token: one atomic statement, so it can succeed at most once. Returns the user id. */
export async function consumeToken(raw: string, purpose: TokenPurpose): Promise<string | null> {
  const db = await getDb();
  const [row] = await db
    .update(authTokens)
    .set({ usedAt: new Date() })
    .where(
      and(
        eq(authTokens.tokenHash, hashToken(raw)),
        eq(authTokens.purpose, purpose),
        isNull(authTokens.usedAt),
        gt(authTokens.expiresAt, sql`now()`)
      )
    )
    .returning({ userId: authTokens.userId });
  return row?.userId ?? null;
}
