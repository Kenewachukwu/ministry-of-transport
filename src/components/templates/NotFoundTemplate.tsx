import { Compass } from "lucide-react";
import { Container } from "@/design-system/primitives/Container";
import { Heading } from "@/design-system/primitives/Heading";
import { ButtonLink } from "@/design-system/primitives/Button";
import { InlineLink } from "@/design-system/primitives/Link";

/**
 * Shown for any address that does not exist, including content that has been
 * archived, so a visitor is never left on a bare browser-style error.
 */
export function NotFoundTemplate({ basePath }: { basePath: string }) {
  return (
    <section className="py-20 sm:py-28">
      <Container size="narrow">
        <Compass size={36} className="text-cta" aria-hidden />
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.16em] text-cta">Error 404</p>
        <Heading as="h1" size="h1" className="mt-2">
          We can&rsquo;t find that page
        </Heading>
        <p className="mt-4 max-w-xl text-lg text-ink-muted">
          The address may have been typed incorrectly, or the page may have moved or been withdrawn. Try one of these
          instead.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={basePath || "/"}>Go to the home page</ButtonLink>
          <ButtonLink href={`${basePath}/news`} variant="outline-brand">
            Newsroom
          </ButtonLink>
          <ButtonLink href={`${basePath}/sitemap`} variant="outline-brand">
            Site map
          </ButtonLink>
        </div>
        <p className="mt-8 text-ink-muted">
          Still stuck? <InlineLink href={`${basePath}/contact`}>Contact the Ministry</InlineLink>.
        </p>
      </Container>
    </section>
  );
}
