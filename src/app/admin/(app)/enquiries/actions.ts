"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { guard, type ActionState } from "@/lib/admin/action";
import { authorize } from "@/lib/auth/dal";
import { setEnquiryStatus } from "@/lib/dal/enquiries";

const MESSAGES = { handled: "Marked as handled.", spam: "Marked as spam. It stays in the Spam tab.", new: "Reopened. It is back under New." } as const;

/** Handled, spam or reopened, depending on which button was pressed. */
export async function updateEnquiryAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  return guard(async () => {
    const user = await authorize("enquiries");
    const { id, note } = z.object({ id: z.uuid(), note: z.string().max(1000).optional() }).parse(Object.fromEntries(formData));
    const intent = z.enum(["handled", "spam", "new"]).parse(formData.get("intent"));
    await setEnquiryStatus(user, id, intent, note);
    revalidatePath("/admin/enquiries");
    revalidatePath(`/admin/enquiries/${id}`);
    return { ok: true, message: MESSAGES[intent] };
  });
}
