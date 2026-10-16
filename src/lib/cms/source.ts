import { contentSource } from "@/lib/env";
import type { ContentSource } from "./types";
import { staticSource } from "./static";

/**
 * Chooses where public content is read from: the database when one is
 * configured and seeded, otherwise the static content files. The static
 * fallback is never wrapped in the data cache — it lives in code, and a
 * cache entry could outlive the deployment that produced it.
 */
export async function resolveSource(): Promise<ContentSource> {
  if (contentSource() === "static") return staticSource;
  const { getDbSource } = await import("./db-source");
  return (await getDbSource()) ?? staticSource;
}
