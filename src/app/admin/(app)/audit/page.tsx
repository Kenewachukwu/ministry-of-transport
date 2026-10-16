import type { Metadata } from "next";
import Link from "next/link";
import { desc } from "drizzle-orm";
import { getDb } from "@/db/client";
import { auditLog } from "@/db/schema";
import { PageTitle, Panel } from "@/components/admin/ui";
import { requireSuperAdminPage } from "@/lib/auth/dal";

export const metadata: Metadata = { title: "Activity log" };

const PAGE_SIZE = 50;
const fmt = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" });

export default async function AuditPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  await requireSuperAdminPage();
  const page = Math.max(1, Number.parseInt((await searchParams).page ?? "1", 10) || 1);
  const db = await getDb();
  // One extra row tells us whether there is a next page.
  const rows = await db.select().from(auditLog).orderBy(desc(auditLog.at)).limit(PAGE_SIZE + 1).offset((page - 1) * PAGE_SIZE);
  const hasNext = rows.length > PAGE_SIZE;
  const shown = rows.slice(0, PAGE_SIZE);

  return (
    <>
      <PageTitle title="Activity log" description="Who did what, and when: sign-ins, content changes, archiving and access changes. This log can't be edited." />
      <Panel>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-wide text-ink-muted">
              <tr>
                <th className="py-2 pr-4 font-semibold">When</th>
                <th className="py-2 pr-4 font-semibold">Who</th>
                <th className="py-2 pr-4 font-semibold">Action</th>
                <th className="py-2 font-semibold">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {shown.length === 0 && (
                <tr><td colSpan={4} className="py-6 text-center text-ink-muted">Nothing recorded yet.</td></tr>
              )}
              {shown.map((r) => (
                <tr key={r.id} className="align-top">
                  <td className="whitespace-nowrap py-2.5 pr-4 text-ink-muted">{fmt.format(r.at)}</td>
                  <td className="py-2.5 pr-4 text-ink">{r.actorLabel}</td>
                  <td className="py-2.5 pr-4 font-mono text-xs text-ink">{r.action}</td>
                  <td className="py-2.5 text-ink-muted">{r.summary ?? [r.entity, r.entityId].filter(Boolean).join(" ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-5 flex items-center justify-between text-sm">
          {page > 1 ? <Link href={`/admin/audit?page=${page - 1}`} className="font-semibold text-cta hover:underline">← Newer</Link> : <span />}
          {hasNext && <Link href={`/admin/audit?page=${page + 1}`} className="font-semibold text-cta hover:underline">Older →</Link>}
        </div>
      </Panel>
    </>
  );
}
