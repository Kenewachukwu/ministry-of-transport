import { ThemeProvider } from "@/design-system/themes/ThemeProvider";
import { HeroModeProvider } from "@/design-system/themes/HeroModeContext";
import { SkipToContent } from "@/design-system/primitives/SkipToContent";
import { HeaderA } from "@/components/layout/Header/HeaderA";
import { Footer } from "@/components/layout/Footer/Footer";
import { PageTransition } from "@/design-system/motion/PageTransition";

const basePath = "/direction-a";

export default function DirectionALayout({ children }: LayoutProps<"/direction-a">) {
  return (
    <ThemeProvider direction="a">
      <HeroModeProvider>
        <SkipToContent />
        <HeaderA basePath={basePath} />
        <main id="main-content" className="flex-1 pt-20 lg:pt-28">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer basePath={basePath} />
      </HeroModeProvider>
    </ThemeProvider>
  );
}
