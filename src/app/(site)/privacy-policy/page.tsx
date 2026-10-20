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
      <h2>Messages sent through the contact form</h2>
      <p>
        If you use the contact form, we receive the name, email address, optional telephone number and message you type.
        They are stored in the Ministry&rsquo;s website system, emailed to the team that deals with your topic, and read
        only by staff who handle enquiries. We also keep a one-way scrambled form of your network address, which cannot
        be turned back into the address, only to stop floods of automated messages. We do not send marketing to the
        address you give. How long messages are kept is being confirmed by the Ministry and will be stated here.
      </p>
      <h2>Contact</h2>
      <p>Questions about this policy can be directed to {siteMeta.email}.</p>
    </StaticContentTemplate>
  );
}
