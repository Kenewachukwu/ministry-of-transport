import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EntityForm } from "@/components/admin/EntityForm";
import { PageTitle, Panel } from "@/components/admin/ui";
import { requireSectionPage } from "@/lib/auth/dal";
import { getEntity } from "@/lib/admin/registry";
import { storageMode } from "@/lib/storage/mode";
import { saveEntityAction } from "../actions";

export async function generateMetadata({ params }: { params: Promise<{ entity: string }> }): Promise<Metadata> {
  const def = getEntity((await params).entity);
  return { title: def ? `Add ${def.singular}` : "Not found" };
}

export default async function NewEntityPage({ params }: { params: Promise<{ entity: string }> }) {
  const def = getEntity((await params).entity);
  if (!def) notFound();
  await requireSectionPage(def.section);

  // Sensible starting values: a date field starts as today.
  const today = new Date().toISOString().slice(0, 10);
  const initial = Object.fromEntries(def.fields.filter((f) => f.kind === "text" && f.inputType === "date" && f.name === "itemDate").map((f) => [f.name, today]));

  return (
    <>
      <PageTitle
        title={`Add ${def.singular}`}
        description={def.description}
        actions={<Link href={`/admin/${def.key}`} className="rounded-control border border-border px-3 py-2 text-sm font-semibold text-ink hover:border-cta hover:text-cta">← Back to the list</Link>}
      />
      <Panel>
        <EntityForm action={saveEntityAction.bind(null, def.key)} fields={def.fields} initial={initial} uploadMode={storageMode()} submitLabel={`Create ${def.singular}`} />
      </Panel>
    </>
  );
}
