import type { Metadata } from "next";
import Link from "next/link";
import { ActionForm, Field, SubmitButton } from "@/components/admin/form";
import { forgotPasswordAction } from "../actions";

export const metadata: Metadata = { title: "Reset password" };

export default function ForgotPasswordPage() {
  return (
    <>
      <h1 className="font-display text-xl font-semibold text-ink">Forgot your password?</h1>
      <p className="mt-1 text-sm text-ink-muted">Enter your email and we&rsquo;ll send you a link to choose a new one.</p>
      <ActionForm action={forgotPasswordAction} className="mt-6">
        <Field name="email" label="Email" type="email" required autoComplete="username" />
        <SubmitButton className="w-full">Send reset link</SubmitButton>
        <Link href="/admin/login" className="text-center text-sm text-ink-muted hover:text-cta focus-visible:text-cta">
          Back to sign in
        </Link>
      </ActionForm>
    </>
  );
}
