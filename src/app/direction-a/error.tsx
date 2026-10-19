"use client";

import { useEffect } from "react";
import { TriangleAlert } from "lucide-react";
import { Container } from "@/design-system/primitives/Container";
import { Heading } from "@/design-system/primitives/Heading";
import { Button, ButtonLink } from "@/design-system/primitives/Button";

/** A page failed while rendering. The header and footer stay, so the visitor can still navigate. */
export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="py-20 sm:py-28">
      <Container size="narrow">
        <TriangleAlert size={36} className="text-cta" aria-hidden />
        <Heading as="h1" size="h1" className="mt-6">
          Something went wrong
        </Heading>
        <p className="mt-4 max-w-xl text-lg text-ink-muted">
          We could not load this page. It is a problem on our side, and trying again often fixes it.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button onClick={() => retry()}>Try again</Button>
          <ButtonLink href="/direction-a" variant="outline-brand">
            Go to the home page
          </ButtonLink>
        </div>
        {error.digest && <p className="mt-8 text-sm text-ink-muted">Reference: {error.digest}</p>}
      </Container>
    </section>
  );
}
