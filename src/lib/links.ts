/**
 * Content stores links either as site-relative paths ("/about", resolved
 * against the site's base path) or as absolute URLs ("https://…", opened as
 * external links). Anything else — `javascript:`, `data:`, protocol-relative
 * `//host` — is treated as unsafe and neutralised to "#".
 */
export function isExternalHref(href: string): boolean {
  return /^(https?:\/\/|mailto:|tel:)/i.test(href);
}

export function isSafeHref(href: string): boolean {
  if (isExternalHref(href)) return true;
  return href.startsWith("/") && !href.startsWith("//");
}

export function resolveHref(basePath: string, href: string): { href: string; external: boolean } {
  if (isExternalHref(href)) return { href, external: true };
  if (!isSafeHref(href)) return { href: "#", external: false };
  return { href: `${basePath}${href === "/" ? "" : href}` || "/", external: false };
}
