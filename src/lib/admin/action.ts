import "server-only";
import { unstable_rethrow } from "next/navigation";
import { z } from "zod";
import { ForbiddenError } from "@/lib/auth/permissions";
import { UserError } from "@/lib/auth/users";
import { ContentError } from "@/lib/dal/admin/errors";

/** What every admin Server Action returns to its form. */
export interface ActionState {
  ok?: boolean;
  message?: string;
  error?: string;
  fieldErrors?: Record<string, string>;
  /** For site-text forms: when the saved group was last changed, so the next save knows what the form is based on. */
  loadedAt?: string;
  /** One-time secret shown to the administrator (e.g. an invitation link when email is not configured). */
  reveal?: { label: string; value: string };
}

export class ActionError extends Error {}

/**
 * Wraps an action body: validation problems become field errors, permission
 * and expected failures become messages, and anything unexpected is logged and
 * reported generically (internal details never reach the browser). Redirects
 * and other Next.js control flow pass straight through.
 */
export async function guard(run: () => Promise<ActionState | void>): Promise<ActionState> {
  try {
    return (await run()) ?? { ok: true };
  } catch (error) {
    unstable_rethrow(error);
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of error.issues) fieldErrors[String(issue.path[0] ?? "form")] ??= issue.message;
      return { error: "Please correct the highlighted fields.", fieldErrors };
    }
    if (error instanceof ForbiddenError || error instanceof UserError || error instanceof ActionError || error instanceof ContentError) {
      return { error: error.message };
    }
    console.error("[admin action] unexpected error:", error);
    return { error: "Something went wrong. Please try again." };
  }
}

/** A local path inside /admin, or the dashboard. Prevents the login page being used as an open redirect. */
export function safeAdminPath(candidate: unknown): string {
  if (typeof candidate !== "string") return "/admin";
  if (!candidate.startsWith("/admin") || candidate.startsWith("//") || candidate.includes("\\")) return "/admin";
  return candidate;
}

export const emailSchema = z.string().trim().toLowerCase().max(254).pipe(z.email("Enter a valid email address."));

export const PASSWORD_HINT = "At least 12 characters — a short sentence works well.";
