import type { Metadata } from "next";
import { eq, sql } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";
import { getDb } from "@/db/client";
import { appMeta, departments, eServices, heroSlides, leadership, newsItems, pageBlocks, pillars, resources, users } from "@/db/schema";
import { PageTitle, Panel } from "@/components/admin/ui";
import { requireSuperAdminPage } from "@/lib/auth/dal";
import { getEmailProvider } from "@/lib/email/provider";
import { contentSource, siteUrl } from "@/lib/env";
import { storageMode } from "@/lib/storage/mode";

export const metadata: Metadata = { title: "System status" };

function Row({ label, ok, detail }: { label: string; ok: boolean | null; detail: string }) {
  return (
    <li className="flex items-start justify-between gap-4 py-3">
      <span className="text-sm font-semibold text-ink">{label}</span>
      <span className="flex items-center gap-2 text-right text-sm text-ink-muted">
        {detail}
        <span
          aria-label={ok === null ? "Not applicable" : ok ? "OK" : "Needs attention"}
          className={`inline-block h-2.5 w-2.5 shrink-0 rounded-full ${ok === null ? "bg-stone-300" : ok ? "bg-brand-500" : "bg-amber-500"}`}
        />
      </span>
    </li>
  );
}

export default async function StatusPage() {
  await requireSuperAdminPage();
  const db = await getDb();
  // A real round trip: if this fails the page errors, which is the honest answer.
  await db.select({ one: sql<number>`1` }).from(users).limit(1);
  const [seeded] = await db.select().from(appMeta).where(eq(appMeta.key, "seeded_at"));

  const count = async (table: PgTable) => (await db.select({ n: sql<number>`count(*)::int` }).from(table))[0].n;
  const counts = await Promise.all(
    (
      [
        ["Hero slides", heroSlides],
        ["News, Photo News & Events", newsItems],
        ["Departments", departments],
        ["Leadership", leadership],
        ["The Road Ahead", pillars],
        ["FCSSIP page blocks", pageBlocks],
        ["E-Services", eServices],
        ["Resources", resources],
        ["Users", users],
      ] as [string, PgTable][]
    ).map(async ([label, table]) => [label, await count(table)] as const)
  );

  const email = getEmailProvider();
  const storage = storageMode();
  return (
    <>
      <PageTitle title="System status" description="Whether the pieces the admin depends on are connected. Secret values are never shown here." />
      <Panel>
        <ul className="divide-y divide-border">
          <Row label="Database" ok detail={`${contentSource() === "pglite" ? "Local embedded database" : "PostgreSQL"} · responding`} />
          <Row label="Content seeded" ok={!!seeded} detail={seeded ? `Loaded ${seeded.value.slice(0, 10)}` : "Not yet: the public site is still showing its built-in content"} />
          <Row label="Email" ok={email ? email.name !== "console" : false} detail={email ? (email.name === "console" ? "Printing to the server console (development)" : "Resend") : "Not configured: invitation links are shown on screen instead"} />
          <Row label="File uploads" ok={storage !== "none"} detail={storage === "blob" ? "Vercel Blob" : storage === "local" ? "Local folder (development)" : "Not configured: pictures can be linked but not uploaded"} />
          <Row label="Website address" ok={!!process.env.SITE_URL} detail={`${siteUrl()}${process.env.SITE_URL ? "" : " (set SITE_URL for emailed links)"}`} />
        </ul>
      </Panel>
      <Panel title="Content" className="mt-6">
        <ul className="grid gap-x-8 sm:grid-cols-2">
          {counts.map(([label, n]) => (
            <li key={label} className="flex justify-between border-b border-border py-2 text-sm">
              <span className="text-ink-muted">{label}</span>
              <span className="font-semibold text-ink">{n}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-ink-muted">Counts include archived items.</p>
      </Panel>
    </>
  );
}
