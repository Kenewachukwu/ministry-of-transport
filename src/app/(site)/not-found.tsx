import type { Metadata } from "next";
import { SITE_BASE_PATH } from "@/components/layout/SiteFrame";
import { NotFoundTemplate } from "@/components/templates/NotFoundTemplate";

export const metadata: Metadata = { title: "Page not found" };

/** `notFound()` inside the public site (an unknown or archived article, department, leader). Already inside the site layout. */
export default function NotFound() {
  return <NotFoundTemplate basePath={SITE_BASE_PATH} />;
}
