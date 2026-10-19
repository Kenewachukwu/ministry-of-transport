import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { GuideView } from "@/components/admin/help/GuideView";
import { PrintButton } from "@/components/admin/help/PrintButton";
import { requireUser } from "@/lib/auth/dal";
import { getGuide } from "@/lib/admin/help";

export async function generateMetadata(props: PageProps<"/admin/help/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  return { title: getGuide(slug)?.title ?? "Help" };
}

export default async function GuidePage(props: PageProps<"/admin/help/[slug]">) {
  await requireUser();
  const { slug } = await props.params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link href="/admin/help" className="inline-flex items-center gap-1.5 text-sm font-semibold text-cta hover:underline focus-visible:underline">
          <ArrowLeft size={14} aria-hidden /> All guides
        </Link>
        <PrintButton />
      </div>
      <div className="max-w-3xl">
        <GuideView guide={guide} />
      </div>
    </>
  );
}
