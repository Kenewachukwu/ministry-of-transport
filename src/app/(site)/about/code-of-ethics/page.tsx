import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { StaticContentTemplate } from "@/components/templates/StaticContentTemplate";
import { InlineLink } from "@/design-system/primitives/Link";
import { getSiteMeta } from "@/lib/cms";

export const metadata: Metadata = pageMetadata("Code of Ethics", "The code of ethics that guides the conduct of staff of the Federal Ministry of Transportation.", "/about/code-of-ethics");

export default async function Page() {
  const siteMeta = await getSiteMeta();
  return (
    <StaticContentTemplate eyebrow="About Us" title="Code of Ethics">
      <p>
        The Federal Ministry of Transportation is committed to the highest standards of
        integrity, transparency, and accountability in the conduct of its staff and officials.
      </p>
      <p>
        The full Code of Conduct and Ethics document, including the Anti-Corruption and
        Transparency Unit (ACTU) guidelines, is not yet available to download from this website.
      </p>
      <p>
        <InlineLink href={`mailto:${siteMeta.email}?subject=${encodeURIComponent("Request for the Code of Conduct and Ethics")}`} chevron>
          Request a copy by email
        </InlineLink>
      </p>
    </StaticContentTemplate>
  );
}
