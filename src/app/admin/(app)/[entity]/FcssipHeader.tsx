import { getDb } from "@/db/client";
import { siteText } from "@/db/schema";
import { ActionForm, Field, SubmitButton, TextArea, UnsavedNote } from "@/components/admin/form";
import { Panel } from "@/components/admin/ui";
import { fcssipPage } from "@/content/fcssip";
import { saveSiteTextAction } from "../site-text/actions";

/** The FCSSIP page's heading strings, edited above its list of content blocks. */
export async function FcssipHeader() {
  const db = await getDb();
  const map = new Map((await db.select().from(siteText)).map((r) => [r.key, r.value]));
  const save = saveSiteTextAction.bind(null, "fcssip");
  return (
    <Panel title="Page heading" className="mb-8">
      <ActionForm action={save} warnOnLeave>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field name="fcssip.title" label="Title" required defaultValue={map.get("fcssip.title") ?? fcssipPage.title} />
          <Field name="fcssip.eyebrow" label="Small heading above the title" defaultValue={map.get("fcssip.eyebrow") ?? fcssipPage.eyebrow} />
        </div>
        <TextArea name="fcssip.description" label="Introduction under the title" rows={2} defaultValue={map.get("fcssip.description") ?? fcssipPage.description} />
        <div className="flex flex-wrap items-center gap-4">
          <SubmitButton variant="secondary">Save heading</SubmitButton>
          <UnsavedNote />
        </div>
      </ActionForm>
    </Panel>
  );
}
