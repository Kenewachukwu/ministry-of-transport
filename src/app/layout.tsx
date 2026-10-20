import type { Metadata } from "next";
import { Public_Sans, Inter } from "next/font/google";
import { siteUrl } from "@/lib/env";
import "./globals.css";

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Lets relative links in page metadata (canonical, social previews) become full addresses.
  metadataBase: new URL(siteUrl()),
  title: {
    default: "Federal Ministry of Transportation | Nigeria",
    template: "%s | Federal Ministry of Transportation",
  },
  description:
    "Official website of the Federal Ministry of Transportation, Federal Republic of Nigeria.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${publicSans.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
