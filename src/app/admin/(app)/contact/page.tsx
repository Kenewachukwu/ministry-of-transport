import type { Metadata } from "next";
import { ActionForm, Field, LoadedAt, SubmitButton, TextArea, UnsavedNote } from "@/components/admin/form";
import { HelpLink } from "@/components/admin/help/HelpLink";
import { PageTitle, Panel } from "@/components/admin/ui";
import { siteMeta as defaults } from "@/content/siteMeta";
import { readSiteTextGroup } from "@/lib/admin/site-text";
import { requireSectionPage } from "@/lib/auth/dal";
import { groupKeys } from "@/lib/admin/site-text-groups";
import { saveSiteTextAction } from "../site-text/actions";

export const metadata: Metadata = { title: "Contact details & links" };

export default async function ContactDetailsPage() {
  await requireSectionPage("contact");
  const { values, loadedAt } = await readSiteTextGroup(groupKeys("contact"));
  // What is saved wins; otherwise the website's built-in default. An empty saved value stays empty (it hides the item).
  const v = (key: string, fallback: string) => (values.has(key) ? (values.get(key) as string) : fallback);
  const save = saveSiteTextAction.bind(null, "contact");

  return (
    <>
      <PageTitle
        title="Contact details & links"
        description="Shown in the footer of every page, on the Contact page, and wherever the website asks people to email the Ministry."
        actions={<HelpLink slug="edit-contact-details" />}
      />
      <ActionForm action={save} warnOnLeave>
        <LoadedAt initial={loadedAt} />
        <Panel title="How people reach the Ministry">
          <div className="flex flex-col gap-5">
            <TextArea name="contact.address" label="Address" rows={2} required defaultValue={v("contact.address", defaults.address)} />
            <div className="grid gap-5 sm:grid-cols-2">
              <Field name="contact.hours" label="Opening hours" required defaultValue={v("contact.hours", defaults.hours)} />
              <Field name="contact.email" label="Email address" type="email" required defaultValue={v("contact.email", defaults.email)} help="Used for enquiries, document requests and the legal pages." />
            </div>
            <Field name="contact.phone" label="Telephone number" defaultValue={v("contact.phone", defaults.phone ?? "")} help="Leave empty to show no telephone number. Only enter a number the Ministry answers." />
          </div>
        </Panel>
        <Panel title="Social media">
          <p className="mb-5 text-sm text-ink-muted">Full https:// addresses of the Ministry&rsquo;s official pages. Leave one empty to hide its icon.</p>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field name="social.x" label="X (Twitter) link" type="url" defaultValue={v("social.x", defaults.social.x)} />
            <Field name="social.instagram" label="Instagram link" type="url" defaultValue={v("social.instagram", defaults.social.instagram)} />
            <Field name="social.facebook" label="Facebook link" type="url" defaultValue={v("social.facebook", defaults.social.facebook)} />
            <Field name="social.youtube" label="YouTube link" type="url" defaultValue={v("social.youtube", defaults.social.youtube)} />
          </div>
        </Panel>
        <div className="flex flex-wrap items-center gap-4">
          <SubmitButton>Save changes</SubmitButton>
          <UnsavedNote />
        </div>
      </ActionForm>
    </>
  );
}
