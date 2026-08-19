import { Container } from "@/design-system/primitives/Container";
import { PageHeader } from "./PageHeader";
import { getDepartments, getLeadership } from "@/lib/cms";

/**
 * The live site's organogram is a single flat image with no alt text —
 * replaced here with an accessible, data-driven hierarchy.
 */
export function StructureTemplate() {
  const departments = getDepartments();
  const people = getLeadership();
  const minister = people.find((p) => p.role === "minister");
  const permSec = people.find((p) => p.role === "permanent-secretary");

  return (
    <>
      <PageHeader
        eyebrow="About Us"
        title="Organisational Structure"
        description="How the Ministry is organised, from the Minister down to individual departments."
      />
      <section className="py-16">
        <Container size="narrow">
          <ol className="flex flex-col items-center gap-4">
            <li className="rounded-control bg-cta px-6 py-3 text-center font-semibold text-cta-ink">
              {minister?.title ?? "Honourable Minister of Transportation"}
            </li>
            <li className="h-6 w-px bg-border" aria-hidden />
            <li className="rounded-control border border-border bg-surface-raised px-6 py-3 text-center font-semibold text-ink shadow-card">
              {permSec?.title ?? "Permanent Secretary"}
            </li>
            <li className="h-6 w-px bg-border" aria-hidden />
          </ol>
          <ul className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {departments.map((dept) => (
              <li
                key={dept.id}
                className="rounded-card border border-border bg-surface-raised px-4 py-3 text-center text-sm font-medium text-ink shadow-card"
              >
                {dept.name}
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
