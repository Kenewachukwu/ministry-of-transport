import type { Metadata } from "next";
import Link from "next/link";
import { ActionForm, Field, SubmitButton } from "@/components/admin/form";
import { PASSWORD_HINT } from "@/lib/admin/action";
import { peekToken } from "@/lib/auth/tokens";
import { acceptInviteAction } from "../../actions";

export const metadata: Metadata = { title: "Activate your account", referrer: "no-referrer" };

export default async function AcceptInvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const valid = (await peekToken(token, "invite")) !== null;

  if (!valid) {
    return (
      <>
        <h1 className="font-display text-xl font-semibold text-ink">Invitation expired</h1>
        <p className="mt-3 text-sm text-ink-muted">
          This invitation is invalid, has already been used, or has expired (invitations last 72 hours). Ask a super administrator to send a new one.
        </p>
        <Link href="/admin/login" className="mt-5 inline-block text-sm font-semibold text-cta">
          Go to sign in
        </Link>
      </>
    );
  }

  return (
    <>
      <h1 className="font-display text-xl font-semibold text-ink">Activate your account</h1>
      <p className="mt-1 text-sm text-ink-muted">Choose a password to finish setting up your access.</p>
      <ActionForm action={acceptInviteAction} className="mt-6">
        <input type="hidden" name="token" value={token} />
        <Field name="password" label="Password" type="password" required autoComplete="new-password" help={PASSWORD_HINT} />
        <Field name="confirm" label="Confirm password" type="password" required autoComplete="new-password" />
        <SubmitButton className="w-full">Activate account</SubmitButton>
      </ActionForm>
    </>
  );
}
