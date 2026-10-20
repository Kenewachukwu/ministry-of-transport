"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { ActionError, guard, type ActionState } from "@/lib/admin/action";
import { authorize } from "@/lib/auth/dal";
import { canPublish } from "@/lib/auth/permissions";
import { parseFields } from "@/lib/admin/parse";
import { getEntity, type EntityDef } from "@/lib/admin/registry";
import { approveRow, archiveRow, createRow, discardChanges, reorderRows, restoreRow, returnRow, submitForApproval, updateRow } from "@/lib/dal/admin/crud";

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

/** What the person asked for with the button they pressed: just save, save and submit for approval, or (publishers) save and publish. */
const intentOf = (formData: FormData): "save" | "submit" | "publish" => {
  const v = String(formData.get("intent") ?? "save");
  return v === "submit" || v === "publish" ? v : "save";
};

export async function saveEntityAction(key: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  return guard(async () => {
    const def = definition(key);
    const user = await authorize(def.section);
    const values = def.schema.parse(parseFields(def.fields, formData));
    const id = String(formData.get("id") ?? "");
    const intent = intentOf(formData);

    if (id) {
      const version = Number.parseInt(String(formData.get("version") ?? ""), 10);
      if (!Number.isInteger(version)) throw new ActionError("This form is out of date. Reload the page and try again.");
      z.uuid().parse(id);
      const outcome = await updateRow(def, user, id, version, values);
      if (intent === "submit") await submitForApproval(def, user, id);
      if (intent === "publish") await approveRow(def, user, id);
      if (outcome === "live" || intent === "publish") publish(def);
      revalidatePath(`/admin/${def.key}`);
      revalidatePath(`/admin/${def.key}/${id}`); // pick up the new version number for the next save
      return { ok: true, message: savedMessage(outcome, intent) };
    }

    const newId = await createRow(def, user, values);
    if (intent === "submit") await submitForApproval(def, user, newId);
    publish(def);
    const created = canPublish(user, def.section) ? "live" : intent === "submit" ? "submitted" : "draft";
    redirect(`/admin/${def.key}/${newId}?created=${created}`);
  });
}

function savedMessage(outcome: "live" | "proposed" | "draft", intent: "save" | "submit" | "publish"): string {
  if (intent === "publish") return "Published. The change is live on the website.";
  if (intent === "submit") return "Submitted for approval. The website keeps showing the current version until a publisher approves it.";
  if (outcome === "live") return "Saved. The change is live on the website.";
  if (outcome === "proposed") return "Saved as proposed changes. The website still shows the published version.";
  return "Draft saved. It is not on the website yet.";
}

/** From a list or an edit page: send a draft (or proposed changes) for approval. */
export async function submitEntityAction(key: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  return guard(async () => {
    const def = definition(key);
    const user = await authorize(def.section);
    const { id } = z.object({ id: z.uuid() }).parse(Object.fromEntries(formData));
    await submitForApproval(def, user, id);
    revalidatePath(`/admin/${def.key}`);
    revalidatePath(`/admin/${def.key}/${id}`);
    revalidatePath("/admin/review");
    return { ok: true, message: "Submitted for approval." };
  });
}

export async function approveEntityAction(key: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  return guard(async () => {
    const def = definition(key);
    const user = await authorize(def.section);
    const { id } = z.object({ id: z.uuid() }).parse(Object.fromEntries(formData));
    await approveRow(def, user, id);
    publish(def);
    revalidatePath(`/admin/${def.key}/${id}`);
    revalidatePath("/admin/review");
    return { ok: true, message: "Approved. It is live on the website." };
  });
}

export async function returnEntityAction(key: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  return guard(async () => {
    const def = definition(key);
    const user = await authorize(def.section);
    const { id, note } = z.object({ id: z.uuid(), note: z.string().max(1000) }).parse(Object.fromEntries(formData));
    await returnRow(def, user, id, note);
    revalidatePath(`/admin/${def.key}`);
    revalidatePath(`/admin/${def.key}/${id}`);
    revalidatePath("/admin/review");
    return { ok: true, message: "Sent back to the author with your note." };
  });
}

export async function discardEntityAction(key: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  return guard(async () => {
    const def = definition(key);
    const user = await authorize(def.section);
    const { id } = z.object({ id: z.uuid() }).parse(Object.fromEntries(formData));
    await discardChanges(def, user, id);
    revalidatePath(`/admin/${def.key}`);
    revalidatePath(`/admin/${def.key}/${id}`);
    revalidatePath("/admin/review");
    return { ok: true, message: "Discarded. The website was not affected." };
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
