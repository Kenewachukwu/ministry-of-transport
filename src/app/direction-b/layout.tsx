import { ThemeProvider } from "@/design-system/themes/ThemeProvider";
import { SkipToContent } from "@/design-system/primitives/SkipToContent";
import { HeaderB } from "@/components/layout/Header/HeaderB";
import { Footer } from "@/components/layout/Footer/Footer";
import { PageTransition } from "@/design-system/motion/PageTransition";

const basePath = "/direction-b";

export default function DirectionBLayout({ children }: LayoutProps<"/direction-b">) {
  return (
    <ThemeProvider direction="b">
      <SkipToContent />
      <HeaderB basePath={basePath} />
      <main id="main-content" className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer basePath={basePath} />
    </ThemeProvider>
  );
}
