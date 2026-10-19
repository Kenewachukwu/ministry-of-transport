"use server";

import { revalidatePath, updateTag } from "next/cache";
import { getDb } from "@/db/client";
import { siteText } from "@/db/schema";
import { inArray } from "drizzle-orm";
import { guard, type ActionState } from "@/lib/admin/action";
import { changedSince, readSiteTextGroup } from "@/lib/admin/site-text";
import { audit } from "@/lib/auth/audit";
import { authorize } from "@/lib/auth/dal";
import { ConflictError } from "@/lib/dal/admin/errors";
import { GROUPS, type SiteTextGroup } from "@/lib/admin/site-text-groups";

/** Saves a group of singleton text fields (mandate/vision/mission, the FCSSIP page header, or the contact details). */
export async function saveSiteTextAction(group: SiteTextGroup, _prev: ActionState, formData: FormData): Promise<ActionState> {
  return guard(async () => {
    const g = GROUPS[group];
    const user = await authorize(g.section);
    const values = g.schema.parse(Object.fromEntries(formData)) as Record<string, string>;
    const keys = Object.keys(values);
    const loadedAt = String(formData.get("loadedAt") ?? "");

    // Refuse to overwrite what someone else saved while this form was open.
    const current = await readSiteTextGroup(keys);
    if (changedSince(loadedAt, current.loadedAt)) throw new ConflictError();

    const db = await getDb();
    const before = new Map((await db.select().from(siteText).where(inArray(siteText.key, keys))).map((r) => [r.key, r.value]));
    const changed: { field: string; before: string | null; after: string }[] = [];
    for (const [key, value] of Object.entries(values)) {
      if (before.get(key) === value) continue;
      await db
        .insert(siteText)
        .values({ key, value, updatedBy: user.id })
        .onConflictDoUpdate({ target: siteText.key, set: { value, updatedAt: new Date(), updatedBy: user.id } });
      changed.push({ field: key, before: before.get(key)?.slice(0, 1500) ?? null, after: value.slice(0, 1500) });
    }
    if (changed.length === 0) return { ok: true, message: "Nothing to change.", loadedAt: current.loadedAt };

    await audit({ id: user.id, label: user.email }, g.audit, {
      entity: "site_text",
      summary: `Edited ${changed.map((c) => c.field).join(", ")}`,
      meta: { changes: changed },
    });
    updateTag(g.tag);
    revalidatePath(g.path);
    const after = await readSiteTextGroup(keys);
    return { ok: true, message: "Saved. The change is live on the website.", loadedAt: after.loadedAt };
  });
}
