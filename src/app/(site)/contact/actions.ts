"use server";

import { headers } from "next/headers";
import { guard, type ActionState } from "@/lib/admin/action";
import { EnquiryLimitError, enquirySchema, submitEnquiry } from "@/lib/dal/enquiries";
import { enquiryFormAvailable, hashSender, senderIp } from "@/lib/enquiries-public";

const THANKS = "Thank you. Your message has been sent to the Ministry. We will reply to the email address you gave.";

/** A person cannot fill in this form in under this long; a script can. */
const FASTEST_HUMAN_MS = 2500;

/**
 * The public contact form. It is open to anyone, so: a hidden field only scripts
 * fill in, a minimum time to complete, and flood limits in `submitEnquiry`. A
 * message caught by the first two is dropped quietly (the sender is told it
 * worked, so scripts learn nothing); a genuine sender who hits a limit is told.
 */
export async function submitEnquiryAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (!enquiryFormAvailable()) return { error: "The contact form is not available yet. Please email the Ministry directly." };
  if (String(formData.get("company_website") ?? "").trim() !== "") return { ok: true, message: THANKS };
  const opened = Number(formData.get("openedAt"));
  if (Number.isFinite(opened) && opened > 0 && Date.now() - opened < FASTEST_HUMAN_MS) return { ok: true, message: THANKS };

  return guard(async () => {
    const input = enquirySchema.parse({
      topic: formData.get("topic"),
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone") ?? "",
      message: formData.get("message"),
    });
    try {
      await submitEnquiry(input, { ipHash: hashSender(senderIp(await headers())) });
    } catch (error) {
      if (error instanceof EnquiryLimitError) return { error: error.message };
      throw error;
    }
    return { ok: true, message: THANKS };
  });
}
