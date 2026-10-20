import type { ReactNode } from "react";
import { ThemeProvider } from "@/design-system/themes/ThemeProvider";
import { HeroModeProvider } from "@/design-system/themes/HeroModeContext";
import { SkipToContent } from "@/design-system/primitives/SkipToContent";
import { HeaderA } from "@/components/layout/Header/HeaderA";
import { Footer } from "@/components/layout/Footer/Footer";
import { PageTransition } from "@/design-system/motion/PageTransition";

import { SITE_BASE_PATH } from "@/lib/seo";

export { SITE_BASE_PATH };

/**
 * The public site's header, footer and themed page area. Shared by the
 * site layout and by the root "page not found" screen, which Next.js
 * renders outside that layout when a URL matches no route at all.
 */
export function SiteFrame({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider direction="a">
      <HeroModeProvider>
        <SkipToContent />
        <HeaderA basePath={SITE_BASE_PATH} />
        <main id="main-content" className="flex-1 pt-20 lg:pt-28">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer basePath={SITE_BASE_PATH} />
      </HeroModeProvider>
    </ThemeProvider>
  );
}
