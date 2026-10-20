import "server-only";
import { createHmac } from "node:crypto";
import { sessionSecret } from "@/lib/auth/config";
import { contentSource } from "@/lib/env";

/** Messages can only be stored when there is a database. Without one the contact page offers email instead of a form that would lose them. */
export const enquiryFormAvailable = (): boolean => contentSource() !== "static";

/** A salted, one-way hash of the sender's network address: enough to limit floods, useless for identifying anyone. */
export function hashSender(ip: string | null | undefined): string | null {
  if (!ip) return null;
  const key = sessionSecret() ?? new TextEncoder().encode("enquiry-flood-limit");
  return createHmac("sha256", key).update(`enquiry:${ip}`).digest("hex");
}

/** The sender's address as the hosting platform reports it (first entry of the forwarded list). */
export function senderIp(headers: Headers): string | null {
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip") || null;
}
