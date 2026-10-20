import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Eye } from "lucide-react";
import { z } from "zod";
import { SiteFrame } from "@/components/layout/SiteFrame";
import { ArticleTemplate } from "@/components/templates/ArticleTemplate";
import { DepartmentDetailTemplate } from "@/components/templates/DepartmentDetailTemplate";
import { LeadershipDetailTemplate } from "@/components/templates/LeadershipDetailTemplate";
import { WorkflowBadge } from "@/components/admin/ui";
import { getDepartments } from "@/lib/cms";
import { getEntity } from "@/lib/admin/registry";
import { previewModel } from "@/lib/admin/preview";
import { workflowState } from "@/lib/admin/workflow";
import { requireSectionPage } from "@/lib/auth/dal";
import { getRow } from "@/lib/dal/admin/crud";
import { SITE_BASE_PATH } from "@/lib/seo";

export const metadata: Metadata = { title: "Preview", robots: { index: false, follow: false } };

/**
 * An unpublished item (or proposed changes) shown inside the real website frame.
 * Signed-in people with access to the section only; nothing here is public.
 */
export default async function PreviewPage({ params }: { params: Promise<{ entity: string; id: string }> }) {
  const { entity, id } = await params;
  const def = getEntity(entity);
  if (!def || !z.uuid().safeParse(id).success) notFound();
  const user = await requireSectionPage(def.section);
  const row = await getRow(def, user, id);
  if (!row) notFound();
  const model = previewModel(def, row);
  if (!model) notFound();
  const state = workflowState(row);
  const editHref = `/admin/${def.key}/${id}`;

  return (
    <SiteFrame>
      {model.kind === "news" && <ArticleTemplate item={model.item} basePath={SITE_BASE_PATH} />}
      {model.kind === "department" && <DepartmentDetailTemplate department={model.department} departments={await getDepartments()} basePath={SITE_BASE_PATH} />}
      {model.kind === "leader" && <LeadershipDetailTemplate person={model.person} basePath={SITE_BASE_PATH} />}

      <div role="region" aria-label="Preview" className="fixed inset-x-0 bottom-0 z-[60] border-t-2 border-amber-400 bg-amber-50 px-4 py-3 text-amber-950 shadow-[0_-4px_16px_rgb(0_0_0/0.12)]">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
          <p className="flex flex-wrap items-center gap-2 text-sm">
            <Eye size={16} aria-hidden />
            <strong>Preview.</strong> This is how it will look once published. Nobody else can see it.
            <WorkflowBadge state={state} />
          </p>
          <Link href={editHref} className="rounded-control bg-amber-900 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-900">
            Back to editing
          </Link>
        </div>
      </div>
    </SiteFrame>
  );
}
