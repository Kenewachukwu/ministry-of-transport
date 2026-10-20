import { Mail, Phone, MapPin, Clock, FileText } from "lucide-react";
import { Container } from "@/design-system/primitives/Container";
import { Heading } from "@/design-system/primitives/Heading";
import { ButtonLink } from "@/design-system/primitives/Button";
import { PageHeader } from "./PageHeader";
import { SocialLinks } from "@/components/layout/Footer/SocialLinks";
import { getSiteMeta } from "@/lib/cms";
import { ECMS_URL } from "@/content/nav.config";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { submitEnquiryAction } from "@/app/(site)/contact/actions";
import { enquiryFormAvailable } from "@/lib/enquiries-public";
import { SITE_BASE_PATH } from "@/lib/seo";

/**
 * The enquiry form is only shown when messages can really be stored (a database
 * is connected): a form that only pretended to send would lose people's messages.
 * Without one, the page offers email, which always works. Official correspondence
 * to the Minister or Permanent Secretary goes through the Ministry's own portal.
 */
export async function ContactTemplate() {
  const siteMeta = await getSiteMeta();
  return (
    <>
      <PageHeader eyebrow="Get in Touch" title="Contact Us" description="We'd like to hear from you." />
      <section className="py-16">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div className="flex flex-col gap-5">
            <div className="flex items-start gap-3">
              <MapPin size={18} className="mt-0.5 shrink-0 text-cta" aria-hidden />
              <p className="text-ink-muted">{siteMeta.address}</p>
            </div>
            <div className="flex items-start gap-3">
              <Clock size={18} className="mt-0.5 shrink-0 text-cta" aria-hidden />
              <p className="text-ink-muted">{siteMeta.hours}</p>
            </div>
            {siteMeta.phone && (
              <div className="flex items-start gap-3">
                <Phone size={18} className="mt-0.5 shrink-0 text-cta" aria-hidden />
                <a href={`tel:${siteMeta.phone}`} className="text-ink-muted hover:text-cta">
                  {siteMeta.phone}
                </a>
              </div>
            )}
            <div className="flex items-start gap-3">
              <Mail size={18} className="mt-0.5 shrink-0 text-cta" aria-hidden />
              <a href={`mailto:${siteMeta.email}`} className="text-ink-muted hover:text-cta">
                {siteMeta.email}
              </a>
            </div>
            <SocialLinks social={siteMeta.social} className="mt-2 flex gap-3 [&_a]:border-border [&_a]:text-ink-muted [&_a:hover]:border-cta [&_a:hover]:text-cta" />
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-card border border-border bg-surface-raised p-8 shadow-card">
              <Mail size={22} className="text-cta" aria-hidden />
              <Heading as="h2" size="h4" className="mt-3">
                Write to us
              </Heading>
              {enquiryFormAvailable() ? (
                <>
                  <p className="mb-6 mt-2 text-ink-muted">
                    Send a message and it goes to the right team at the Ministry. You can also email{" "}
                    <a href={`mailto:${siteMeta.email}`} className="font-semibold text-cta underline underline-offset-2">
                      {siteMeta.email}
                    </a>
                    .
                  </p>
                  <EnquiryForm action={submitEnquiryAction} privacyHref={`${SITE_BASE_PATH}/privacy-policy`} />
                </>
              ) : (
                <>
                  <p className="mt-2 text-ink-muted">
                    For general enquiries, email{" "}
                    <a href={`mailto:${siteMeta.email}`} className="font-semibold text-cta underline underline-offset-2">
                      {siteMeta.email}
                    </a>
                    . Please include your name and a way to reach you.
                  </p>
                  <ButtonLink href={`mailto:${siteMeta.email}?subject=${encodeURIComponent("Enquiry from the website")}`} className="mt-5">
                    Email the Ministry
                  </ButtonLink>
                </>
              )}
            </div>

            <div className="rounded-card border border-border bg-surface-raised p-8 shadow-card">
              <FileText size={22} className="text-cta" aria-hidden />
              <Heading as="h2" size="h4" className="mt-3">
                Official correspondence
              </Heading>
              <p className="mt-2 text-ink-muted">
                Letters and formal submissions to the Honourable Minister or the Permanent Secretary go through the
                Ministry&rsquo;s electronic correspondence portal.
              </p>
              <ButtonLink href={ECMS_URL} external variant="outline-brand" className="mt-5">
                Ext. Corres. portal
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
