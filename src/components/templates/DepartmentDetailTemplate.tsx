import Image from "next/image";
import Link from "next/link";
import { Container } from "@/design-system/primitives/Container";
import { Heading } from "@/design-system/primitives/Heading";
import { InlineLink } from "@/design-system/primitives/Link";
import { PageHeader } from "./PageHeader";
import { cn } from "@/lib/utils";
import type { Department } from "@/content/types";

/** Lists of duties read best numbered; structure/divisions as plain bullets. */
function isNumbered(heading: string) {
  return /^(functions|mandate|responsibilities)/i.test(heading);
}

/**
 * One department's page: banner picture, introduction, then its structure and
 * functions (or mandate) as supplied by the Ministry — plus a side list of all
 * departments so staff and visitors can move between them.
 */
export function DepartmentDetailTemplate({
  department,
  departments,
  basePath,
}: {
  department: Department;
  departments: Department[];
  basePath: string;
}) {
  const intro = department.description.length ? department.description : [department.summary];

  return (
    <>
      <PageHeader eyebrow="Departments" title={department.name}>
        <div className="mt-6">
          <InlineLink href={`${basePath}/about/departments`} className="text-white/80 hover:text-white focus-visible:text-white">
            ← All departments
          </InlineLink>
        </div>
      </PageHeader>

      <section className="py-14">
        <Container className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_280px]">
          <article>
            {department.photoUrl && (
              <div className="relative aspect-[21/9] overflow-hidden rounded-card border border-border bg-brand-50 shadow-card">
                <Image
                  src={department.photoUrl}
                  alt=""
                  fill
                  priority
                  sizes="(min-width: 1024px) 800px, 100vw"
                  className="object-cover"
                />
              </div>
            )}

            <div className={cn("flex max-w-3xl flex-col gap-5 text-lg leading-relaxed text-ink", department.photoUrl && "mt-10")}>
              {intro.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            {department.sections.map((section) => {
              const List = isNumbered(section.heading) ? "ol" : "ul";
              return (
                <div key={section.heading} className="mt-12 max-w-3xl">
                  <Heading as="h2" size="h3">
                    {section.heading}
                  </Heading>
                  {section.note && <p className="mt-3 text-ink-muted">{section.note}</p>}
                  <List
                    className={cn(
                      "mt-4 flex flex-col gap-3 pl-6 text-ink marker:font-semibold marker:text-cta",
                      List === "ol" ? "list-decimal" : "list-disc"
                    )}
                  >
                    {section.items.map((item, i) => (
                      <li key={i} className="pl-1 leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </List>
                </div>
              );
            })}
          </article>

          <aside aria-label="All departments">
            <div className="rounded-card border border-border bg-surface-raised p-5 shadow-card lg:sticky lg:top-36">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cta">Departments</p>
              <ul className="mt-3 flex flex-col">
                {departments.map((d) => {
                  const current = d.id === department.id;
                  return (
                    <li key={d.id}>
                      <Link
                        href={`${basePath}/about/departments/${d.id}`}
                        aria-current={current ? "page" : undefined}
                        className={cn(
                          "block rounded-md px-3 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta",
                          current
                            ? "bg-brand-50 font-semibold text-cta"
                            : "text-ink-muted hover:bg-surface hover:text-cta focus-visible:text-cta"
                        )}
                      >
                        {d.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>
        </Container>
      </section>
    </>
  );
}
