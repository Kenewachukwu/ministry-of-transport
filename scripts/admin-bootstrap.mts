import { requireDatabaseUrl } from "./_env.mjs";
import { createPostgresDb } from "../src/db/drivers/postgres";
import { ensureBootstrapAdmin } from "../src/lib/auth/bootstrap";
import type { Db } from "../src/db/client";

/**
 * Usage: npm run admin:bootstrap -- --email someone@transportation.gov.ng [--name "Full Name"]
 * Creates the first super administrator and prints a one-time invitation link
 * (valid for 72 hours). Safe to re-run to issue a new link for someone who has
 * not signed in yet.
 */
function arg(flag: string): string | undefined {
  const i = process.argv.indexOf(flag);
  return i > -1 ? process.argv[i + 1] : undefined;
}

const email = arg("--email") ?? process.env.BOOTSTRAP_ADMIN_EMAIL;
const name = arg("--name") ?? process.env.BOOTSTRAP_ADMIN_NAME ?? "Administrator";
if (!email) {
  console.error('Missing email. Use: npm run admin:bootstrap -- --email someone@example.gov.ng --name "Full Name"');
  process.exit(1);
}

const db = createPostgresDb(requireDatabaseUrl());
const result = await ensureBootstrapAdmin(email, name, db as unknown as Db);
if (result.link) {
  console.log(`\n${result.created ? "Created" : "Re-invited"} ${email}. Open this link once to set a password (expires in 72 hours):\n\n${result.link}\n`);
} else {
  console.log(`${email} already has an active account — nothing to do.`);
}
await db.$client.end();
