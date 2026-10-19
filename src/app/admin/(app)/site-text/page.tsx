import type { Metadata } from "next";
import { ActionForm, LoadedAt, SubmitButton, TextArea, UnsavedNote } from "@/components/admin/form";
import { HelpLink } from "@/components/admin/help/HelpLink";
import { PageTitle, Panel } from "@/components/admin/ui";
import { readSiteTextGroup } from "@/lib/admin/site-text";
import { requireSectionPage } from "@/lib/auth/dal";
import { mandate, mission, vision } from "@/content/mandate";
import { saveSiteTextAction } from "./actions";

export const metadata: Metadata = { title: "Mandate, Mission & Vision" };

export default async function SiteTextPage() {
  await requireSectionPage("site_text");
  const { values: map, loadedAt } = await readSiteTextGroup(["mandate", "vision", "mission"]);
  const save = saveSiteTextAction.bind(null, "core");

  return (
    <>
      <PageTitle title="Mandate, Mission & Vision" description="Shown on the home page and as the introduction to the About Us page." actions={<HelpLink slug="edit-mandate-mission-vision" />} />
      <Panel>
        <ActionForm action={save} warnOnLeave>
          <LoadedAt initial={loadedAt} />
          <TextArea name="mandate" label="Mandate" rows={5} required defaultValue={map.get("mandate") ?? mandate} help="Shown as “Why we exist”, and as the intro on the About Us page." />
          <TextArea name="vision" label="Vision" rows={3} required defaultValue={map.get("vision") ?? vision} help="Shown as “Where we are headed”." />
          <TextArea name="mission" label="Mission" rows={5} required defaultValue={map.get("mission") ?? mission} help="Shown as “How we get there”." />
          <div className="flex flex-wrap items-center gap-4">
            <SubmitButton>Save changes</SubmitButton>
            <UnsavedNote />
          </div>
        </ActionForm>
      </Panel>
    </>
  );
}
