import "server-only";
import { redirect } from "next/navigation";
import { getCurrentUser } from "./session";
import { assertCan, assertSuperAdmin, can, ForbiddenError, type Section, type SessionUser } from "./permissions";

/**
 * Authorization checks, called by every admin page AND every Server Action.
 * Layouts don't re-run on client navigation and Server Actions are directly
 * reachable by POST, so a check in a layout or the proxy is never enough.
 */

/** For pages: send signed-out visitors to the login page. */
export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  return user;
}

/** For pages: signed-in users without access go back to the dashboard with a notice. */
export async function requireSectionPage(section: Section): Promise<SessionUser> {
  const user = await requireUser();
  if (!can(user, section)) redirect("/admin?denied=1");
  return user;
}

export async function requireSuperAdminPage(): Promise<SessionUser> {
  const user = await requireUser();
  if (user.role !== "super_admin") redirect("/admin?denied=1");
  return user;
}

/** For Server Actions and route handlers: throw instead of redirecting. */
export async function authorize(section?: Section | "super_admin"): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) throw new ForbiddenError("Your session has expired. Please sign in again.");
  if (section === "super_admin") assertSuperAdmin(user);
  else if (section) assertCan(user, section);
  return user;
}
