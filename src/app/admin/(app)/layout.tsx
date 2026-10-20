import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminAvailability } from "@/lib/admin/availability";
import { requireUser } from "@/lib/auth/dal";
import { canPublishAnywhere } from "@/lib/auth/permissions";
import { countWaiting } from "@/lib/dal/admin/crud";
import { ENTITIES } from "@/lib/admin/registry";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  if (!adminAvailability().available) redirect("/admin/login"); // that page explains what is missing
  // Every page below also checks its own permission — a layout alone is never enough.
  const user = await requireUser();
  // Publishers see how many submissions wait for them beside "Approvals" in the menu.
  const waiting = canPublishAnywhere(user) ? await countWaiting(user, ENTITIES) : null;
  return (
    <AdminShell user={user} waiting={waiting}>
      {children}
    </AdminShell>
  );
}
