import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { StaticContentTemplate } from "@/components/templates/StaticContentTemplate";
import { getSiteMeta } from "@/lib/cms";

export const metadata: Metadata = pageMetadata("Privacy Policy", "How the Federal Ministry of Transportation handles personal information on this website.", "/privacy-policy");

export default async function Page() {
  const siteMeta = await getSiteMeta();
  return (
    <StaticContentTemplate eyebrow="Legal" title="Privacy Policy">
      <p>
        The Federal Ministry of Transportation is committed to protecting the privacy of
        visitors to this website. This page will set out what information we collect, how it
        is used, and how it is protected, in line with the Nigeria Data Protection Act.
      </p>
      <h2>Information we collect</h2>
      <p>Emails you send to us, and standard web server logs (IP address, browser type, pages visited).</p>
      <h2>Contact</h2>
      <p>Questions about this policy can be directed to {siteMeta.email}.</p>
    </StaticContentTemplate>
  );
}
