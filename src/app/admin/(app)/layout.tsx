import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminAvailability } from "@/lib/admin/availability";
import { requireUser } from "@/lib/auth/dal";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  if (!adminAvailability().available) redirect("/admin/login"); // that page explains what is missing
  // Every page below also checks its own permission — a layout alone is never enough.
  const user = await requireUser();
  return <AdminShell user={user}>{children}</AdminShell>;
}
