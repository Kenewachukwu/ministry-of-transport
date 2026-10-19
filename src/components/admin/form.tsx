"use client";

import { createContext, startTransition, useActionState, useCallback, useContext, useEffect, useRef, useState, type FormEvent, type RefObject, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { Copy, Check } from "lucide-react";
import { Button } from "@/design-system/primitives/Button";
import { cn } from "@/lib/utils";
import type { ActionState } from "@/lib/admin/action";
import { LEAVE_MESSAGE, serializeEntries } from "@/lib/admin/dirty";

type Action = (state: ActionState, formData: FormData) => Promise<ActionState>;

const FormStateContext = createContext<ActionState>({});
const DirtyContext = createContext(false);
const PendingContext = createContext(false);

const inputClasses =
  "w-full rounded-control border border-border bg-surface-raised px-3.5 py-2.5 text-ink placeholder:text-ink-muted/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta disabled:opacity-60 aria-[invalid=true]:border-red-600";

const formSnapshot = (form: HTMLFormElement) => serializeEntries(new FormData(form).entries());

/**
 * Watches a form for unsaved changes. Custom fields (repeaters, pictures) keep
 * their value in React state behind a hidden input, which never fires a DOM
 * event, so besides listening for input/change/click it re-checks every
 * moment. Returns whether anything differs from the last load or save, and,
 * while it does, asks before the page is left (closing the tab, or clicking a
 * link inside the admin).
 */
function useUnsavedChanges(formRef: RefObject<HTMLFormElement | null>, enabled: boolean, state: ActionState): boolean {
  const baseline = useRef<string | null>(null);
  const [dirty, setDirty] = useState(false);

  const check = useCallback(() => {
    const form = formRef.current;
    if (!form || baseline.current === null) return;
    setDirty(formSnapshot(form) !== baseline.current);
  }, [formRef]);

  // The "clean" picture is taken just after the first paint, and again after every SUCCESSFUL save
  // (never after an error: the person's changes are still unsaved).
  const takeBaseline = useCallback(() => {
    const form = formRef.current;
    if (!form) return;
    baseline.current = formSnapshot(form);
    setDirty(false);
  }, [formRef]);

  useEffect(() => {
    if (!enabled) return;
    const timer = setTimeout(takeBaseline, 0);
    return () => clearTimeout(timer);
  }, [enabled, takeBaseline]);

  const savedOk = Boolean(!state.error && (state.ok || state.message));
  useEffect(() => {
    if (!enabled || !savedOk) return;
    const timer = setTimeout(takeBaseline, 0);
    return () => clearTimeout(timer);
  }, [enabled, savedOk, state, takeBaseline]);

  useEffect(() => {
    const form = formRef.current;
    if (!enabled || !form) return;
    const soon = () => setTimeout(check, 0);
    form.addEventListener("input", soon);
    form.addEventListener("change", soon);
    form.addEventListener("click", soon);
    const poll = setInterval(check, 800);
    return () => {
      form.removeEventListener("input", soon);
      form.removeEventListener("change", soon);
      form.removeEventListener("click", soon);
      clearInterval(poll);
    };
  }, [enabled, check, formRef]);

  useEffect(() => {
    if (!enabled || !dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!link || link.target === "_blank" || link.hasAttribute("download")) return;
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return; // leaving the site is covered by beforeunload
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;
      if (!window.confirm(LEAVE_MESSAGE)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      document.removeEventListener("click", onClick, true);
    };
  }, [enabled, dirty]);

  return enabled && dirty;
}

/**
 * A form wired to a Server Action. Shows the action's message or error above
 * the fields, passes field-level errors down to its fields, and reveals
 * one-time secrets (invitation links) for copying.
 *
 * Long forms submit from the bottom while the result appears at the top, so
 * after every submit the result (or the first field with a problem) is scrolled
 * into view and focused, which also makes screen readers announce it.
 *
 * The form is submitted with `startTransition` rather than the form's `action`
 * attribute on purpose: React 19 RESETS uncontrolled fields after an action
 * finishes, including when it only returned a validation error, which wiped
 * whatever the person had typed. Here a failed save leaves their text alone.
 * Forms that should clear after success (inviting someone, changing a password)
 * say so with `resetOnSuccess`.
 *
 * `warnOnLeave` turns on the unsaved-changes guard; use it for editing forms,
 * not for sign-in style forms.
 */
export function ActionForm({
  action,
  children,
  className,
  warnOnLeave = false,
  resetOnSuccess = false,
}: {
  action: Action;
  children: ReactNode;
  className?: string;
  warnOnLeave?: boolean;
  resetOnSuccess?: boolean;
}) {
  const [state, formAction, pending] = useActionState(action, {} as ActionState);
  const formRef = useRef<HTMLFormElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const dirty = useUnsavedChanges(formRef, warnOnLeave, state);

  useEffect(() => {
    if (!(state.error || state.message || state.reveal)) return;
    const firstBad = state.fieldErrors ? Object.keys(state.fieldErrors)[0] : undefined;
    const field = firstBad ? formRef.current?.querySelector<HTMLElement>(`[name="${CSS.escape(firstBad)}"]`) : null;
    const target = field ?? messageRef.current;
    if (!target) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
    target.focus({ preventScroll: true });
  }, [state]);

  const succeeded = Boolean(!state.error && (state.ok || state.message));
  useEffect(() => {
    if (resetOnSuccess && succeeded) formRef.current?.reset();
  }, [resetOnSuccess, succeeded, state]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const submitter = (event.nativeEvent as SubmitEvent).submitter;
    const data = new FormData(event.currentTarget, submitter);
    startTransition(() => formAction(data));
  }

  return (
    <FormStateContext.Provider value={state}>
      <PendingContext.Provider value={pending}>
      <DirtyContext.Provider value={dirty}>
        <form ref={formRef} onSubmit={onSubmit} className={cn("flex flex-col gap-5", className)} noValidate>
          {(state.error || state.message || state.reveal) && (
            <div ref={messageRef} tabIndex={-1} className="flex flex-col gap-5 outline-none">
              {state.error && (
                <p role="alert" className="rounded-control border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                  {state.error}
                </p>
              )}
              {state.message && (
                <p role="status" className="rounded-control border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-800">
                  {state.message}
                </p>
              )}
              {state.reveal && <RevealBox label={state.reveal.label} value={state.reveal.value} />}
            </div>
          )}
          {children}
        </form>
      </DirtyContext.Provider>
      </PendingContext.Provider>
    </FormStateContext.Provider>
  );
}

/** "You have unsaved changes", shown beside the Save button while the form differs from what is saved. */
export function UnsavedNote() {
  const dirty = useContext(DirtyContext);
  if (!dirty) return null;
  return (
    <p role="status" className="text-sm font-medium text-amber-800">
      You have unsaved changes.
    </p>
  );
}

function RevealBox({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="rounded-control border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
      <p className="font-semibold">{label}</p>
      <p className="mt-1 text-xs">This is shown once. Copy it now and send it to the person yourself.</p>
      <div className="mt-3 flex items-center gap-2">
        <input readOnly value={value} aria-label={label} className={cn(inputClasses, "font-mono text-xs")} onFocus={(e) => e.currentTarget.select()} />
        <button
          type="button"
          onClick={async () => {
            await navigator.clipboard?.writeText(value);
            setCopied(true);
          }}
          className="inline-flex shrink-0 items-center gap-1 rounded-control border border-amber-400 bg-white px-3 py-2 text-xs font-semibold hover:bg-amber-100"
        >
          {copied ? <Check size={14} aria-hidden /> : <Copy size={14} aria-hidden />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}

export function SubmitButton({
  children,
  variant = "primary",
  className,
}: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
}) {
  const { pending: formPending } = useFormStatus();
  const submitting = useContext(PendingContext);
  const pending = formPending || submitting;
  return (
    <Button type="submit" variant={variant} disabled={pending} aria-busy={pending} className={className}>
      {pending ? "Working…" : children}
    </Button>
  );
}

export function useFieldError(name: string): string | undefined {
  return useContext(FormStateContext).fieldErrors?.[name];
}

function FieldShell({
  id,
  label,
  help,
  error,
  required,
  children,
  className,
}: {
  id: string;
  label: string;
  help?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-semibold text-ink">
        {label}
        {required && <span className="text-red-700" aria-hidden> *</span>}
      </label>
      {children}
      {help && !error && (
        <p id={`${id}-help`} className="text-xs text-ink-muted">
          {help}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-xs font-medium text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

const describe = (id: string, help?: string, error?: string) =>
  error ? `${id}-error` : help ? `${id}-help` : undefined;

export function Field({
  name,
  label,
  type = "text",
  defaultValue,
  required,
  help,
  placeholder,
  autoComplete,
  maxLength,
  className,
  readOnly,
}: {
  name: string;
  label: string;
  type?: "text" | "email" | "password" | "url" | "date" | "number";
  defaultValue?: string | number | null;
  required?: boolean;
  help?: string;
  placeholder?: string;
  autoComplete?: string;
  maxLength?: number;
  className?: string;
  readOnly?: boolean;
}) {
  const error = useFieldError(name);
  const id = `f-${name}`;
  return (
    <FieldShell id={id} label={label} help={help} error={error} required={required} className={className}>
      <input
        id={id}
        name={name}
        type={type}
        defaultValue={defaultValue ?? ""}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        maxLength={maxLength}
        readOnly={readOnly}
        aria-invalid={error ? true : undefined}
        aria-describedby={describe(id, help, error)}
        className={inputClasses}
      />
    </FieldShell>
  );
}

export function TextArea({
  name,
  label,
  defaultValue,
  required,
  help,
  rows = 4,
  maxLength,
  className,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  required?: boolean;
  help?: string;
  rows?: number;
  maxLength?: number;
  className?: string;
}) {
  const error = useFieldError(name);
  const id = `f-${name}`;
  return (
    <FieldShell id={id} label={label} help={help} error={error} required={required} className={className}>
      <textarea
        id={id}
        name={name}
        rows={rows}
        defaultValue={defaultValue ?? ""}
        required={required}
        maxLength={maxLength}
        aria-invalid={error ? true : undefined}
        aria-describedby={describe(id, help, error)}
        className={cn(inputClasses, "leading-relaxed")}
      />
    </FieldShell>
  );
}

export function SelectField({
  name,
  label,
  options,
  defaultValue,
  help,
  required,
  className,
}: {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  defaultValue?: string | null;
  help?: string;
  required?: boolean;
  className?: string;
}) {
  const error = useFieldError(name);
  const id = `f-${name}`;
  return (
    <FieldShell id={id} label={label} help={help} error={error} required={required} className={className}>
      <select
        id={id}
        name={name}
        defaultValue={defaultValue ?? options[0]?.value}
        aria-invalid={error ? true : undefined}
        aria-describedby={describe(id, help, error)}
        className={inputClasses}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

export function CheckboxField({
  name,
  label,
  defaultChecked,
  help,
  value = "on",
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
  help?: string;
  value?: string;
}) {
  const id = `f-${name}-${value}`;
  return (
    <div className="flex items-start gap-3">
      <input id={id} name={name} type="checkbox" value={value} defaultChecked={defaultChecked} className="mt-1 h-4 w-4 accent-[var(--color-cta)]" />
      <label htmlFor={id} className="text-sm text-ink">
        <span className="font-semibold">{label}</span>
        {help && <span className="block text-xs text-ink-muted">{help}</span>}
      </label>
    </div>
  );
}

export { inputClasses };
