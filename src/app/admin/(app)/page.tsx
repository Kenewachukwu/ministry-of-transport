import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Notice, PageTitle, Panel } from "@/components/admin/ui";
import { CONTENT_NAV, SYSTEM_NAV } from "@/lib/admin/nav";
import { requireUser } from "@/lib/auth/dal";
import { can } from "@/lib/auth/permissions";

export const metadata: Metadata = { title: "Dashboard" };

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ denied?: string }> }) {
  const [user, { denied }] = await Promise.all([requireUser(), searchParams]);
  const content = CONTENT_NAV.filter((e) => e.section && can(user, e.section));
  const system = user.role === "super_admin" ? SYSTEM_NAV : [];

  return (
    <>
      <PageTitle title={`Welcome, ${user.name.split(" ")[0]}`} description="Manage the content of the Ministry's website. Changes appear on the public site as soon as you save them." />
      {denied && <Notice tone="warn">You don&rsquo;t have access to that section. Ask a super administrator if you need it.</Notice>}

      {content.length === 0 && system.length === 0 && (
        <Notice tone="warn">Your account has no sections assigned yet. Ask a super administrator to grant you access.</Notice>
      )}

      {content.length > 0 && (
        <Panel title="Your sections">
          <ul className="grid gap-3 sm:grid-cols-2">
            {content.map((e) => (
              <li key={e.href}>
                <Link href={e.href} className="group flex items-center justify-between rounded-control border border-border px-4 py-3 text-sm font-semibold text-ink transition-colors hover:border-cta hover:text-cta focus-visible:border-cta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta">
                  {e.label}
                  <ArrowUpRight size={15} aria-hidden className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </li>
            ))}
          </ul>
        </Panel>
      )}

      {system.length > 0 && (
        <Panel title="Administration" className="mt-6">
          <ul className="grid gap-3 sm:grid-cols-3">
            {system.map((e) => (
              <li key={e.href}>
                <Link href={e.href} className="block rounded-control border border-border px-4 py-3 text-sm font-semibold text-ink hover:border-cta hover:text-cta focus-visible:border-cta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta">
                  {e.label}
                </Link>
              </li>
            ))}
          </ul>
        </Panel>
      )}

      <p className="mt-8 text-xs text-ink-muted">
        Nothing is ever deleted from the website: removing an item <strong>archives</strong> it (it disappears from the public site but can be restored).
      </p>
    </>
  );
}
