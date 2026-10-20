import "server-only";
import { and, eq, ne, or, sql } from "drizzle-orm";
import { getDb } from "@/db/client";
import { users } from "@/db/schema";
import type { Section } from "@/lib/auth/permissions";
import { getEmailProvider } from "@/lib/email/provider";
import { approvalRequestEmail } from "@/lib/email/templates";
import type { EntityDef } from "@/lib/admin/registry";

/** The active people who can approve work in a section: its publishers and the super administrators. */
export async function publishersOf(section: Section, excludeUserId?: string): Promise<{ email: string; name: string }[]> {
  const db = await getDb();
  return db
    .select({ email: users.email, name: users.name })
    .from(users)
    .where(
      and(
        eq(users.status, "active"),
        or(eq(users.role, "super_admin"), sql`${section} = ANY(${users.publishPermissions})`),
        excludeUserId ? ne(users.id, excludeUserId) : undefined
      )
    );
}

/**
 * Tells the section's publishers that something is waiting. Best effort: the
 * item is already in the Approvals queue, so a missing or failing email provider
 * must never make the author's submission fail. Returns how many were told.
 */
export async function notifyPublishers(def: EntityDef, item: { id: string; title: string }, author: { id: string; name: string }): Promise<number> {
  const provider = getEmailProvider();
  if (!provider) return 0;
  let told = 0;
  try {
    for (const person of await publishersOf(def.section, author.id)) {
      try {
        await provider.send(approvalRequestEmail(person.email, person.name, { section: def.plural, singular: def.singular, title: item.title, author: author.name, id: item.id }));
        told++;
      } catch (error) {
        console.error("[approvals] could not email a publisher:", error instanceof Error ? error.message : error);
      }
    }
  } catch (error) {
    console.error("[approvals] could not look up publishers:", error instanceof Error ? error.message : error);
  }
  return told;
}
