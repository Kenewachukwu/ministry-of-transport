/** "Ministry Backs Road Safety!" → "ministry-backs-road-safety". Short, URL-safe, stable. */
export function slugify(input: string, maxLength = 80): string {
  const slug = input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, maxLength)
    .replace(/-+$/g, "");
  return slug || "item";
}

/** Appends -2, -3… until `exists` says the slug is free. */
export async function uniqueSlug(base: string, exists: (slug: string) => Promise<boolean>): Promise<string> {
  let candidate = base;
  for (let n = 2; await exists(candidate); n++) candidate = `${base}-${n}`;
  return candidate;
}
