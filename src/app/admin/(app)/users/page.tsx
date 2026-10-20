import type { Metadata } from "next";
import Link from "next/link";
import { asc } from "drizzle-orm";
import { getDb } from "@/db/client";
import { users } from "@/db/schema";
import { ActionForm, Field, SelectField, SubmitButton } from "@/components/admin/form";
import { PermissionGrid } from "@/components/admin/PermissionGrid";
import { HelpLink } from "@/components/admin/help/HelpLink";
import { PageTitle, Panel, StatusBadge } from "@/components/admin/ui";
import { requireSuperAdminPage } from "@/lib/auth/dal";
import { INBOX_SECTIONS, SECTION_LABELS, isSection } from "@/lib/auth/permissions";
import { inviteUserAction } from "./actions";

export const metadata: Metadata = { title: "Users & access" };

const dateFmt = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

export default async function UsersPage() {
  await requireSuperAdminPage();
  const db = await getDb();
  const rows = await db.select().from(users).orderBy(asc(users.status), asc(users.name));

  return (
    <>
      <PageTitle title="Users & access" description="Invite Ministry staff and choose which parts of the website each person can manage. People are deactivated, never deleted." actions={<HelpLink slug="invite-someone" />} />

      <Panel title="Invite someone">
        <ActionForm action={inviteUserAction} resetOnSuccess>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field name="name" label="Full name" required autoComplete="off" />
            <Field name="email" label="Ministry email address" type="email" required autoComplete="off" />
          </div>
          <SelectField
            name="role"
            label="Role"
            defaultValue="staff"
            options={[
              { value: "staff", label: "Content editor — manages only the sections ticked below" },
              { value: "super_admin", label: "Super administrator — manages everything, including users" },
            ]}
          />
          <PermissionGrid />
          <SubmitButton className="self-start">Send invitation</SubmitButton>
        </ActionForm>
      </Panel>

      <Panel title={`People (${rows.length})`} className="mt-6">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-wide text-ink-muted">
              <tr>
                <th className="py-2 pr-4 font-semibold">Person</th>
                <th className="py-2 pr-4 font-semibold">Access</th>
                <th className="py-2 pr-4 font-semibold">Status</th>
                <th className="py-2 pr-4 font-semibold">Last sign-in</th>
                <th className="py-2 font-semibold"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((u) => (
                <tr key={u.id} className="align-top">
                  <td className="py-3 pr-4">
                    <p className="font-semibold text-ink">{u.name}</p>
                    <p className="text-xs text-ink-muted">{u.email}</p>
                  </td>
                  <td className="py-3 pr-4 text-ink-muted">
                    {u.role === "super_admin"
                      ? "Super administrator"
                      : u.permissions
                          .filter(isSection)
                          .map((s) => `${SECTION_LABELS[s]} (${INBOX_SECTIONS.includes(s) ? "handles" : u.publishPermissions.includes(s) ? "publishes" : "edits"})`)
                          .join(", ") || "No sections"}
                  </td>
                  <td className="py-3 pr-4"><StatusBadge status={u.status} /></td>
                  <td className="py-3 pr-4 text-ink-muted">{u.lastLoginAt ? dateFmt.format(u.lastLoginAt) : "Never"}</td>
                  <td className="py-3 text-right">
                    <Link href={`/admin/users/${u.id}`} className="font-semibold text-cta hover:underline focus-visible:underline">Manage</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}
