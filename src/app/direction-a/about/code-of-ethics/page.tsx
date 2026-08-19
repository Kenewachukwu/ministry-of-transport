import type { Metadata } from "next";
import { StaticContentTemplate } from "@/components/templates/StaticContentTemplate";
import { InlineLink } from "@/design-system/primitives/Link";

export const metadata: Metadata = { title: "Code of Ethics" };

export default function Page() {
  return (
    <StaticContentTemplate eyebrow="About Us" title="Code of Ethics">
      <p>
        The Federal Ministry of Transportation is committed to the highest standards of
        integrity, transparency, and accountability in the conduct of its staff and officials.
      </p>
      <p>
        The full Code of Conduct and Ethics document, including the Anti-Corruption and
        Transparency Unit (ACTU) guidelines, is available for download below.
      </p>
      <p>
        <InlineLink href="#" external chevron>
          Read and download the FMT Code of Conduct &amp; Ethics
        </InlineLink>
      </p>
    </StaticContentTemplate>
  );
}
