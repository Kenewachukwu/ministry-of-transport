import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Printer } from "lucide-react";
import { HelpIndex } from "@/components/admin/help/HelpIndex";
import { PageTitle } from "@/components/admin/ui";
import { requireUser } from "@/lib/auth/dal";
import { splitGuides, toIndexEntry } from "@/lib/admin/help";

export const metadata: Metadata = { title: "Help" };

export default async function HelpPage() {
  const user = await requireUser();
  const { mine, others } = splitGuides(user);
  const entries = [...mine.map((g) => toIndexEntry(g, true)), ...others.map((g) => toIndexEntry(g, false))];

  return (
    <>
      <PageTitle
        title="Help"
        description="Step-by-step guides for everything you can do in the admin. Each one uses the exact names of the buttons and fields you will see."
        actions={
          <>
            <Link href="/admin/help/glossary" className="inline-flex items-center gap-1.5 rounded-control border border-border px-3 py-2 text-sm font-semibold text-ink hover:border-cta hover:text-cta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta">
              <BookOpen size={14} aria-hidden /> Glossary
            </Link>
            <Link href="/admin/help/quick-reference" className="inline-flex items-center gap-1.5 rounded-control border border-border px-3 py-2 text-sm font-semibold text-ink hover:border-cta hover:text-cta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta">
              <Printer size={14} aria-hidden /> Printable quick reference
            </Link>
          </>
        }
      />
      <HelpIndex entries={entries} />
      <p className="mt-12 text-sm text-ink-muted">Cannot find what you need? Ask a super administrator, or the support team who set up the website.</p>
    </>
  );
}
