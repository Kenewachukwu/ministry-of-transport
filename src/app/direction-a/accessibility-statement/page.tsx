import type { Metadata } from "next";
import { StaticContentTemplate } from "@/components/templates/StaticContentTemplate";
import { InlineLink } from "@/design-system/primitives/Link";
import { siteMeta } from "@/content/siteMeta";

export const metadata: Metadata = { title: "Accessibility Statement" };

/**
 * Keep this statement true. It names the target (WCAG 2.1 AA), what the site does
 * today, and what is known to fall short. Update the date and the limitations
 * list after every accessibility review, and only claim conformance once an
 * audit supports it.
 */
export default function Page() {
  return (
    <StaticContentTemplate eyebrow="Legal" title="Accessibility Statement">
      <p>
        The Federal Ministry of Transportation wants everyone, including people with disabilities, to be able to use
        this website. Our target is the Web Content Accessibility Guidelines (WCAG) 2.1, level AA.
      </p>
      <p>
        This website has not yet been independently audited against that standard, so we do not claim that it fully
        meets it. This statement was last reviewed in October 2026.
      </p>
      <h2>What the site does today</h2>
      <ul>
        <li>The site is designed to be used with a keyboard, and a &ldquo;skip to content&rdquo; link is provided.</li>
        <li>Keyboard focus is visible.</li>
        <li>Moving content respects the &ldquo;reduce motion&rdquo; setting on your device. The home page carousel can be paused.</li>
        <li>Pages are built to work on phones, tablets and computers.</li>
      </ul>
      <h2>Known limitations</h2>
      <ul>
        <li>Some news images, such as flyers that contain text, do not yet have a text description.</li>
        <li>Documents offered for download may not be accessible. Ask us for another format if you need one.</li>
        <li>Parts of the site, such as the news tabs, have not yet been tested with screen readers.</li>
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
