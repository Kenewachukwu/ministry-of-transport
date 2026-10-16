"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { users } from "@/db/schema";
import { audit } from "@/lib/auth/audit";
import { PASSWORD_MAX } from "@/lib/auth/config";
import { burnPasswordCheck, passwordProblem, verifyPassword } from "@/lib/auth/password";
import { clearRateLimit, hitRateLimit } from "@/lib/auth/rate-limit";
import { clientInfo, endSession, getCurrentUser, revokeAllSessions, startSession } from "@/lib/auth/session";
import { consumeToken, issueToken } from "@/lib/auth/tokens";
import { findUserByEmail, sendReset, setPassword } from "@/lib/auth/users";
import { ActionError, emailSchema, guard, safeAdminPath, type ActionState } from "@/lib/admin/action";

const FIFTEEN_MINUTES = 15 * 60;
const ONE_HOUR = 60 * 60;

export async function loginAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  return guard(async () => {
    const input = z
      .object({ email: emailSchema, password: z.string().min(1, "Enter your password.").max(PASSWORD_MAX), next: z.string().optional() })
      .parse(Object.fromEntries(formData));
    const { ip } = await clientInfo();

    // Count every attempt; a success clears the per-email counter below.
    const blocked =
      (await hitRateLimit(`login:email:${input.email}`, 5, FIFTEEN_MINUTES)) ||
      (await hitRateLimit(`login:ip:${ip ?? "unknown"}`, 30, FIFTEEN_MINUTES));
    if (blocked) throw new ActionError("Too many sign-in attempts. Please wait a few minutes and try again.");

    const user = await findUserByEmail(input.email);
    let valid = false;
    if (user && user.status === "active" && user.passwordHash) valid = await verifyPassword(user.passwordHash, input.password);
    else await burnPasswordCheck(input.password); // keep timing the same for unknown emails

    if (!user || !valid) {
      await audit({ id: null, label: input.email }, "auth.login_failed", { summary: "Failed sign-in" });
      // One message for every failure, so it never reveals which emails have accounts.
      throw new ActionError("Incorrect email or password.");
    }

    await clearRateLimit(`login:email:${input.email}`);
    await startSession(user.id);
    const db = await getDb();
    await db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, user.id));
    await audit({ id: user.id, label: user.email }, "auth.login");
    redirect(safeAdminPath(input.next));
  });
}

export async function logoutAction(): Promise<void> {
  const user = await getCurrentUser();
  await endSession();
  if (user) await audit({ id: user.id, label: user.email }, "auth.logout");
  redirect("/admin/login");
}

const GENERIC_FORGOT = "If that email belongs to an active account, a reset link is on its way. It expires in 60 minutes.";

export async function forgotPasswordAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  return guard(async () => {
    const { email } = z.object({ email: emailSchema }).parse(Object.fromEntries(formData));
    const { ip } = await clientInfo();
    const blocked =
      (await hitRateLimit(`reset:email:${email}`, 3, ONE_HOUR)) || (await hitRateLimit(`reset:ip:${ip ?? "unknown"}`, 10, ONE_HOUR));
    if (!blocked) {
      const user = await findUserByEmail(email);
      if (user && user.status === "active") {
        const token = await issueToken(user.id, "reset");
        await sendReset(user, token);
        await audit({ id: user.id, label: user.email }, "auth.reset_requested");
      }
    }
    // Identical response whether or not the account exists (or the request was rate limited).
    return { ok: true, message: GENERIC_FORGOT };
  });
}

const passwordPair = z
  .object({ token: z.string().min(10).max(200), password: z.string().max(PASSWORD_MAX), confirm: z.string() })
  .superRefine((value, ctx) => {
    const problem = passwordProblem(value.password);
    if (problem) ctx.addIssue({ code: "custom", path: ["password"], message: problem });
    if (value.password !== value.confirm) ctx.addIssue({ code: "custom", path: ["confirm"], message: "The two passwords don't match." });
  });

const BAD_LINK = "This link is invalid or has expired. Ask for a new one.";

export async function resetPasswordAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  return guard(async () => {
    const input = passwordPair.parse(Object.fromEntries(formData));
    const { ip } = await clientInfo();
    if (await hitRateLimit(`token:ip:${ip ?? "unknown"}`, 10, ONE_HOUR)) throw new ActionError("Too many attempts. Please try again later.");

    // Validate first, consume second, so a typo in the new password doesn't burn the link.
    const userId = await consumeToken(input.token, "reset");
    if (!userId) throw new ActionError(BAD_LINK);
    await setPassword(userId, input.password);
    await revokeAllSessions(userId);
    await audit({ id: userId, label: "reset link" }, "auth.password_reset", { entity: "user", entityId: userId });
    redirect("/admin/login?notice=password-reset");
  });
}

export async function acceptInviteAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  return guard(async () => {
    const input = passwordPair.parse(Object.fromEntries(formData));
    const { ip } = await clientInfo();
    if (await hitRateLimit(`token:ip:${ip ?? "unknown"}`, 10, ONE_HOUR)) throw new ActionError("Too many attempts. Please try again later.");

    const userId = await consumeToken(input.token, "invite");
    if (!userId) throw new ActionError(BAD_LINK);
    await setPassword(userId, input.password);
    await audit({ id: userId, label: "invitation" }, "auth.invite_accepted", { entity: "user", entityId: userId });
    await startSession(userId);
    redirect("/admin");
  });
}
