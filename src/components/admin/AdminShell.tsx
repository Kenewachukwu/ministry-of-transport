import Link from "next/link";
import { CircleHelp, ExternalLink, LogOut, UserRound } from "lucide-react";
import { Logo } from "@/components/layout/Header/Logo";
import { CONTENT_NAV, SYSTEM_NAV, type NavEntry } from "@/lib/admin/nav";
import { can, type SessionUser } from "@/lib/auth/permissions";
import { logoutAction } from "@/app/admin/(auth)/actions";
import { SessionWatcher } from "./SessionWatcher";
import { SITE_BASE_PATH } from "@/lib/seo";

function visible(user: SessionUser, entry: NavEntry) {
  if (entry.superAdminOnly) return user.role === "super_admin";
  return entry.section ? can(user, entry.section) : true;
}

const linkClasses =
  "block rounded-md px-3 py-2 text-sm text-ink-muted transition-colors hover:bg-brand-50 hover:text-cta focus-visible:bg-brand-50 focus-visible:text-cta focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-cta";

function NavList({ user, waiting, badges }: { user: SessionUser; waiting: number | null; badges: Record<string, number> }) {
  const content = CONTENT_NAV.filter((e) => visible(user, e));
  const system = SYSTEM_NAV.filter((e) => visible(user, e));
  return (
    <nav aria-label="Admin" className="flex flex-col gap-6">
      <div>
        <Link href="/admin" className={linkClasses}>Dashboard</Link>
        {waiting !== null && (
          <Link href="/admin/review" className={`${linkClasses} flex items-center justify-between gap-2`}>
            Approvals
            {waiting > 0 && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-900">
                {waiting}
                <span className="sr-only"> waiting for your decision</span>
              </span>
            )}
          </Link>
        )}
      </div>
      {content.length > 0 && (
        <div>
          <p className="px-3 text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted/80">Content</p>
          <ul className="mt-2 flex flex-col">
            {content.map((e) => (
              <li key={e.href}>
                <Link href={e.href} className={`${linkClasses} flex items-center justify-between gap-2`}>
                  {e.label}
                  {badges[e.href] > 0 && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-900">
                      {badges[e.href]}
                      <span className="sr-only"> new</span>
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      {system.length > 0 && (
        <div>
          <p className="px-3 text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted/80">Administration</p>
          <ul className="mt-2 flex flex-col">
            {system.map((e) => (
              <li key={e.href}>
                <Link href={e.href} className={linkClasses}>{e.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}

export function AdminShell({
  user,
  waiting = null,
  badges = {},
  children,
}: {
  user: SessionUser;
  /** Items waiting for this person's decision; null when they cannot publish anywhere. */
  waiting?: number | null;
  /** A count shown beside a menu entry (for example new enquiries), keyed by its address. */
  badges?: Record<string, number>;
  children: React.ReactNode;
}) {
  const account = (
    <div className="flex flex-col gap-1 border-t border-border pt-4">
      <div className="flex items-center gap-2 px-3 text-sm text-ink">
        <UserRound size={16} aria-hidden className="text-cta" />
        <span className="min-w-0">
          <span className="block truncate font-semibold">{user.name}</span>
          <span className="block truncate text-xs text-ink-muted">{user.role === "super_admin" ? "Super administrator" : "Content editor"}</span>
        </span>
      </div>
      <Link href="/admin/help" className={`${linkClasses} inline-flex items-center gap-1.5`}>
        <CircleHelp size={14} aria-hidden /> Help
      </Link>
      <Link href="/admin/account" className={linkClasses}>My account</Link>
      <Link href="/" target="_blank" className={`${linkClasses} inline-flex items-center gap-1.5`}>
        View website <ExternalLink size={13} aria-hidden />
      </Link>
      <form action={logoutAction}>
        <button type="submit" className={`${linkClasses} flex w-full items-center gap-1.5 text-left`}>
          <LogOut size={14} aria-hidden /> Sign out
        </button>
      </form>
    </div>
  );

  return (
    <div className="flex min-h-screen flex-1 flex-col lg:flex-row">
      {/* Mobile: collapsible menu (no JavaScript needed) */}
      <header className="border-b border-border bg-surface-raised lg:hidden print:hidden">
        <details className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3">
            <Logo basePath={SITE_BASE_PATH} />
            <span className="rounded-control border border-border px-3 py-1.5 text-sm font-semibold text-ink group-open:bg-brand-50">Menu</span>
          </summary>
          <div className="flex flex-col gap-6 border-t border-border px-4 py-4">
            <NavList user={user} waiting={waiting} badges={badges} />
            {account}
          </div>
        </details>
      </header>

      <aside className="hidden w-72 shrink-0 flex-col gap-6 border-r border-border bg-surface-raised p-5 lg:flex print:!hidden">
        <Logo basePath={SITE_BASE_PATH} />
        <div className="flex flex-1 flex-col justify-between gap-8">
          <NavList user={user} waiting={waiting} badges={badges} />
          {account}
        </div>
      </aside>

      <main id="admin-main" className="min-w-0 flex-1 px-4 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto w-full max-w-5xl">
          {user.sessionExpiresAt && <SessionWatcher expiresAt={user.sessionExpiresAt} />}
          {children}
        </div>
      </main>
    </div>
  );
}
