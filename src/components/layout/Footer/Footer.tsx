import Link from "next/link";
import { footerColumns } from "@/content/footerLinks";
import { eServices } from "@/content/eServices";
import { agencies } from "@/content/agencies";
import { siteMeta } from "@/content/siteMeta";
import { Container } from "@/design-system/primitives/Container";
import { SocialLinks } from "./SocialLinks";
import { VisitCounter } from "./VisitCounter";
import { ComplianceBar } from "./ComplianceBar";

export function Footer({ basePath }: { basePath: string }) {
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
              {" · "}
              <a href={`tel:${siteMeta.phone}`} className="hover:text-white">
                {siteMeta.phone}
              </a>
            </p>
            <SocialLinks className="mt-6 flex gap-3" />
          </div>

          {footerColumns.map((col) => (
            <div key={col.heading}>
              <p className="text-sm font-semibold uppercase tracking-[0.1em] text-white/50">{col.heading}</p>
              <ul className="mt-4 flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={`${basePath}${link.href}`} className="text-sm text-white/75 hover:text-white">
                      {link.label}
                    </Link>
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
                  <a href={agency.href} target="_blank" rel="noopener noreferrer" className="text-sm text-white/75 hover:text-white">
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
            {eServices.map((service) => (
              <li key={service.id}>
                <a href={service.href} target="_blank" rel="noopener noreferrer" className="text-sm text-white/70 hover:text-white">
                  {service.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <Container className="flex flex-wrap items-center justify-between gap-4 py-2">
        <VisitCounter />
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
