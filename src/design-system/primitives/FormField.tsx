import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function FormField({
  label,
  id,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; id: string }) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-semibold text-ink">
        {label}
      </label>
      <input
        id={id}
        className="rounded-control border border-border bg-surface-raised px-4 py-2.5 text-ink placeholder:text-ink-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta"
        {...props}
      />
    </div>
  );
}
