import type { Metadata } from "next";
import { StaticContentTemplate } from "@/components/templates/StaticContentTemplate";
import { siteMeta } from "@/content/siteMeta";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function Page() {
  return (
    <StaticContentTemplate eyebrow="Legal" title="Privacy Policy">
      <p>
        The Federal Ministry of Transportation is committed to protecting the privacy of
        visitors to this website. This page will set out what information we collect, how it
        is used, and how it is protected, in line with the Nigeria Data Protection Act.
      </p>
      <h2>Information we collect</h2>
      <p>Contact form submissions, and standard web server logs (IP address, browser type, pages visited).</p>
      <h2>Contact</h2>
      <p>Questions about this policy can be directed to {siteMeta.email}.</p>
    </StaticContentTemplate>
  );
}
