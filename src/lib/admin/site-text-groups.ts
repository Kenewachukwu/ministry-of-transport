import "server-only";
import { z } from "zod";
import { TAG } from "@/lib/cms/cache";

const required = (max: number) => z.string().trim().min(1, "This field is required.").max(max, `Keep this under ${max} characters.`);
const optional = (max: number) => z.string().trim().max(max, `Keep this under ${max} characters.`);
/** Empty, or a full https:// address. */
const optionalHttps = z
  .string()
  .trim()
  .max(300, "Keep this under 300 characters.")
  .refine((v) => v === "" || /^https:\/\/[^\s]+$/.test(v), "Use a full https:// link, or leave it empty.");
const phone = z
  .string()
  .trim()
  .max(30, "Keep this under 30 characters.")
  .refine((v) => v === "" || /^\+?[0-9][0-9 ()-]{5,}$/.test(v), "Use digits, spaces, + and - only, or leave it empty.");
const email = z.string().trim().toLowerCase().max(254, "Keep this under 254 characters.").pipe(z.email("Enter a valid email address."));

export const GROUPS = {
  core: {
    section: "site_text",
    tag: TAG.siteText,
    path: "/admin/site-text",
    audit: "site-text.update",
    schema: z.object({ mandate: required(1200), vision: required(600), mission: required(1200) }),
  },
  fcssip: {
    section: "fcssip",
    tag: TAG.fcssip,
    path: "/admin/fcssip",
    audit: "fcssip-header.update",
    schema: z.object({ "fcssip.eyebrow": optional(120), "fcssip.title": required(120), "fcssip.description": optional(400) }),
  },
  contact: {
    section: "contact",
    tag: TAG.contact,
    path: "/admin/contact",
    audit: "contact.update",
    schema: z.object({
      "contact.address": required(300),
      "contact.hours": required(120),
      "contact.phone": phone,
      "contact.email": email,
      "social.x": optionalHttps,
      "social.instagram": optionalHttps,
      "social.facebook": optionalHttps,
      "social.youtube": optionalHttps,
    }),
  },
} as const;

export type SiteTextGroup = keyof typeof GROUPS;

/** The keys a group owns, for the pages that show them. */
export const groupKeys = (group: SiteTextGroup): string[] => Object.keys(GROUPS[group].schema.shape);

