"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { ActionError, guard, type ActionState } from "@/lib/admin/action";
import { authorize } from "@/lib/auth/dal";
import { parseFields } from "@/lib/admin/parse";
import { getEntity, type EntityDef } from "@/lib/admin/registry";
import { archiveRow, createRow, reorderRows, restoreRow, updateRow } from "@/lib/dal/admin/crud";

function definition(key: string): EntityDef {
  const def = getEntity(key);
  if (!def) throw new ActionError("That section doesn't exist.");
  return def;
}

/** Expire the public pages built from this content so the change shows immediately. */
function publish(def: EntityDef) {
  for (const tag of def.tags) updateTag(tag);
  revalidatePath(`/admin/${def.key}`);
}

export async function saveEntityAction(key: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  return guard(async () => {
    const def = definition(key);
    const user = await authorize(def.section);
    const values = def.schema.parse(parseFields(def.fields, formData));
    const id = String(formData.get("id") ?? "");

    if (id) {
      const version = Number.parseInt(String(formData.get("version") ?? ""), 10);
      if (!Number.isInteger(version)) throw new ActionError("This form is out of date. Reload the page and try again.");
      z.uuid().parse(id);
      await updateRow(def, user, id, version, values);
      publish(def);
      revalidatePath(`/admin/${def.key}/${id}`); // pick up the new version number for the next save
      return { ok: true, message: "Saved. The change is live on the website." };
    }

    const newId = await createRow(def, user, values);
    publish(def);
    redirect(`/admin/${def.key}/${newId}?created=1`);
  });
}

const idOnly = z.object({ id: z.uuid() });

export async function archiveEntityAction(key: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  return guard(async () => {
    const def = definition(key);
    const user = await authorize(def.section);
    const { id } = idOnly.parse(Object.fromEntries(formData));
    await archiveRow(def, user, id);
    publish(def);
    return { ok: true };
  });
}

export async function restoreEntityAction(key: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  return guard(async () => {
    const def = definition(key);
    const user = await authorize(def.section);
    const { id } = idOnly.parse(Object.fromEntries(formData));
    await restoreRow(def, user, id);
    publish(def);
    return { ok: true };
  });
}

export async function reorderEntityAction(key: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  return guard(async () => {
    const def = definition(key);
    const user = await authorize(def.section);
    const order = z.array(z.uuid()).max(500).parse(JSON.parse(String(formData.get("order") ?? "[]")));
    await reorderRows(def, user, order);
    publish(def);
    return { ok: true, message: "New order saved. It's live on the website." };
  });
}
