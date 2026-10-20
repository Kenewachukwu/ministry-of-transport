import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { StaticContentTemplate } from "@/components/templates/StaticContentTemplate";
import { InlineLink } from "@/design-system/primitives/Link";
import { getSiteMeta } from "@/lib/cms";

export const metadata: Metadata = pageMetadata("Accessibility Statement", "How this website supports people with disabilities, and how to report a problem.", "/accessibility-statement");

/**
 * Keep this statement true. It names the target (WCAG 2.1 AA), what the site does
 * today, and what is known to fall short. Update the date and the limitations
 * list after every accessibility review, and only claim conformance once an
 * audit supports it.
 */
export default async function Page() {
  const siteMeta = await getSiteMeta();
  return (
    <StaticContentTemplate eyebrow="Legal" title="Accessibility Statement">
      <p>
        The Federal Ministry of Transportation wants everyone, including people with disabilities, to be able to use
        this website. Our target is the Web Content Accessibility Guidelines (WCAG) 2.1, level AA.
      </p>
      <p>
        This website has not yet been independently audited against that standard, so we do not claim that it fully
        meets it. This statement was last reviewed on 20 October 2026.
      </p>
      <h2>What the site does today</h2>
      <ul>
        <li>The site is designed to be used with a keyboard, and a &ldquo;skip to content&rdquo; link is provided.</li>
        <li>Keyboard focus is visible.</li>
        <li>Moving content respects the &ldquo;reduce motion&rdquo; setting on your device. The home page carousel can be paused.</li>
        <li>Pages are built to work on phones, tablets and computers.</li>
        <li>
          In October 2026 every public page was checked with an automated accessibility tool (axe-core), covering colour
          contrast, headings, labels and page structure, and the failures it found were fixed. Automated tools find only
          part of the problems that real people meet, so this is not a guarantee.
        </li>
        <li>The news tabs on the home page work with the arrow keys, and the news filters tell screen readers which one is selected.</li>
      </ul>
      <h2>Known limitations</h2>
      <ul>
        <li>Some news images, such as flyers that contain text, do not yet have a text description.</li>
        <li>Documents offered for download may not be accessible. Ask us for another format if you need one.</li>
        <li>The site has not yet been tested by people who use screen readers or other assistive technology.</li>
      </ul>
      <h2>Tell us about a problem</h2>
      <p>
        If something on this site is hard or impossible for you to use, please email{" "}
        <InlineLink href={`mailto:${siteMeta.email}?subject=${encodeURIComponent("Website accessibility")}`}>
          {siteMeta.email}
        </InlineLink>{" "}
        with the address of the page and a short description of the problem. We will work to fix it.
      </p>
    </StaticContentTemplate>
  );
}
