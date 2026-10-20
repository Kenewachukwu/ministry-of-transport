import type { Metadata } from "next";
import Link from "next/link";
import { ActionForm, Field, LoadedAt, SubmitButton, UnsavedNote } from "@/components/admin/form";
import { HelpLink } from "@/components/admin/help/HelpLink";
import { PageTitle, Panel } from "@/components/admin/ui";
import { ENQUIRY_TOPICS } from "@/content/enquiryTopics";
import { siteMeta } from "@/content/siteMeta";
import { readSiteTextGroup } from "@/lib/admin/site-text";
import { groupKeys } from "@/lib/admin/site-text-groups";
import { requireSuperAdminPage } from "@/lib/auth/dal";
import { getSiteMeta } from "@/lib/cms";
import { saveSiteTextAction } from "../../site-text/actions";

export const metadata: Metadata = { title: "Where enquiries go" };

export default async function EnquirySettingsPage() {
  await requireSuperAdminPage();
  const [{ values, loadedAt }, current] = await Promise.all([readSiteTextGroup(groupKeys("desks")), getSiteMeta()]);
  const save = saveSiteTextAction.bind(null, "desks");
  const fallback = current.email || siteMeta.email;

  return (
    <>
      <PageTitle
        title="Where enquiries go"
        description="Each kind of message from the contact form can be emailed to a different team. Leave one empty and it goes to the Ministry's main email address."
        actions={
          <>
            <HelpLink slug="set-where-enquiries-go" />
            <Link href="/admin/enquiries" className="rounded-control border border-border px-3 py-2 text-sm font-semibold text-ink hover:border-cta hover:text-cta">← Back to Enquiries</Link>
          </>
        }
      />
      <Panel>
        <ActionForm action={save} warnOnLeave>
          <LoadedAt initial={loadedAt} />
          <p className="text-sm text-ink-muted">
            The main email address is <strong className="text-ink">{fallback}</strong> (change it under Contact details &amp; links). Every message is also kept in Enquiries, whatever address it was sent to.
          </p>
          <div className="grid gap-5 sm:grid-cols-2">
            {ENQUIRY_TOPICS.map((t) => (
              <Field key={t.id} name={`enquiries.desk.${t.id}`} label={t.label} type="email" defaultValue={values.get(`enquiries.desk.${t.id}`) ?? ""} placeholder={fallback} />
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <SubmitButton>Save changes</SubmitButton>
            <UnsavedNote />
          </div>
        </ActionForm>
      </Panel>
    </>
  );
}
