import type { Metadata } from "next";
import { SiteFrame, SITE_BASE_PATH } from "@/components/layout/SiteFrame";
import { NotFoundTemplate } from "@/components/templates/NotFoundTemplate";

export const metadata: Metadata = { title: "Page not found" };

/** Addresses that match no route at all. Next.js renders this outside the /direction-a layout, so it brings its own frame. */
export default function NotFound() {
  return (
    <SiteFrame>
      <NotFoundTemplate basePath={SITE_BASE_PATH} />
    </SiteFrame>
  );
}
