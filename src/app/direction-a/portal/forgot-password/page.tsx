import type { Metadata } from "next";
import Link from "next/link";
import { Mail } from "lucide-react";
import { Container } from "@/design-system/primitives/Container";
import { FormField } from "@/design-system/primitives/FormField";
import { Button } from "@/design-system/primitives/Button";

export const metadata: Metadata = { title: "Reset Password" };

const basePath = "/direction-a";

export default function Page() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center py-16">
      <Container size="narrow" className="max-w-md">
        <div className="rounded-card border border-border bg-surface-raised p-8 text-center shadow-card">
          <Mail size={28} className="mx-auto text-cta" aria-hidden />
          <h1 className="mt-4 font-display text-xl font-semibold text-ink">Reset your password</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Enter your staff email and we&rsquo;ll send a reset link.
          </p>
          <form className="mt-6 flex flex-col gap-4 text-left">
            <FormField id="email" type="email" label="Staff email" required />
            <Button type="submit" className="w-full">Send Reset Link</Button>
          </form>
          <Link href={`${basePath}/portal/login`} className="mt-4 inline-block text-sm text-ink-muted hover:text-cta">
            ← Back to sign in
          </Link>
        </div>
      </Container>
    </section>
  );
}
