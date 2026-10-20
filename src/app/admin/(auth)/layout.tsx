import { Logo } from "@/components/layout/Header/Logo";
import { adminAvailability } from "@/lib/admin/availability";
import { SITE_BASE_PATH } from "@/lib/seo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const availability = adminAvailability();
  return (
    <div className="flex min-h-screen flex-1 items-center justify-center bg-surface px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <Logo basePath={SITE_BASE_PATH} />
        </div>
        <div className="rounded-card border border-border bg-surface-raised p-8 shadow-card">
          {availability.available ? (
            children
          ) : (
            <div>
              <h1 className="font-display text-xl font-semibold text-ink">Admin not set up yet</h1>
              <p className="mt-3 text-sm text-ink-muted">{availability.reason}</p>
              <p className="mt-3 text-xs text-ink-muted">The public website is unaffected and continues to work normally.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
