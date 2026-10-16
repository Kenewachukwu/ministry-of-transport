"use server";

import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";
import { getDb } from "@/db/client";
import { siteText } from "@/db/schema";
import { inArray } from "drizzle-orm";
import { guard, type ActionState } from "@/lib/admin/action";
import { audit } from "@/lib/auth/audit";
import { authorize } from "@/lib/auth/dal";
import { TAG } from "@/lib/cms/cache";

const required = (max: number) => z.string().trim().min(1, "This field is required.").max(max, `Keep this under ${max} characters.`);
const optional = (max: number) => z.string().trim().max(max, `Keep this under ${max} characters.`);

const GROUPS = {
  core: {
    section: "site_text",
    tag: TAG.siteText,
    path: "/admin/site-text",
    schema: z.object({ mandate: required(1200), vision: required(600), mission: required(1200) }),
  },
  fcssip: {
    section: "fcssip",
    tag: TAG.fcssip,
    path: "/admin/fcssip",
    schema: z.object({ "fcssip.eyebrow": optional(120), "fcssip.title": required(120), "fcssip.description": optional(400) }),
  },
} as const;

/** Saves a group of singleton text fields (mandate/vision/mission, or the FCSSIP page header). */
export async function saveSiteTextAction(group: keyof typeof GROUPS, _prev: ActionState, formData: FormData): Promise<ActionState> {
  return guard(async () => {
    const g = GROUPS[group];
    const user = await authorize(g.section);
    const values = g.schema.parse(Object.fromEntries(formData)) as Record<string, string>;
    const db = await getDb();
    const keys = Object.keys(values);

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
    if (changed.length === 0) return { ok: true, message: "Nothing to change." };

    await audit({ id: user.id, label: user.email }, `${group === "core" ? "site-text" : "fcssip-header"}.update`, {
      entity: "site_text",
      summary: `Edited ${changed.map((c) => c.field).join(", ")}`,
      meta: { changes: changed },
    });
    updateTag(g.tag);
    revalidatePath(g.path);
    return { ok: true, message: "Saved. The change is live on the website." };
  });
}

