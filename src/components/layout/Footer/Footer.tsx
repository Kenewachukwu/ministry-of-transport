import Link from "next/link";
import { footerColumns } from "@/content/footerLinks";
import { getAgencies, getEServices, getSiteMeta } from "@/lib/cms";
import { Container } from "@/design-system/primitives/Container";
import { SocialLinks } from "./SocialLinks";
import { ComplianceBar } from "./ComplianceBar";

// Footer links: colour change + underline on hover and keyboard focus (the
// footer is dark, so focus uses a white ring).
const footerLinkClasses =
  "text-sm text-white/75 underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:text-white focus-visible:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

export async function Footer({ basePath }: { basePath: string }) {
  const [agencies, eServices, siteMeta] = await Promise.all([getAgencies(), getEServices(), getSiteMeta()]);
  return (
    <footer className="bg-surface-inverse text-white">
      <Container className="py-14">
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <p className="font-display text-lg font-semibold text-white">{siteMeta.name}</p>
            <p className="mt-1 text-sm text-white/60">{siteMeta.country}</p>
            <p className="mt-4 max-w-sm text-sm text-white/70">{siteMeta.address}</p>
            <p className="mt-2 text-sm text-white/70">{siteMeta.hours}</p>
            <p className="mt-2 text-sm text-white/70">
              <a href={`mailto:${siteMeta.email}`} className="hover:text-white">
                {siteMeta.email}
              </a>
              {siteMeta.phone && (
                <>
                  {" · "}
                  <a href={`tel:${siteMeta.phone}`} className="hover:text-white">
                    {siteMeta.phone}
                  </a>
                </>
              )}
            </p>
            <SocialLinks social={siteMeta.social} className="mt-6 flex gap-3" />
          </div>

          {footerColumns.map((col) => (
            <div key={col.heading}>
              <p className="text-sm font-semibold uppercase tracking-[0.1em] text-white/50">{col.heading}</p>
              <ul className="mt-4 flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    {link.external ? (
                      <a href={link.href} target="_blank" rel="noopener noreferrer" className={footerLinkClasses}>
                        {link.label}
                      </a>
                    ) : (
                      <Link href={`${basePath}${link.href}`} className={footerLinkClasses}>
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.1em] text-white/50">Agencies</p>
            <ul className="mt-4 flex flex-col gap-2.5">
              {agencies.map((agency) => (
                <li key={agency.id}>
                  <a href={agency.href} target="_blank" rel="noopener noreferrer" className={footerLinkClasses}>
                    {agency.shortName}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-8">
          <p className="text-sm font-semibold uppercase tracking-[0.1em] text-white/50">E-Services</p>
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            {eServices.map((service) => {
              // Some e-services point at pages on this site ("/e-services"); only
              // true external URLs open in a new tab and skip the basePath prefix.
              const isExternal = !service.href.startsWith("/");
              return (
                <li key={service.id}>
                  {isExternal ? (
                    <a href={service.href} target="_blank" rel="noopener noreferrer" className={footerLinkClasses}>
                      {service.name}
                    </a>
                  ) : (
                    <Link href={`${basePath}${service.href}`} className={footerLinkClasses}>
                      {service.name}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </Container>

      <Container className="py-2">
        <p className="text-xs text-white/40">
          © {new Date().getFullYear()} {siteMeta.name}. All rights reserved.
        </p>
      </Container>

      <Container>
        <ComplianceBar basePath={basePath} />
      </Container>
    </footer>
  );
}
