"use server";

import { z } from "zod";
import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { users } from "@/db/schema";
import { ActionError, guard, type ActionState } from "@/lib/admin/action";
import { audit } from "@/lib/auth/audit";
import { PASSWORD_MAX } from "@/lib/auth/config";
import { authorize } from "@/lib/auth/dal";
import { passwordProblem, verifyPassword } from "@/lib/auth/password";
import { hitRateLimit } from "@/lib/auth/rate-limit";
import { revokeAllSessions, startSession } from "@/lib/auth/session";
import { setPassword } from "@/lib/auth/users";

export async function changePasswordAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  return guard(async () => {
    const me = await authorize();
    const input = z
      .object({ current: z.string().min(1, "Enter your current password.").max(PASSWORD_MAX), password: z.string().max(PASSWORD_MAX), confirm: z.string() })
      .superRefine((v, ctx) => {
        const problem = passwordProblem(v.password);
        if (problem) ctx.addIssue({ code: "custom", path: ["password"], message: problem });
        if (v.password !== v.confirm) ctx.addIssue({ code: "custom", path: ["confirm"], message: "The two passwords don't match." });
      })
      .parse(Object.fromEntries(formData));

    // Slows down anyone who has taken over an unlocked session and is guessing the current password.
    if (await hitRateLimit(`pwchange:${me.id}`, 5, 15 * 60)) throw new ActionError("Too many attempts. Please wait a few minutes.");

    const db = await getDb();
    const [row] = await db.select({ hash: users.passwordHash }).from(users).where(eq(users.id, me.id)).limit(1);
    if (!row?.hash || !(await verifyPassword(row.hash, input.current))) {
      return { error: "Your current password is not correct.", fieldErrors: { current: "Incorrect password." } };
    }
    await setPassword(me.id, input.password);
    await revokeAllSessions(me.id); // signs out every other browser…
    await startSession(me.id); // …and keeps this one signed in
    await audit({ id: me.id, label: me.email }, "auth.password_changed", { entity: "user", entityId: me.id });
    return { ok: true, message: "Password changed. You've been signed out of any other browsers." };
  });
}
