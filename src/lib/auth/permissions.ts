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
  "contact",
  "enquiries",
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
  contact: "Contact details & links",
  enquiries: "Enquiries",
};

/**
 * Sections made of a few fixed pieces of text rather than a list of items. They have
 * no drafts: a save puts the new wording on the website at once, so only someone who
 * can PUBLISH in the section may save it (editing alone would be a back door past
 * the approval step).
 */
export const DIRECT_SECTIONS: readonly Section[] = ["site_text", "contact"];

/**
 * Sections that are an inbox rather than website content: nothing in them is
 * published, so there is no Publish grant, only the right to read and handle
 * what arrives.
 */
export const INBOX_SECTIONS: readonly Section[] = ["enquiries"];

export type Role = "super_admin" | "staff";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  /** Sections this person may edit. */
  permissions: Section[];
  /** Sections where they may also PUBLISH (approve others' work, archive, re-order). A subset of `permissions`. */
  publishPermissions: Section[];
  /** When the current session ends (ISO time). Set for signed-in requests; the editor warns shortly before it. */
  sessionExpiresAt?: string;
}

export function isSection(value: string): value is Section {
  return (SECTIONS as readonly string[]).includes(value);
}

export function can(user: Pick<SessionUser, "role" | "permissions">, section: Section): boolean {
  return user.role === "super_admin" || user.permissions.includes(section);
}

/** May this person publish in the section? Publishing is what puts changes on the website, approves others' work, archives and re-orders. */
export function canPublish(user: Pick<SessionUser, "role" | "publishPermissions">, section: Section): boolean {
  return user.role === "super_admin" || user.publishPermissions.includes(section);
}

/** Does the person hold the publish grant in ANY section? (They have something to review.) */
export function canPublishAnywhere(user: Pick<SessionUser, "role" | "publishPermissions">): boolean {
  return user.role === "super_admin" || user.publishPermissions.length > 0;
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

export function assertCanPublish(user: Pick<SessionUser, "role" | "publishPermissions">, section: Section): void {
  if (!canPublish(user, section)) throw new ForbiddenError("You can edit this section, but only someone who can publish in it can do that.");
}

export function assertSuperAdmin(user: Pick<SessionUser, "role">): void {
  if (user.role !== "super_admin") throw new ForbiddenError("Only a super administrator can do that.");
}
