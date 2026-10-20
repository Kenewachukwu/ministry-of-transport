import { readdirSync, statSync } from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { siteMeta } from "@/content/siteMeta";
import { news } from "@/content/news";
import { absoluteUrl, homeMetadata, newsArticleJsonLd, organizationJsonLd, pageMetadata, pageUrl, SITE_BASE_PATH } from "./seo";

afterEach(() => vi.unstubAllEnvs());

describe("page metadata", () => {
  it("gives a page one address everywhere: canonical, social preview and sitemap agree", () => {
    vi.stubEnv("SITE_URL", "https://www.example.gov.ng");
    const m = pageMetadata("Contact Us", "How to reach us.", "/contact");
    expect(m.alternates?.canonical).toBe("https://www.example.gov.ng/direction-a/contact");
    expect(m.openGraph?.url).toBe("https://www.example.gov.ng/direction-a/contact");
    expect(m.openGraph?.title).toBe("Contact Us | Federal Ministry of Transportation");
    expect(m.description).toBe("How to reach us.");
  });

  it("makes picture links absolute, and leaves full links alone", () => {
    vi.stubEnv("SITE_URL", "https://www.example.gov.ng");
    expect(absoluteUrl("/images/a.jpg")).toBe("https://www.example.gov.ng/images/a.jpg");
    expect(absoluteUrl("https://cdn.example.com/a.jpg")).toBe("https://cdn.example.com/a.jpg");
  });

  it("does not repeat the site name in the home page title", () => {
    const m = homeMetadata("Official website.");
    expect(m.title).toEqual({ absolute: "Federal Ministry of Transportation | Nigeria" });
    expect(m.openGraph?.title).toBe("Federal Ministry of Transportation | Nigeria");
    expect(m.alternates?.canonical).toBe(pageUrl(""));
  });
});

describe("structured data", () => {
  it("describes the Ministry using only details that are really set", () => {
    const withPhone = organizationJsonLd({ ...siteMeta, phone: "+234 1 000 0000" });
    const without = organizationJsonLd({ ...siteMeta, phone: null, social: { x: "", instagram: "", facebook: "", youtube: "" } });
    expect(withPhone.telephone).toBe("+234 1 000 0000");
    expect("telephone" in without).toBe(false); // never a made-up number
    expect(without.sameAs).toEqual([]);
    expect(without["@type"]).toBe("GovernmentOrganization");
  });

  it("describes a news story with its date, picture and address", () => {
    vi.stubEnv("SITE_URL", "https://www.example.gov.ng");
    const item = news[0];
    const ld = newsArticleJsonLd(item);
    expect(ld["@type"]).toBe("NewsArticle");
    expect(ld.headline).toBe(item.title);
    expect(ld.datePublished).toBe(item.date);
    expect(ld.mainEntityOfPage).toBe(`https://www.example.gov.ng${SITE_BASE_PATH}/news/${item.slug}`);
    expect(ld.image[0]).toMatch(/^https:\/\/www\.example\.gov\.ng\//);
  });
});

describe("robots.txt", () => {
  it("lets search engines in, but never into the admin or the API", () => {
    vi.stubEnv("SITE_URL", "https://www.example.gov.ng");
    vi.stubEnv("VERCEL_ENV", "production");
    const r = robots();
    expect(r.rules).toMatchObject({ userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] });
    expect(r.sitemap).toBe("https://www.example.gov.ng/sitemap.xml");
  });

  it("asks to be left out entirely on a preview deployment", () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    expect(robots()).toEqual({ rules: { userAgent: "*", disallow: "/" } });
  });

  it("can be switched off by hand", () => {
    vi.stubEnv("ROBOTS_DISALLOW_ALL", "1");
    expect(robots()).toEqual({ rules: { userAgent: "*", disallow: "/" } });
  });
});

describe("sitemap.xml", () => {
  it("lists the home page, every news story, every department and every leader, once each", async () => {
    vi.stubEnv("SITE_URL", "https://www.example.gov.ng");
    const urls = (await sitemap()).map((e) => e.url);
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls).toContain("https://www.example.gov.ng/direction-a");
    for (const item of news) expect(urls).toContain(`https://www.example.gov.ng/direction-a/news/${item.slug}`);
    expect(urls.some((u) => u.includes("/about/departments/"))).toBe(true);
    expect(urls.some((u) => u.includes("/about/leadership/"))).toBe(true);
    expect(urls.every((u) => !u.includes("/admin"))).toBe(true);
  });
});

/** Every public page folder without a [parameter], found on disk. */
function staticPagePaths(dir: string, prefix = ""): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (!statSync(full).isDirectory() || name.startsWith("[")) continue;
    if (readdirSync(full).includes("page.tsx")) out.push(`${prefix}/${name}`);
    out.push(...staticPagePaths(full, `${prefix}/${name}`));
  }
  return out;
}

describe("sitemap coverage", () => {
  it("includes every static public page, so a new page cannot be left out unnoticed", async () => {
    vi.stubEnv("SITE_URL", "https://www.example.gov.ng");
    const urls = new Set((await sitemap()).map((e) => e.url));
    // Search results are for people, not search engines (the page is marked noindex), so it is not listed.
    const missing = staticPagePaths(path.resolve(import.meta.dirname, "../app/direction-a")).filter((p) => p !== "/search" && !urls.has(pageUrl(p)));
    expect(missing, "Add these pages to STATIC_PATHS in src/app/sitemap.ts").toEqual([]);
  });
});
