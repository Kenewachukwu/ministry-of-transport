import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { ActionForm, SubmitButton, TextArea } from "@/components/admin/form";
import { HelpLink } from "@/components/admin/help/HelpLink";
import { Notice, PageTitle, Panel } from "@/components/admin/ui";
import { enquiryTopicLabel } from "@/content/enquiryTopics";
import { requireSectionPage } from "@/lib/auth/dal";
import { getEnquiry } from "@/lib/dal/enquiries";
import { personNames } from "@/lib/dal/admin/crud";
import { updateEnquiryAction } from "../actions";

export const metadata: Metadata = { title: "Enquiry" };

const whenFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
const STATUS_WORDS = { new: "New", handled: "Handled", spam: "Spam" } as const;

export default async function EnquiryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  const user = await requireSectionPage("enquiries");
  const enquiry = await getEnquiry(user, id);
  if (!enquiry) notFound();
  const names = await personNames([enquiry.handledBy]);
  const topic = enquiryTopicLabel(enquiry.topic);
  const reply = `mailto:${enquiry.email}?subject=${encodeURIComponent(`Re: ${topic}`)}`;

  return (
    <>
      <PageTitle
        title={`${enquiry.name}: ${topic}`}
        description={`Received ${whenFmt.format(enquiry.createdAt)}`}
        actions={
          <>
            <HelpLink slug="handle-enquiries" />
            <Link href="/admin/enquiries" className="rounded-control border border-border px-3 py-2 text-sm font-semibold text-ink hover:border-cta hover:text-cta">← Back to the list</Link>
          </>
        }
      />

      {enquiry.emailStatus !== "sent" && (
        <Notice tone="warn">
          {enquiry.emailStatus === "failed" ? "The email notification to the team could not be sent" : "Email is not set up yet, so no notification was sent"}
          . This message is only stored here, so someone needs to check this list.
        </Notice>
      )}

      <Panel title="Message">
        <dl className="mb-5 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-[auto_1fr]">
          <dt className="font-semibold text-ink">From</dt>
          <dd className="text-ink-muted">{enquiry.name}</dd>
          <dt className="font-semibold text-ink">Email</dt>
          <dd><a href={reply} className="font-semibold text-cta underline underline-offset-2">{enquiry.email}</a></dd>
          {enquiry.phone && (
            <>
              <dt className="font-semibold text-ink">Telephone</dt>
              <dd className="text-ink-muted">{enquiry.phone}</dd>
            </>
          )}
          <dt className="font-semibold text-ink">About</dt>
          <dd className="text-ink-muted">{topic}</dd>
          {enquiry.routedTo && (
            <>
              <dt className="font-semibold text-ink">Sent to</dt>
              <dd className="text-ink-muted">{enquiry.routedTo}</dd>
            </>
          )}
        </dl>
        <p className="whitespace-pre-wrap break-words rounded-control bg-surface p-4 text-sm leading-relaxed text-ink">{enquiry.message}</p>
        <p className="mt-4">
          <a href={reply} className="inline-flex rounded-control bg-cta px-4 py-2 text-sm font-semibold text-cta-ink hover:bg-brand-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta">
            Reply by email
          </a>
        </p>
      </Panel>

      <Panel title="Status" className="mt-6">
        <p className="mb-4 text-sm text-ink-muted">
          <strong className="text-ink">{STATUS_WORDS[enquiry.status]}</strong>
          {enquiry.handledAt && (
            <>
              {" "}
              by {enquiry.handledBy ? (names.get(enquiry.handledBy) ?? "a colleague") : "a colleague"} on {whenFmt.format(enquiry.handledAt)}
            </>
          )}
          .
        </p>
        {enquiry.handlerNote && <p className="mb-4 whitespace-pre-wrap rounded-control border border-border px-4 py-3 text-sm text-ink">{enquiry.handlerNote}</p>}
        <ActionForm action={updateEnquiryAction}>
          <input type="hidden" name="id" value={id} />
          {enquiry.status === "new" ? (
            <>
              <TextArea name="note" label="Note (optional)" rows={2} maxLength={1000} help="For example: Replied by email on 21 October." />
              <div className="flex flex-wrap gap-3">
                <SubmitButton name="intent" value="handled">Mark as handled</SubmitButton>
                <SubmitButton name="intent" value="spam" variant="secondary">Mark as spam</SubmitButton>
              </div>
            </>
          ) : (
            <div>
              <SubmitButton name="intent" value="new" variant="secondary">Reopen</SubmitButton>
            </div>
          )}
        </ActionForm>
      </Panel>
    </>
  );
}
