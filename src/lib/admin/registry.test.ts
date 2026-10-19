import { describe, expect, it } from "vitest";
import { getEntity } from "./registry";

const hero = getEntity("hero")!;
const resources = getEntity("resources")!;
const eServices = getEntity("e-services")!;

const validHero = {
  eyebrow: "Our Vision",
  headline: "A secure transport system",
  body: "Building connections.",
  ctaLabel: "Learn more",
  ctaHref: "/about",
  imageUrl: "/images/stock/hero-lagos-highway.jpg",
  imageAlt: "A highway",
};

describe("links in the editors", () => {
  it("a hero button must go somewhere: '#' is refused, a site path and an https link are fine", () => {
    expect(hero.schema.safeParse({ ...validHero, ctaHref: "#" }).success).toBe(false);
    expect(hero.schema.safeParse({ ...validHero, ctaHref: "/about" }).success).toBe(true);
    expect(hero.schema.safeParse({ ...validHero, ctaHref: "https://example.gov.ng/page" }).success).toBe(true);
  });

  it("an e-service link must be real", () => {
    const base = { name: "Ports", description: "Port tariffs." };
    expect(eServices.schema.safeParse({ ...base, href: "#" }).success).toBe(false);
    expect(eServices.schema.safeParse({ ...base, href: "https://ports.example.gov.ng" }).success).toBe(true);
  });

  it("javascript: and protocol-relative links are still refused", () => {
    expect(hero.schema.safeParse({ ...validHero, ctaHref: "javascript:alert(1)" }).success).toBe(false);
    expect(hero.schema.safeParse({ ...validHero, ctaHref: "//evil.example" }).success).toBe(false);
  });
});

describe("a news item's gallery", () => {
  const news = getEntity("news")!;
  const base = { kind: "photo_news", title: "Site visit", itemDate: "2026-10-18", isPressRelease: false, location: "", excerpt: "A visit.", body: "", imageUrl: "", imageAlt: "", featured: false };
  const photo = { src: "/images/news/a.jpg", alt: "Engineers at a bridge", caption: "" };

  it("accepts a list of described pictures and drops an empty caption", () => {
    const parsed = news.schema.parse({ ...base, gallery: [photo, { ...photo, src: "/uploads/b.jpg", caption: "At the pier" }] });
    expect(parsed.gallery).toEqual([
      { src: "/images/news/a.jpg", alt: "Engineers at a bridge", caption: undefined },
      { src: "/uploads/b.jpg", alt: "Engineers at a bridge", caption: "At the pier" },
    ]);
  });

  it("accepts no gallery at all", () => {
    expect(news.schema.safeParse({ ...base, gallery: [] }).success).toBe(true);
  });

  it("refuses a picture with no description, no picture, or a picture from somewhere unapproved", () => {
    expect(news.schema.safeParse({ ...base, gallery: [{ ...photo, alt: "" }] }).success).toBe(false);
    expect(news.schema.safeParse({ ...base, gallery: [{ ...photo, src: "" }] }).success).toBe(false);
    expect(news.schema.safeParse({ ...base, gallery: [{ ...photo, src: "https://evil.example/x.jpg" }] }).success).toBe(false);
  });

  it("allows at most 24 pictures", () => {
    expect(news.schema.safeParse({ ...base, gallery: Array.from({ length: 24 }, () => photo) }).success).toBe(true);
    expect(news.schema.safeParse({ ...base, gallery: Array.from({ length: 25 }, () => photo) }).success).toBe(false);
  });

  it("an event never keeps a gallery", () => {
    const row = news.toRow!({ ...base, kind: "event", gallery: [photo] }) as { gallery: unknown[] };
    expect(row.gallery).toEqual([]);
  });
});

describe("documents with no file yet", () => {
  const base = { kind: "document", title: "Finance Act", category: "Finance & Budget" };

  it("an empty file field is accepted and stored as '#', which the website shows as 'Available on request'", () => {
    const parsed = resources.schema.parse({ ...base, href: "" });
    expect(parsed.href).toBe("#");
  });

  it("a real file link is kept as it is", () => {
    const parsed = resources.schema.parse({ ...base, href: "https://x.public.blob.vercel-storage.com/a.pdf" });
    expect(parsed.href).toBe("https://x.public.blob.vercel-storage.com/a.pdf");
  });

  it("the stored '#' is shown as an empty field when the document is edited", () => {
    expect(resources.fromRow!({ href: "#", title: "x" }).href).toBe("");
    expect(resources.fromRow!({ href: "https://a.example/b.pdf", title: "x" }).href).toBe("https://a.example/b.pdf");
  });

  it("typing '#' by hand is refused", () => {
    expect(resources.schema.safeParse({ ...base, href: "#" }).success).toBe(false);
  });
});
