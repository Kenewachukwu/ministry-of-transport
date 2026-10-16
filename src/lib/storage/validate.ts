/**
 * Where a picture or file may come from. Pictures are rendered by next/image,
 * which refuses hosts that aren't listed in next.config.ts — so an arbitrary
 * URL pasted into the admin would break the page at render time. Only these
 * origins are accepted (and `next.config.ts` must list the same hosts).
 */
const ALLOWED_IMAGE_HOSTS = [/^images\.unsplash\.com$/, /^images\.pexels\.com$/, /^[a-z0-9-]+\.public\.blob\.vercel-storage\.com$/];

export function isAllowedMediaUrl(value: string): boolean {
  if (/^\/(images|uploads)\/[A-Za-z0-9._\-/]+$/.test(value) && !value.includes("..")) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && ALLOWED_IMAGE_HOSTS.some((re) => re.test(url.hostname));
  } catch {
    return false;
  }
}

/** Link targets: a site path, an https/mailto/tel link — never `javascript:` / `data:` / protocol-relative. */
export function isAllowedLink(value: string): boolean {
  if (value === "#") return true;
  if (value.startsWith("/") && !value.startsWith("//") && !value.includes("\\")) return true;
  return /^(https:\/\/|mailto:|tel:)\S+$/i.test(value);
}

export const IMAGE_TYPES = {
  "image/jpeg": ["jpg", "jpeg"],
  "image/png": ["png"],
  "image/webp": ["webp"],
  "image/avif": ["avif"],
} as const;

export const DOCUMENT_TYPES = {
  "application/pdf": ["pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ["docx"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ["xlsx"],
} as const;

export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
export const MAX_DOCUMENT_BYTES = 25 * 1024 * 1024;
