"use client";

import { useState, type FormEvent } from "react";
import { Mail, Phone, MapPin, Clock, CheckCircle2 } from "lucide-react";
import { Container } from "@/design-system/primitives/Container";
import { PageHeader } from "./PageHeader";
import { FormField } from "@/design-system/primitives/FormField";
import { Button } from "@/design-system/primitives/Button";
import { SocialLinks } from "@/components/layout/Footer/SocialLinks";
import { siteMeta } from "@/content/siteMeta";

export function ContactTemplate() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
  }

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
            <div className="flex items-start gap-3">
              <Phone size={18} className="mt-0.5 shrink-0 text-cta" aria-hidden />
              <a href={`tel:${siteMeta.phone}`} className="text-ink-muted hover:text-cta">
                {siteMeta.phone}
              </a>
            </div>
            <div className="flex items-start gap-3">
              <Mail size={18} className="mt-0.5 shrink-0 text-cta" aria-hidden />
              <a href={`mailto:${siteMeta.email}`} className="text-ink-muted hover:text-cta">
                {siteMeta.email}
              </a>
            </div>
            <SocialLinks className="mt-2 flex gap-3 [&_a]:border-border [&_a]:text-ink-muted [&_a:hover]:border-cta [&_a:hover]:text-cta" />
          </div>

          <div className="rounded-card border border-border bg-surface-raised p-8 shadow-card">
            {sent ? (
              <div className="flex flex-col items-center gap-3 py-10 text-center">
                <CheckCircle2 size={40} className="text-cta" aria-hidden />
                <p className="font-display text-lg font-semibold text-ink">Message received</p>
                <p className="text-sm text-ink-muted">
                  This is a prototype form — no message was actually sent. A production build would
                  route this to the Ministry's real feedback inbox.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <FormField id="name" label="Full name" required />
                <FormField id="email" type="email" label="Email address" required />
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="message" className="text-sm font-semibold text-ink">
                    Message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    className="rounded-control border border-border bg-surface px-4 py-2.5 text-ink placeholder:text-ink-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta"
                  />
                </div>
                <Button type="submit" className="mt-2 self-start">
                  Send Message
                </Button>
              </form>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
