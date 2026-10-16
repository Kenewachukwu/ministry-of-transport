"use client";

import { createContext, useActionState, useContext, useState, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { Copy, Check } from "lucide-react";
import { Button } from "@/design-system/primitives/Button";
import { cn } from "@/lib/utils";
import type { ActionState } from "@/lib/admin/action";

type Action = (state: ActionState, formData: FormData) => Promise<ActionState>;

const FormStateContext = createContext<ActionState>({});

const inputClasses =
  "w-full rounded-control border border-border bg-surface-raised px-3.5 py-2.5 text-ink placeholder:text-ink-muted/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta disabled:opacity-60 aria-[invalid=true]:border-red-600";

/**
 * A form wired to a Server Action. Shows the action's message or error above
 * the fields (announced to screen readers), passes field-level errors down to
 * its fields, and reveals one-time secrets (invitation links) for copying.
 */
export function ActionForm({
  action,
  children,
  className,
}: {
  action: Action;
  children: ReactNode;
  className?: string;
}) {
  const [state, formAction] = useActionState(action, {} as ActionState);
  return (
    <FormStateContext.Provider value={state}>
      <form action={formAction} className={cn("flex flex-col gap-5", className)} noValidate>
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
        {children}
      </form>
    </FormStateContext.Provider>
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
  const { pending } = useFormStatus();
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
