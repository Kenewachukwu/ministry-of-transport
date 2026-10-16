import type { EmailMessage, EmailProvider } from "./provider";

/** Development stand-in: prints the message, including its links, to the server console. */
export class ConsoleEmailProvider implements EmailProvider {
  readonly name = "console";
  async send(message: EmailMessage): Promise<void> {
    console.info(`\n──────── EMAIL (console provider) ────────\nTo: ${message.to}\nSubject: ${message.subject}\n\n${message.text}\n───────────────────────────────────────────\n`);
  }
}
