import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/layout/Header/Logo";
import { GuideView } from "@/components/admin/help/GuideView";
import { getGuide } from "@/lib/admin/help";
import { SITE_BASE_PATH } from "@/lib/seo";

export const metadata: Metadata = { title: "Trouble signing in?" };

/**
 * The only help page that does not need a sign-in, because the people reading it
 * cannot sign in yet. It shows just the two guides about getting in.
 */
export default function SignInHelpPage() {
  const guides = ["accept-your-invitation", "forgot-your-password"].map((slug) => getGuide(slug)).filter((g) => g !== undefined);
  return (
    <div className="flex min-h-screen flex-1 justify-center bg-surface px-4 py-10">
      <div className="w-full max-w-2xl">
        <div className="mb-6 flex justify-center">
          <Logo basePath={SITE_BASE_PATH} />
        </div>
        <div className="rounded-card border border-border bg-surface-raised p-8 shadow-card">
          <Link href="/admin/login" className="inline-flex items-center gap-1.5 text-sm font-semibold text-cta hover:underline focus-visible:underline">
            <ArrowLeft size={14} aria-hidden /> Back to sign in
          </Link>
          <h1 className="mt-4 font-display text-2xl font-semibold text-ink">Trouble signing in?</h1>
          <p className="mt-2 text-sm text-ink-muted">Two common cases are below. If neither helps, ask a super administrator to check your account.</p>
          <div className="mt-8 flex flex-col gap-12">
            {guides.map((g) => (
              <GuideView key={g.slug} guide={g} compact headingLevel={2} />
            ))}
          </div>
          <section className="mt-12 border-t border-border pt-6">
            <h2 className="font-display text-lg font-semibold text-ink">Still cannot get in?</h2>
            <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 text-sm text-ink-muted">
              <li>After several wrong passwords in a row you have to wait a few minutes before trying again.</li>
              <li>If your account was deactivated, or you were never invited, a super administrator has to fix that.</li>
              <li>Never share your password. No one will ask for it.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
