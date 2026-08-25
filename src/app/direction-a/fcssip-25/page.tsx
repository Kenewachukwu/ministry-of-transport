import type { Metadata } from "next";
import Image from "next/image";
import { StaticContentTemplate } from "@/components/templates/StaticContentTemplate";
import { InlineLink } from "@/design-system/primitives/Link";

export const metadata: Metadata = { title: "FCSSIP 25" };

const resources = [
  {
    label: "View and download FCSSIP 2021–2025",
    href: "https://drive.google.com/file/d/1cyxIvt0FBgsyDX5YtbFgUdYczm62bnJn/view?usp=share_link",
  },
  {
    label: "IPPIS Self-Service",
    href: "https://service.ippis.gov.ng:4443/",
  },
  {
    label: "The Federal Civil Service Culture Change video",
    href: "https://youtu.be/siRjPvkX2PQ",
  },
  {
    label: "PEBEC ReportGov Portal",
    href: "https://www.pebec.gov.ng/reportgov-ng",
  },
  {
    label: "GovMail Portal",
    href: "https://webmail.transportation.gov.ng/",
  },
  {
    label: "eCMS Portal",
    href: "https://federalministryoftransportation-ecms.schulltech.com/",
  },
];

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
        the transport sector. It sits alongside the Federal Civil Service Culture Change
        programme and the Presidential Enabling Business Environment Council&rsquo;s (PEBEC)
        ReportGov initiative as part of a wider push to modernise how the civil service
        operates and serves the public.
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
      <h2>Staff resources &amp; portals</h2>
      <ul>
        {resources.map((r) => (
          <li key={r.href}>
            <InlineLink href={r.href} external chevron>
              {r.label}
            </InlineLink>
          </li>
        ))}
      </ul>

      <h2>FCSSIP 25 at a glance</h2>
      <p>
        The plan&rsquo;s vision, mission, and six pillars — Capability Building &amp; Talent,
        Performance Management, IPPIS-Human Resource, Innovation, Digitalisation &amp; Content
        Services, and Staff Welfare — sit on the enablers and core values below.
      </p>
      <figure className="mx-auto max-w-xl overflow-hidden rounded-card border border-border bg-surface-raised shadow-card">
        <Image
          src="/images/sourced/fcssip-pillars.jpg"
          alt="FCSSIP 25 vision, mission, pillars, enablers, and core values overview"
          width={895}
          height={497}
          className="h-auto w-full"
        />
      </figure>
    </StaticContentTemplate>
  );
}
