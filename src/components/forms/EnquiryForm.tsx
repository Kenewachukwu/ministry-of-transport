"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ActionForm, Field, SelectField, SubmitButton, TextArea } from "@/components/admin/form";
import type { ActionState } from "@/lib/admin/action";
import { ENQUIRY_TOPICS } from "@/content/enquiryTopics";

type Action = (state: ActionState, formData: FormData) => Promise<ActionState>;

/**
 * The public contact form. It reuses the admin's form parts (labels, errors that
 * keep what you typed, a button that cannot be pressed twice) so it behaves the
 * same way. `openedAt` is stamped when the page loads; the server uses it to
 * turn away scripts that submit instantly.
 */
export function EnquiryForm({ action, privacyHref }: { action: Action; privacyHref: string }) {
  const opened = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (opened.current) opened.current.value = String(Date.now());
  }, []);

  return (
    <ActionForm action={action} resetOnSuccess>
      <input ref={opened} type="hidden" name="openedAt" defaultValue="" />
      {/* A trap for scripts: people never see or fill this in. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Leave this empty
          <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <SelectField name="topic" label="What is your message about?" options={ENQUIRY_TOPICS.map((t) => ({ value: t.id, label: t.label }))} required />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="name" label="Your name" autoComplete="name" required maxLength={120} />
        <Field name="email" label="Your email address" type="email" autoComplete="email" required maxLength={254} help="We reply to this address." />
      </div>
      <Field name="phone" label="Telephone number (optional)" autoComplete="tel" maxLength={30} />
      <TextArea name="message" label="Your message" rows={6} required maxLength={4000} help="Please include any reference numbers or the address of the page you are asking about." />
      <p className="text-xs text-ink-muted">
        We use what you send only to deal with your message. Read our{" "}
        <Link href={privacyHref} className="font-semibold text-cta underline underline-offset-2">
          privacy policy
        </Link>
        .
      </p>
      <div>
        <SubmitButton>Send message</SubmitButton>
      </div>
    </ActionForm>
  );
}
