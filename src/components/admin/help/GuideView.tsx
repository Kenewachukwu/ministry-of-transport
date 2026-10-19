import Link from "next/link";
import { ArrowRight, Clock, Lightbulb } from "lucide-react";
import { HELP_AREAS, getGuide, type HelpGuide } from "@/lib/admin/help";
import { Rich } from "./Rich";

const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" });

/**
 * One guide: numbered steps first (what the person came for), then tips, then
 * answers to common problems. `compact` drops the page-level extras for the
 * printable quick-reference sheet.
 */
export function GuideView({ guide, compact = false, headingLevel = 1 }: { guide: HelpGuide; compact?: boolean; headingLevel?: 1 | 2 }) {
  const Heading = headingLevel === 1 ? "h1" : "h2";
  const related = (guide.related ?? []).map((slug) => getGuide(slug)).filter((g): g is HelpGuide => Boolean(g));

  return (
    <article className="break-inside-avoid-page">
      <header className={compact ? "mb-4" : "mb-8"}>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cta">{HELP_AREAS[guide.area].title}</p>
        <Heading className={compact ? "mt-1 font-display text-xl font-semibold text-ink" : "mt-2 font-display text-2xl font-semibold text-ink sm:text-3xl"}>{guide.title}</Heading>
        <p className="mt-2 max-w-2xl text-sm text-ink-muted">{guide.summary}</p>
        {guide.time && (
          <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-ink-muted">
            <Clock size={13} aria-hidden /> Takes about {guide.time}
          </p>
        )}
      </header>

      {guide.steps.length > 0 && (
        <ol className="flex flex-col gap-4">
          {guide.steps.map((step, i) => (
            <li key={i} className="flex gap-4 break-inside-avoid">
              <span aria-hidden className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cta text-sm font-semibold text-cta-ink print:border print:border-ink print:bg-transparent print:text-ink">
                {i + 1}
              </span>
              <div className="min-w-0 pt-0.5">
                <p className="text-base leading-relaxed text-ink">
                  <span className="sr-only">Step {i + 1}: </span>
                  <Rich text={step.text} />
                </p>
                {step.detail && (
                  <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                    <Rich text={step.detail} />
                  </p>
                )}
                {step.link && !compact && (
                  <Link href={step.link.href} className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-cta hover:underline focus-visible:underline print:hidden">
                    {step.link.label} <ArrowRight size={14} aria-hidden />
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ol>
      )}

      {guide.tips && guide.tips.length > 0 && (
        <aside className="mt-8 rounded-card border border-brand-200 bg-brand-50 p-5 break-inside-avoid">
          <h2 className="flex items-center gap-2 font-display text-base font-semibold text-brand-900">
            <Lightbulb size={16} aria-hidden /> Good to know
          </h2>
          <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 text-sm leading-relaxed text-brand-900">
            {guide.tips.map((tip, i) => (
              <li key={i}>
                <Rich text={tip} />
              </li>
            ))}
          </ul>
        </aside>
      )}

      {guide.problems && guide.problems.length > 0 && (
        <section className="mt-8">
          <h2 className="font-display text-lg font-semibold text-ink">{guide.steps.length === 0 ? "Problems and answers" : "If something goes wrong"}</h2>
          {compact ? (
            // Printed sheets cannot expand a collapsed answer, so show every answer.
            <dl className="mt-3 flex flex-col gap-3">
              {guide.problems.map((p, i) => (
                <div key={i} className="break-inside-avoid">
                  <dt className="text-sm font-semibold text-ink">
                    <Rich text={p.q} />
                  </dt>
                  <dd className="mt-0.5 text-sm leading-relaxed text-ink-muted">
                    <Rich text={p.a} />
                  </dd>
                </div>
              ))}
            </dl>
          ) : (
            <div className="mt-3 divide-y divide-border rounded-card border border-border bg-surface-raised">
              {guide.problems.map((p, i) => (
                <details key={i} className="group p-4">
                  <summary className="cursor-pointer list-none text-sm font-semibold text-ink marker:content-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta">
                    <Rich text={p.q} />
                  </summary>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                    <Rich text={p.a} />
                  </p>
                </details>
              ))}
            </div>
          )}
        </section>
      )}

      {!compact && related.length > 0 && (
        <nav aria-label="Related guides" className="mt-10 print:hidden">
          <h2 className="font-display text-base font-semibold text-ink">Related guides</h2>
          <ul className="mt-2 flex flex-col gap-1.5">
            {related.map((r) => (
              <li key={r.slug}>
                <Link href={`/admin/help/${r.slug}`} className="text-sm font-semibold text-cta hover:underline focus-visible:underline">
                  {r.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {!compact && <p className="mt-10 text-xs text-ink-muted">Last checked {dateFormat.format(new Date(guide.reviewed))}. If something here does not match what you see, tell a super administrator.</p>}
    </article>
  );
}
