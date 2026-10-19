import Link from "next/link";
import { PageTitle } from "@/components/admin/ui";

/** An admin page that does not exist (a mistyped address, or an item that is gone). The menu stays in place. */
export default function AdminNotFound() {
  return (
    <>
      <PageTitle title="We can't find that page" description="The address may be mistyped, or the item may no longer exist." />
      <div className="flex flex-wrap gap-3">
        <Link href="/admin" className="rounded-control bg-cta px-4 py-2 text-sm font-semibold text-cta-ink hover:bg-brand-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta">
          Go to the dashboard
        </Link>
        <Link href="/admin/help" className="rounded-control border border-border px-4 py-2 text-sm font-semibold text-ink hover:border-cta hover:text-cta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta">
          Open Help
        </Link>
      </div>
    </>
  );
}
