import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageTitle({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm text-ink-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({ title, children, className }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-card border border-border bg-surface-raised p-6 shadow-card", className)}>
      {title && <h2 className="mb-4 font-display text-lg font-semibold text-ink">{title}</h2>}
      {children}
    </section>
  );
}

export function Notice({ tone = "info", children }: { tone?: "info" | "warn" | "success"; children: ReactNode }) {
  const tones = {
    info: "border-brand-200 bg-brand-50 text-brand-800",
    warn: "border-amber-300 bg-amber-50 text-amber-900",
    success: "border-brand-300 bg-brand-100 text-brand-900",
  } as const;
  return (
    <p role="status" className={cn("mb-6 rounded-control border px-4 py-3 text-sm", tones[tone])}>
      {children}
    </p>
  );
}

export function StatusBadge({ status }: { status: "published" | "archived" | "active" | "invited" }) {
  const styles = {
    published: "bg-brand-50 text-brand-800",
    active: "bg-brand-50 text-brand-800",
    archived: "bg-stone-200 text-stone-700",
    invited: "bg-amber-100 text-amber-800",
  } as const;
  return <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize", styles[status])}>{status}</span>;
}
