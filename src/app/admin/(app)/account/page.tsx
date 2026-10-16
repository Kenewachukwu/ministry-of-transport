import type { Metadata } from "next";
import { ActionForm, Field, SubmitButton } from "@/components/admin/form";
import { PageTitle, Panel } from "@/components/admin/ui";
import { PASSWORD_HINT } from "@/lib/admin/action";
import { requireUser } from "@/lib/auth/dal";
import { SECTION_LABELS } from "@/lib/auth/permissions";
import { changePasswordAction } from "./actions";

export const metadata: Metadata = { title: "My account" };

export default async function AccountPage() {
  const user = await requireUser();
  return (
    <>
      <PageTitle title="My account" description={`${user.name} · ${user.email}`} />

      <Panel title="Your access">
        <p className="text-sm text-ink-muted">
          {user.role === "super_admin"
            ? "You are a super administrator: you can manage all content, people and settings."
            : user.permissions.length
              ? `You can manage: ${user.permissions.map((s) => SECTION_LABELS[s]).join(", ")}.`
              : "No sections have been assigned to you yet."}
        </p>
      </Panel>

      <Panel title="Change password" className="mt-6">
        <ActionForm action={changePasswordAction} className="max-w-md">
          <Field name="current" label="Current password" type="password" required autoComplete="current-password" />
          <Field name="password" label="New password" type="password" required autoComplete="new-password" help={PASSWORD_HINT} />
          <Field name="confirm" label="Confirm new password" type="password" required autoComplete="new-password" />
          <SubmitButton className="self-start">Change password</SubmitButton>
        </ActionForm>
      </Panel>
    </>
  );
}
