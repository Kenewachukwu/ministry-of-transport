"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ActionError, emailSchema, guard, type ActionState } from "@/lib/admin/action";
import { audit } from "@/lib/auth/audit";
import { authorize } from "@/lib/auth/dal";
import { isSection } from "@/lib/auth/permissions";
import { issueToken } from "@/lib/auth/tokens";
import { archiveUser, createInvitedUser, restoreUser, sendInvite, updateUserAccess } from "@/lib/auth/users";
import { getDb } from "@/db/client";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

const accessSchema = z.object({
  name: z.string().trim().min(2, "Enter a name.").max(120),
  role: z.enum(["super_admin", "staff"]),
});

const permissionsFrom = (formData: FormData) => formData.getAll("permissions").map(String).filter(isSection);

export async function inviteUserAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  return guard(async () => {
    const actor = await authorize("super_admin");
    const input = accessSchema.extend({ email: emailSchema }).parse(Object.fromEntries(formData));
    const permissions = permissionsFrom(formData);
    if (input.role === "staff" && permissions.length === 0) {
      return { error: "Choose at least one section for this person to manage (or make them a super administrator).", fieldErrors: { permissions: "Choose at least one section." } };
    }
    const { user, token } = await createInvitedUser({ ...input, permissions }, { id: actor.id, label: actor.email });
    const delivery = await sendInvite(user, token);
    revalidatePath("/admin/users");
    return delivery.sent
      ? { ok: true, message: `Invitation sent to ${user.email}. The link works once and expires in 72 hours.` }
      : {
          ok: true,
          message: `${user.email} has been invited, but no email could be sent from here.`,
          reveal: { label: `Invitation link for ${user.email}`, value: delivery.link! },
        };
  });
}

export async function updateUserAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  return guard(async () => {
    const actor = await authorize("super_admin");
    const input = accessSchema.extend({ id: z.uuid() }).parse(Object.fromEntries(formData));
    const permissions = permissionsFrom(formData);
    if (input.role === "staff" && permissions.length === 0) {
      return { error: "A content editor needs at least one section.", fieldErrors: { permissions: "Choose at least one section." } };
    }
    await updateUserAccess(input.id, { name: input.name, role: input.role, permissions }, { id: actor.id, label: actor.email });
    revalidatePath("/admin/users");
    return { ok: true, message: "Access updated. It takes effect on their next page load." };
  });
}

export async function archiveUserAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  return guard(async () => {
    const actor = await authorize("super_admin");
    const { id } = z.object({ id: z.uuid() }).parse(Object.fromEntries(formData));
    await archiveUser(id, { id: actor.id, label: actor.email });
    revalidatePath("/admin/users");
    return { ok: true, message: "Account deactivated. They were signed out everywhere and can no longer sign in." };
  });
}

export async function restoreUserAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  return guard(async () => {
    const actor = await authorize("super_admin");
    const { id } = z.object({ id: z.uuid() }).parse(Object.fromEntries(formData));
    const { token, user } = await restoreUser(id, { id: actor.id, label: actor.email });
    revalidatePath("/admin/users");
    if (token) {
      const delivery = await sendInvite(user, token);
      return delivery.sent
        ? { ok: true, message: `Account restored. A new invitation was emailed to ${user.email}.` }
        : { ok: true, message: "Account restored.", reveal: { label: `Invitation link for ${user.email}`, value: delivery.link! } };
    }
    return { ok: true, message: "Account restored. They can sign in again." };
  });
}

export async function resendInviteAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  return guard(async () => {
    const actor = await authorize("super_admin");
    const { id } = z.object({ id: z.uuid() }).parse(Object.fromEntries(formData));
    const db = await getDb();
    const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    if (!user || user.status !== "invited") throw new ActionError("That person has already activated their account.");
    const token = await issueToken(user.id, "invite", actor.id);
    await audit({ id: actor.id, label: actor.email }, "user.invite_resent", { entity: "user", entityId: id });
    const delivery = await sendInvite(user, token);
    return delivery.sent
      ? { ok: true, message: `A new invitation was emailed to ${user.email}. The previous link no longer works.` }
      : { ok: true, message: "A new link was generated.", reveal: { label: `Invitation link for ${user.email}`, value: delivery.link! } };
  });
}

