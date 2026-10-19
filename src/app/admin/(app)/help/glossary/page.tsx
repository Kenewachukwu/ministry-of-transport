import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageTitle } from "@/components/admin/ui";
import { requireUser } from "@/lib/auth/dal";
import { GLOSSARY } from "@/lib/admin/help";

export const metadata: Metadata = { title: "Glossary" };

export default async function GlossaryPage() {
  await requireUser();
  const terms = [...GLOSSARY].sort((a, b) => a.term.localeCompare(b.term));
  return (
    <>
      <div className="mb-6 print:hidden">
        <Link href="/admin/help" className="inline-flex items-center gap-1.5 text-sm font-semibold text-cta hover:underline focus-visible:underline">
          <ArrowLeft size={14} aria-hidden /> All guides
        </Link>
      </div>
      <PageTitle title="Glossary" description="What the words used in the admin mean." />
      <dl className="max-w-3xl divide-y divide-border rounded-card border border-border bg-surface-raised">
        {terms.map((t) => (
          <div key={t.term} className="grid gap-1 p-4 sm:grid-cols-[14rem_1fr] sm:gap-4">
            <dt className="text-sm font-semibold text-ink">{t.term}</dt>
            <dd className="text-sm leading-relaxed text-ink-muted">{t.meaning}</dd>
          </div>
        ))}
      </dl>
    </>
  );
}
