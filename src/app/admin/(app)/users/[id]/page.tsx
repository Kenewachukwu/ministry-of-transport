import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/db/client";
import { users } from "@/db/schema";
import { ActionForm, Field, SelectField, SubmitButton, UnsavedNote } from "@/components/admin/form";
import { PermissionGrid } from "@/components/admin/PermissionGrid";
import { HelpLink } from "@/components/admin/help/HelpLink";
import { PageTitle, Panel, StatusBadge } from "@/components/admin/ui";
import { requireSuperAdminPage } from "@/lib/auth/dal";
import { isSection } from "@/lib/auth/permissions";
import { archiveUserAction, changeUserEmailAction, restoreUserAction, resendInviteAction, updateUserAction } from "../actions";

export const metadata: Metadata = { title: "Manage user" };

export default async function ManageUserPage({ params }: { params: Promise<{ id: string }> }) {
  const me = await requireSuperAdminPage();
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  const db = await getDb();
  const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  if (!user) notFound();

  return (
    <>
      <PageTitle
        title={user.name}
        description={user.email}
        actions={
          <>
            <HelpLink slug="change-someones-access" />
            <Link href="/admin/users" className="rounded-control border border-border px-3 py-2 text-sm font-semibold text-ink hover:border-cta hover:text-cta">← All users</Link>
          </>
        }
      />
      <p className="mb-6"><StatusBadge status={user.status} /></p>

      <Panel title="Access">
        <ActionForm action={updateUserAction} warnOnLeave>
          <input type="hidden" name="id" value={user.id} />
          <Field name="name" label="Full name" defaultValue={user.name} required />
          <SelectField
            name="role"
            label="Role"
            defaultValue={user.role}
            options={[
              { value: "staff", label: "Content editor" },
              { value: "super_admin", label: "Super administrator" },
            ]}
          />
          <PermissionGrid editSelected={user.permissions.filter(isSection)} publishSelected={user.publishPermissions.filter(isSection)} />
          <div className="flex flex-wrap items-center gap-4">
            <SubmitButton>Save access</SubmitButton>
            <UnsavedNote />
          </div>
        </ActionForm>
      </Panel>

      <Panel title="Sign-in email" className="mt-6">
        {user.id === me.id ? (
          <p className="text-sm text-ink-muted">This is your own account. To change your email address, ask another super administrator, so a typing mistake cannot lock you out.</p>
        ) : (
          <ActionForm action={changeUserEmailAction} className="max-w-md">
            <input type="hidden" name="id" value={user.id} />
            <Field name="email" label="Sign-in email address" type="email" required defaultValue={user.email} autoComplete="off" help={user.status === "invited" ? "They have not activated yet, so a new invitation is sent to the new address." : "Their password stays the same. We email both the old and the new address."} />
            <SubmitButton variant="secondary" className="self-start">Change email address</SubmitButton>
          </ActionForm>
        )}
      </Panel>

      <Panel title="Account" className="mt-6">
        <div className="flex flex-col gap-5">
          {user.status === "invited" && (
            <ActionForm action={resendInviteAction}>
              <input type="hidden" name="id" value={user.id} />
              <p className="text-sm text-ink-muted">This person hasn&rsquo;t activated their account yet. Sending a new invitation cancels the previous link.</p>
              <SubmitButton variant="secondary" className="self-start">Send a new invitation</SubmitButton>
            </ActionForm>
          )}
          {user.status === "archived" ? (
            <ActionForm action={restoreUserAction}>
              <input type="hidden" name="id" value={user.id} />
              <p className="text-sm text-ink-muted">This account is deactivated and cannot sign in.</p>
              <SubmitButton variant="secondary" className="self-start">Reactivate account</SubmitButton>
            </ActionForm>
          ) : user.id === me.id ? (
            <p className="text-sm text-ink-muted">This is your own account, so it can&rsquo;t be deactivated from here.</p>
          ) : (
            <ActionForm action={archiveUserAction}>
              <input type="hidden" name="id" value={user.id} />
              <p className="text-sm text-ink-muted">Deactivating signs this person out everywhere and stops them signing in. Their history in the activity log is kept, and you can reactivate them later.</p>
              <SubmitButton variant="secondary" className="self-start">Deactivate account</SubmitButton>
            </ActionForm>
          )}
        </div>
      </Panel>
    </>
  );
}
