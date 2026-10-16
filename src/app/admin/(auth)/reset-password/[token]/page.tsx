import type { Metadata } from "next";
import Link from "next/link";
import { ActionForm, Field, SubmitButton } from "@/components/admin/form";
import { PASSWORD_HINT } from "@/lib/admin/action";
import { peekToken } from "@/lib/auth/tokens";
import { resetPasswordAction } from "../../actions";

export const metadata: Metadata = { title: "Choose a new password", referrer: "no-referrer" };

export default async function ResetPasswordPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  // Looking at the link must not use it up: mail scanners open links before people do.
  const valid = (await peekToken(token, "reset")) !== null;

  if (!valid) {
    return (
      <>
        <h1 className="font-display text-xl font-semibold text-ink">Link expired</h1>
        <p className="mt-3 text-sm text-ink-muted">This reset link is invalid or has expired. Reset links work once and last 60 minutes.</p>
        <Link href="/admin/forgot-password" className="mt-5 inline-block text-sm font-semibold text-cta">
          Request a new link
        </Link>
      </>
    );
  }

  return (
    <>
      <h1 className="font-display text-xl font-semibold text-ink">Choose a new password</h1>
      <ActionForm action={resetPasswordAction} className="mt-6">
        <input type="hidden" name="token" value={token} />
        <Field name="password" label="New password" type="password" required autoComplete="new-password" help={PASSWORD_HINT} />
        <Field name="confirm" label="Confirm new password" type="password" required autoComplete="new-password" />
        <SubmitButton className="w-full">Change password</SubmitButton>
      </ActionForm>
    </>
  );
}
