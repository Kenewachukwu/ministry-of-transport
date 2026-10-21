import { ArrowUpRight, FileText, Landmark, PencilLine } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "@/design-system/primitives/Container";
import { Heading } from "@/design-system/primitives/Heading";
import { PageHeader } from "./PageHeader";
import { ECMS_URL } from "@/content/nav.config";

/** Same address as the "IPPIS Self-Service" link on the FCSSIP 25 page. */
const IPPIS_URL = "https://servicesoft.ippis.gov.ng/softsuite/";

const staffLinkClasses =
  "group flex h-full flex-col rounded-card border border-border bg-surface-raised p-6 shadow-card transition-all duration-200 hover:-translate-y-1 hover:border-cta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta motion-reduce:hover:translate-y-0";
const staffTitleClasses =
  "mt-4 flex items-center gap-2 font-display text-lg font-semibold text-ink group-hover:text-cta";

function StaffLink({ href, icon, title, children }: { href: string; icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={staffLinkClasses}>
      <span className="text-cta" aria-hidden>
        {icon}
      </span>
      <span className={staffTitleClasses}>
        {title}
        <ArrowUpRight size={16} aria-hidden />
        <span className="sr-only">(opens in a new tab)</span>
      </span>
      <span className="mt-2 text-sm text-ink-muted">{children}</span>
    </a>
  );
}

/** A page on this website itself (the admin), so it opens in the same tab. */
function SiteLink({ href, icon, title, children }: { href: string; icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <Link href={href} prefetch={false} className={staffLinkClasses}>
      <span className="text-cta" aria-hidden>
        {icon}
      </span>
      <span className={staffTitleClasses}>{title}</span>
      <span className="mt-2 text-sm text-ink-muted">{children}</span>
    </Link>
  );
}

/**
 * The Staff Portal is a short list of the systems Ministry staff use, not a
 * sign-in. An earlier version showed a sign-in form that did nothing and then
 * said "Signed in successfully", which is not acceptable on a government site.
 * More staff services (for example the Performance Management System) are
 * added here when they go live.
 */
export function StaffPortalTemplate() {
  return (
    <>
      <PageHeader eyebrow="Ministry staff" title="Staff Portal" description="Links to the systems Ministry staff use." />
      <section className="py-16">
        <Container>
          <ul className="grid gap-6 sm:grid-cols-2">
            <li>
              <StaffLink href={ECMS_URL} icon={<FileText size={26} />} title="Ext. Corres.">
                The Ministry&rsquo;s electronic correspondence system for official letters and submissions.
              </StaffLink>
            </li>
            <li>
              <StaffLink href={IPPIS_URL} icon={<Landmark size={26} />} title="IPPIS Self-Service">
                The Federal Government&rsquo;s Integrated Payroll and Personnel Information System.
              </StaffLink>
            </li>
            <li>
              <SiteLink href="/admin" icon={<PencilLine size={26} />} title="Website Admin">
                For authorised editors to update the news, departments, leadership and other content on this website.
              </SiteLink>
            </li>
          </ul>
          <div className="mt-10 max-w-2xl rounded-card border border-border bg-surface p-6">
            <Heading as="h2" size="h4">
              Signing in
            </Heading>
            <p className="mt-2 text-ink-muted">
              You sign in on each system&rsquo;s own page. Website Admin accounts are given by invitation to authorised
              editors only; the other systems keep their own accounts. More staff services will be linked here as they
              become available.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
