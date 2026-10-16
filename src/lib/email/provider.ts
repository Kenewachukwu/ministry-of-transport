import "server-only";
import { ConsoleEmailProvider } from "./console";
import { ResendEmailProvider } from "./resend";

export interface EmailMessage {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export interface EmailProvider {
  readonly name: string;
  send(message: EmailMessage): Promise<void>;
}

/**
 * Resend when RESEND_API_KEY and EMAIL_FROM are set. With neither, development
 * prints the message (so invite links are visible in the terminal). In
 * production with neither, there is no provider: callers show the link to the
 * administrator instead, and never silently drop a message.
 */
export function getEmailProvider(env: NodeJS.ProcessEnv = process.env): EmailProvider | null {
  if (env.RESEND_API_KEY && env.EMAIL_FROM) {
    return new ResendEmailProvider(env.RESEND_API_KEY, env.EMAIL_FROM, env.EMAIL_REPLY_TO);
  }
  if (env.NODE_ENV !== "production") return new ConsoleEmailProvider();
  return null;
}
