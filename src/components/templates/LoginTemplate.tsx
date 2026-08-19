"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Container } from "@/design-system/primitives/Container";
import { FormField } from "@/design-system/primitives/FormField";
import { Button } from "@/design-system/primitives/Button";
import { Logo } from "@/components/layout/Header/Logo";

/**
 * Consolidates the live site's ad-hoc GovMail/IPPIS/PEBEC links into one
 * clear entry point.
 */
export function LoginTemplate({ basePath }: { basePath: string }) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <section className="flex min-h-[80vh] items-center justify-center bg-surface py-16">
      <Container size="narrow" className="max-w-md">
        <div className="rounded-card border border-border bg-surface-raised p-8 shadow-card">
          <div className="flex justify-center">
            <Logo basePath={basePath} />
          </div>
          <h1 className="mt-6 text-center font-display text-xl font-semibold text-ink">eCMS Portal</h1>
          <p className="mt-1 text-center text-sm text-ink-muted">Staff and CMS sign-in</p>

          {submitted ? (
            <div className="mt-8 flex flex-col items-center gap-2 text-center">
              <CheckCircle2 size={28} className="text-cta" aria-hidden />
              <p className="text-sm text-ink-muted">Signed in successfully. Redirecting…</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
              <FormField id="email" type="email" label="Staff email" required autoComplete="username" />
              <FormField id="password" type="password" label="Password" required autoComplete="current-password" />
              <Button type="submit" className="mt-2 w-full">
                Sign In
              </Button>
              <Link
                href={`${basePath}/portal/forgot-password`}
                className="text-center text-sm text-ink-muted hover:text-cta"
              >
                Forgot password?
              </Link>
            </form>
          )}
        </div>
      </Container>
    </section>
  );
}
