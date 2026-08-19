import type { Metadata } from "next";
import { StaticContentTemplate } from "@/components/templates/StaticContentTemplate";
import { InlineLink } from "@/design-system/primitives/Link";

export const metadata: Metadata = { title: "FCSSIP 25" };

export default function Page() {
  return (
    <StaticContentTemplate
      eyebrow="Federal Civil Service Strategy"
      title="FCSSIP 25"
      description="The Federal Civil Service Strategy Implementation Plan (2021–2025) and related staff resources."
    >
      <p>
        FCSSIP 25 sets out the Ministry&rsquo;s priorities for reforming service delivery,
        strengthening institutional capacity, and improving the ease of doing business across
        the transport sector.
      </p>
      <ul>
        <li>
          <InlineLink href="#" external chevron>
            View the FCSSIP 2021–2025 strategy document
          </InlineLink>
        </li>
        <li className="mt-2">
          <InlineLink href="https://www.pebec.gov.ng/reportgov-ng" external chevron>
            PEBEC ReportGov Portal
          </InlineLink>
        </li>
      </ul>
    </StaticContentTemplate>
  );
}
