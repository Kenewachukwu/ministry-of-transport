import type { EmailMessage, EmailProvider } from "./provider";

/** Sends through Resend's HTTP API (no SDK needed). */
export class ResendEmailProvider implements EmailProvider {
  readonly name = "resend";
  constructor(
    private readonly apiKey: string,
    private readonly from: string,
    private readonly replyTo?: string
  ) {}

  async send(message: EmailMessage): Promise<void> {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
        // Retried requests (network blips) must not send the email twice.
        "Idempotency-Key": crypto.randomUUID(),
      },
      body: JSON.stringify({
        from: this.from,
        to: [message.to],
        subject: message.subject,
        html: message.html,
        text: message.text,
        ...(this.replyTo ? { reply_to: this.replyTo } : {}),
      }),
      signal: AbortSignal.timeout(10_000),
      cache: "no-store",
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      throw new Error(`Resend rejected the message (${response.status}): ${detail.slice(0, 300)}`);
    }
  }
}
