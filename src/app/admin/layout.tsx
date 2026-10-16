import type { Metadata } from "next";
import { ThemeProvider } from "@/design-system/themes/ThemeProvider";

export const metadata: Metadata = {
  title: { default: "Website admin", template: "%s | Website admin" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <ThemeProvider direction="a">{children}</ThemeProvider>;
}
