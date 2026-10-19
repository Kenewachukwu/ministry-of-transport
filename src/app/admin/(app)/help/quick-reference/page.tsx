import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { GuideView } from "@/components/admin/help/GuideView";
import { PrintButton } from "@/components/admin/help/PrintButton";
import { PageTitle } from "@/components/admin/ui";
import { requireUser } from "@/lib/auth/dal";
import { splitGuides } from "@/lib/admin/help";

export const metadata: Metadata = { title: "Printable quick reference" };

/** Every guide for the signed-in person's own role on one page, laid out to print (or save as PDF) as a handout. */
export default async function QuickReferencePage() {
  const user = await requireUser();
  const { mine } = splitGuides(user);
  const role = user.role === "super_admin" ? "Super administrator" : "Content editor";

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link href="/admin/help" className="inline-flex items-center gap-1.5 text-sm font-semibold text-cta hover:underline focus-visible:underline">
          <ArrowLeft size={14} aria-hidden /> All guides
        </Link>
        <PrintButton />
      </div>
      <PageTitle title="Quick reference" description={`Website admin guides for a ${role.toLowerCase()}, ready to print. Use your browser's print dialog to save as a PDF.`} />
      <div className="flex max-w-3xl flex-col gap-12">
        {mine.map((guide) => (
          <GuideView key={guide.slug} guide={guide} compact headingLevel={2} />
        ))}
      </div>
    </>
  );
}
