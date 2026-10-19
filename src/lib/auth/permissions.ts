/**
 * What a signed-in person may manage. `super_admin` can do everything,
 * including users, the audit log and system status; a `staff` user holds a set
 * of section grants chosen by a super administrator ("designated personnel
 * with assigned permissions" in the Ministry's brief).
 */
export const SECTIONS = [
  "site_text",
  "hero",
  "news",
  "departments",
  "leadership",
  "road_ahead",
  "fcssip",
  "e_services",
  "resources",
] as const;

export type Section = (typeof SECTIONS)[number];

export const SECTION_LABELS: Record<Section, string> = {
  site_text: "Mandate, Mission & Vision",
  hero: "Home page hero",
  news: "News, Photo News & Events",
  departments: "Departments",
  leadership: "Leadership",
  road_ahead: "The Road Ahead",
  fcssip: "FCSSIP 25 page",
  e_services: "E-Services",
  resources: "Resources & documents",
};

export type Role = "super_admin" | "staff";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  permissions: Section[];
  /** When the current session ends (ISO time). Set for signed-in requests; the editor warns shortly before it. */
  sessionExpiresAt?: string;
}

export function isSection(value: string): value is Section {
  return (SECTIONS as readonly string[]).includes(value);
}

export function can(user: Pick<SessionUser, "role" | "permissions">, section: Section): boolean {
  return user.role === "super_admin" || user.permissions.includes(section);
}

export class ForbiddenError extends Error {
  constructor(message = "You do not have permission to do that.") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export function assertCan(user: Pick<SessionUser, "role" | "permissions">, section: Section): void {
  if (!can(user, section)) throw new ForbiddenError();
}

export function assertSuperAdmin(user: Pick<SessionUser, "role">): void {
  if (user.role !== "super_admin") throw new ForbiddenError("Only a super administrator can do that.");
}
