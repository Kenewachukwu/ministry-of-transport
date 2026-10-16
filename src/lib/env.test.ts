import { describe, expect, it } from "vitest";
import { contentSource, siteUrl } from "./env";

const env = (vars: Record<string, string>) => vars as unknown as NodeJS.ProcessEnv;

describe("contentSource", () => {
  it("is static with no configuration (a deployment with no database behaves as before)", () => {
    expect(contentSource(env({}))).toBe("static");
  });
  it("uses postgres when DATABASE_URL is set", () => {
    expect(contentSource(env({ DATABASE_URL: "postgres://x" }))).toBe("postgres");
  });
  it("uses the embedded database only when opted in", () => {
    expect(contentSource(env({ NODE_ENV: "development" }))).toBe("static");
    expect(contentSource(env({ LOCAL_DB: "pglite" }))).toBe("pglite");
  });
  it("never opens the embedded database during `next build`", () => {
    expect(contentSource(env({ LOCAL_DB: "pglite", NEXT_PHASE: "phase-production-build" }))).toBe("static");
  });
  it("prefers a real database over the embedded one", () => {
    expect(contentSource(env({ DATABASE_URL: "postgres://x", LOCAL_DB: "pglite" }))).toBe("postgres");
  });
  it("honours an explicit override", () => {
    expect(contentSource(env({ DATABASE_URL: "postgres://x", CONTENT_SOURCE: "static" }))).toBe("static");
  });
});

describe("siteUrl", () => {
  it("prefers SITE_URL, trims trailing slashes", () => {
    expect(siteUrl(env({ SITE_URL: "https://transportation.gov.ng/" }))).toBe("https://transportation.gov.ng");
  });
  it("falls back to the Vercel production URL, then localhost", () => {
    expect(siteUrl(env({ VERCEL_PROJECT_PRODUCTION_URL: "mot.vercel.app" }))).toBe("https://mot.vercel.app");
    expect(siteUrl(env({}))).toBe("http://localhost:3000");
  });
});
