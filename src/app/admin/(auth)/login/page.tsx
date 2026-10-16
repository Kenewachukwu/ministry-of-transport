import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ActionForm, Field, SubmitButton } from "@/components/admin/form";
import { adminAvailability } from "@/lib/admin/availability";
import { safeAdminPath } from "@/lib/admin/action";
import { getCurrentUser } from "@/lib/auth/session";
import { loginAction } from "../actions";

export const metadata: Metadata = { title: "Sign in" };

const NOTICES: Record<string, string> = {
  "password-reset": "Your password has been changed. Please sign in.",
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; notice?: string }> }) {
  const { next, notice } = await searchParams;
  // The proxy only checks the cookie's signature; here we check the session is really live.
  if (adminAvailability().available && (await getCurrentUser())) redirect(safeAdminPath(next));

  return (
    <>
      <h1 className="font-display text-xl font-semibold text-ink">Website admin</h1>
      <p className="mt-1 text-sm text-ink-muted">Sign in with your Ministry email address.</p>
      {notice && NOTICES[notice] && (
        <p role="status" className="mt-4 rounded-control border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-800">
          {NOTICES[notice]}
        </p>
      )}
      <ActionForm action={loginAction} className="mt-6">
        <input type="hidden" name="next" value={safeAdminPath(next)} />
        <Field name="email" label="Email" type="email" required autoComplete="username" />
        <Field name="password" label="Password" type="password" required autoComplete="current-password" />
        <SubmitButton className="w-full">Sign in</SubmitButton>
        <Link href="/admin/forgot-password" className="text-center text-sm text-ink-muted hover:text-cta focus-visible:text-cta">
          Forgot your password?
        </Link>
      </ActionForm>
    </>
  );
}
