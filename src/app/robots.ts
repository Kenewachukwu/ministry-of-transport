import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/env";

/**
 * Search engines may index the public site, never the admin or the API. A preview
 * deployment (or anything with ROBOTS_DISALLOW_ALL=1) asks to be left out entirely,
 * so the Ministry's draft site is never indexed beside the real one.
 */
export default function robots(): MetadataRoute.Robots {
  const vercelEnv = process.env.VERCEL_ENV;
  const hidden = process.env.ROBOTS_DISALLOW_ALL === "1" || (vercelEnv !== undefined && vercelEnv !== "production");
  if (hidden) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] },
    sitemap: `${siteUrl()}/sitemap.xml`,
    host: siteUrl(),
  };
}
