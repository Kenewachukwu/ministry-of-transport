import type { Metadata } from "next";
import Image from "next/image";
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
      <figure className="overflow-hidden rounded-card border border-border bg-surface-raised shadow-card">
        <Image
          src="/images/sourced/fcssip-25-plan.png"
          alt="The New Civil Service — Federal Civil Service Strategy and Implementation Plan 2021–2025"
          width={740}
          height={524}
          className="h-auto w-full"
        />
        <figcaption className="border-t border-border px-5 py-3 text-sm text-ink-muted">
          Federal Civil Service Strategy and Implementation Plan, 2021&ndash;2025.
        </figcaption>
      </figure>
      <ul>
        <li>
          <InlineLink href="https://ohcsf.gov.ng/downloads/" external chevron>
            FCSSIP 2021&ndash;2025 in the OHCSF downloads library
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
