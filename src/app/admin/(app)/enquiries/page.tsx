import type { Metadata } from "next";
import Link from "next/link";
import { Settings } from "lucide-react";
import { HelpLink } from "@/components/admin/help/HelpLink";
import { PageTitle, Panel } from "@/components/admin/ui";
import { enquiryTopicLabel } from "@/content/enquiryTopics";
import { requireSectionPage } from "@/lib/auth/dal";
import { enquiryCounts, listEnquiries, type EnquiryListStatus } from "@/lib/dal/enquiries";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Enquiries" };

const whenFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
const TABS: { status: EnquiryListStatus; label: string }[] = [
  { status: "new", label: "New" },
  { status: "handled", label: "Handled" },
  { status: "spam", label: "Spam" },
];

export default async function EnquiriesPage({ searchParams }: { searchParams: Promise<{ status?: string; q?: string }> }) {
  const user = await requireSectionPage("enquiries");
  const sp = await searchParams;
  const status: EnquiryListStatus = sp.status === "handled" || sp.status === "spam" ? sp.status : "new";
  const q = sp.q?.trim().slice(0, 100) || undefined;
  const [rows, counts] = await Promise.all([listEnquiries(user, { status, q }), enquiryCounts(user)]);

  const href = (patch: { status?: string; q?: string | undefined }) => {
    const next = new URLSearchParams();
    const merged = { status: status === "new" ? undefined : status, q, ...patch };
    for (const [k, v] of Object.entries(merged)) if (v) next.set(k, v);
    const s = next.toString();
    return s ? `/admin/enquiries?${s}` : "/admin/enquiries";
  };

  return (
    <>
      <PageTitle
        title="Enquiries"
        description="Messages sent through the contact form on the website. Each one is also emailed to the right team; here you can see everything that arrived and mark what has been dealt with."
        actions={
          <>
            <HelpLink slug="handle-enquiries" />
            {user.role === "super_admin" && (
              <Link href="/admin/enquiries/settings" className="inline-flex items-center gap-1.5 rounded-control border border-border px-3 py-2 text-sm font-semibold text-ink hover:border-cta hover:text-cta">
                <Settings size={14} aria-hidden /> Where enquiries go
              </Link>
            )}
          </>
        }
      />

      <div className="mb-4 flex gap-1" role="tablist" aria-label="Show">
        {TABS.map((t) => (
          <Link
            key={t.status}
            href={href({ status: t.status === "new" ? undefined : t.status })}
            aria-current={status === t.status ? "page" : undefined}
            className={cn(
              "rounded-control px-3 py-1.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta",
              status === t.status ? "bg-brand-50 text-cta" : "text-ink-muted hover:bg-surface hover:text-cta"
            )}
          >
            {t.label} ({counts[t.status]})
          </Link>
        ))}
      </div>

      <form method="get" role="search" className="mb-4 flex flex-wrap items-center gap-2">
        {status !== "new" && <input type="hidden" name="status" value={status} />}
        <label htmlFor="enquiry-search" className="sr-only">
          Search enquiries
        </label>
        <input
          id="enquiry-search"
          type="search"
          name="q"
          defaultValue={q ?? ""}
          maxLength={100}
          placeholder="Search by name, email or words in the message"
          className="w-full max-w-md rounded-control border border-border bg-surface-raised px-3.5 py-2 text-sm text-ink placeholder:text-ink-muted/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta"
        />
        <button type="submit" className="rounded-control border border-border px-3.5 py-2 text-sm font-semibold text-ink hover:border-cta hover:text-cta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta">
          Search
        </button>
        {q && (
          <Link href={href({ q: undefined })} className="text-sm font-semibold text-cta hover:underline focus-visible:underline">
            Clear search
          </Link>
        )}
      </form>

      {rows.length === 0 ? (
        <Panel>
          <p className="text-sm text-ink-muted">
            {q ? "Nothing matches. Try a different word, or clear the search." : status === "new" ? "No new enquiries. New messages appear here as soon as someone sends one." : status === "handled" ? "Nothing has been marked as handled yet." : "No spam has been marked."}
          </p>
        </Panel>
      ) : (
        <ul className="flex flex-col gap-2">
          {rows.map((r) => (
            <li key={r.id}>
              <Link
                href={`/admin/enquiries/${r.id}`}
                className="flex flex-col gap-1 rounded-control border border-border bg-surface-raised px-4 py-3 hover:border-cta focus-visible:border-cta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta"
              >
                <span className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="text-sm font-semibold text-ink">
                    {r.name} <span className="font-normal text-ink-muted">· {enquiryTopicLabel(r.topic)}</span>
                  </span>
                  <span className="text-xs text-ink-muted">{whenFmt.format(r.createdAt)}</span>
                </span>
                <span className="line-clamp-2 text-sm text-ink-muted">{r.message}</span>
                {r.emailStatus !== "sent" && <span className="text-xs font-semibold text-amber-800">The email notification did not go out: this message is only here.</span>}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
