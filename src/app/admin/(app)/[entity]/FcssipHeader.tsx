import { ActionForm, Field, LoadedAt, SubmitButton, TextArea, UnsavedNote } from "@/components/admin/form";
import { Panel, PublishGate } from "@/components/admin/ui";
import { fcssipPage } from "@/content/fcssip";
import { readSiteTextGroup } from "@/lib/admin/site-text";
import { saveSiteTextAction } from "../site-text/actions";

/** The FCSSIP page's heading strings, edited above its list of content blocks. */
export async function FcssipHeader({ canPublish }: { canPublish: boolean }) {
  const { values: map, loadedAt } = await readSiteTextGroup(["fcssip.eyebrow", "fcssip.title", "fcssip.description"]);
  const save = saveSiteTextAction.bind(null, "fcssip");
  return (
    <Panel title="Page heading" className="mb-8">
      <PublishGate allowed={canPublish}>
      <ActionForm action={save} warnOnLeave>
        <LoadedAt initial={loadedAt} />
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
      </PublishGate>
    </Panel>
  );
}
