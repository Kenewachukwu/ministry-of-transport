import Link from "next/link";
import { Container } from "@/design-system/primitives/Container";
import { PageHeader } from "./PageHeader";
import { navConfig, portalNav } from "@/content/nav.config";
import { complianceLinks } from "@/content/footerLinks";

export function SitemapTemplate({ basePath }: { basePath: string }) {
  return (
    <>
      <PageHeader eyebrow="Reference" title="Sitemap" description="Every page on this site, in one place." />
      <section className="py-16">
        <Container>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {navConfig.map((item) => (
              <div key={item.label}>
                <p className="font-display font-semibold text-ink">{item.label}</p>
                <ul className="mt-3 flex flex-col gap-2">
                  {(item.children ?? [item]).map((child) => (
                    <li key={child.href}>
                      {child.external ? (
                        <a href={child.href} target="_blank" rel="noopener noreferrer" className="text-sm text-ink-muted hover:text-cta">
                          {child.label}
                        </a>
                      ) : (
                        <Link href={`${basePath}${child.href}`} className="text-sm text-ink-muted hover:text-cta">
                          {child.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <p className="font-display font-semibold text-ink">More</p>
              <ul className="mt-3 flex flex-col gap-2">
                <li>
                  <Link href={`${basePath}${portalNav.href}`} className="text-sm text-ink-muted hover:text-cta">
                    {portalNav.label}
                  </Link>
                </li>
                {complianceLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={`${basePath}${link.href}`} className="text-sm text-ink-muted hover:text-cta">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
