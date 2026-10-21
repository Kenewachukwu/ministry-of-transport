import nextEnv from "@next/env";
const { loadEnvConfig } = nextEnv;

/** Loads .env*.local etc. exactly as Next does, so scripts see the same variables. */
loadEnvConfig(process.cwd());

export function requireDatabaseUrl(): string {
  // Migrations should use the direct (non-pooled) connection when one is provided.
  const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is not set. Add it to .env.local (or your shell) and try again.");
    process.exit(1);
  }
  return url;
}
