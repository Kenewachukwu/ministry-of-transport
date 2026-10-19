"use client";

import { useActionState, useId, useRef } from "react";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import type { ActionState } from "@/lib/admin/action";

type Action = (state: ActionState, formData: FormData) => Promise<ActionState>;
type Tone = "neutral" | "danger";

const buttonClasses = (tone: Tone) =>
  cn(
    "rounded-control border px-2.5 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta disabled:opacity-50",
    tone === "danger" ? "border-border text-ink hover:border-red-600 hover:text-red-700" : "border-border text-ink hover:border-cta hover:text-cta"
  );

function SubmitButton({ children, tone, className }: { children: React.ReactNode; tone: Tone; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={cn(buttonClasses(tone), className)}>
      {pending ? "…" : children}
    </button>
  );
}

/**
 * A one-button form (Archive / Restore) that shows any error right where it
 * happened. With `confirmMessage`, pressing the button opens a modal dialog
 * (an accessible, keyboard-friendly box that traps focus and closes with Esc)
 * instead of the browser's plain confirm box. "Cancel" is focused first, so an
 * accidental Enter never archives anything.
 */
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
  tone?: Tone;
}) {
  const [state, formAction] = useActionState(action, {} as ActionState);
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  return (
    <form action={formAction} onSubmit={() => dialog.current?.close()} className="inline-flex flex-col items-end gap-1">
      <input type="hidden" name="id" value={id} />
      {confirmMessage ? (
        <>
          <button type="button" onClick={() => dialog.current?.showModal()} className={buttonClasses(tone)}>
            {label}
          </button>
          <dialog
            ref={dialog}
            aria-labelledby={titleId}
            className="m-auto w-[min(26rem,calc(100vw-2rem))] rounded-card border border-border bg-surface-raised p-6 text-left text-ink shadow-card backdrop:bg-black/40"
          >
            <p id={titleId} className="text-sm leading-relaxed text-ink">
              {confirmMessage}
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" autoFocus onClick={() => dialog.current?.close()} className={buttonClasses("neutral")}>
                Cancel
              </button>
              <SubmitButton tone={tone} className={tone === "danger" ? "border-red-700 bg-red-700 text-white hover:border-red-800 hover:bg-red-800 hover:text-white" : undefined}>
                {label}
              </SubmitButton>
            </div>
          </dialog>
        </>
      ) : (
        <SubmitButton tone={tone}>{label}</SubmitButton>
      )}
      {state.error && (
        <p role="alert" className="max-w-xs text-right text-xs font-medium text-red-700">
          {state.error}
        </p>
      )}
    </form>
  );
}
