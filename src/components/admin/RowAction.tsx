"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import type { ActionState } from "@/lib/admin/action";

type Action = (state: ActionState, formData: FormData) => Promise<ActionState>;

function Button({ children, tone }: { children: React.ReactNode; tone: "neutral" | "danger" }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "rounded-control border px-2.5 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta disabled:opacity-50",
        tone === "danger" ? "border-border text-ink hover:border-red-600 hover:text-red-700" : "border-border text-ink hover:border-cta hover:text-cta"
      )}
    >
      {pending ? "…" : children}
    </button>
  );
}

/** A one-button form (Archive / Restore) that confirms first and shows any error right where it happened. */
export function RowAction({
  action,
  id,
  label,
  confirmMessage,
  tone = "neutral",
}: {
  action: Action;
  id: string;
  label: string;
  confirmMessage?: string;
  tone?: "neutral" | "danger";
}) {
  const [state, formAction] = useActionState(action, {} as ActionState);
  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (confirmMessage && !window.confirm(confirmMessage)) e.preventDefault();
      }}
      className="inline-flex flex-col items-end gap-1"
    >
      <input type="hidden" name="id" value={id} />
      <Button tone={tone}>{label}</Button>
      {state.error && (
        <p role="alert" className="max-w-xs text-right text-xs font-medium text-red-700">
          {state.error}
        </p>
      )}
    </form>
  );
}
