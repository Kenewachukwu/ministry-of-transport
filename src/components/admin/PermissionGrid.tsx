import { CheckboxField } from "./form";
import { SECTIONS, SECTION_LABELS, type Section } from "@/lib/auth/permissions";

/** One checkbox per content section. Ignored for super administrators, who can manage everything. */
export function PermissionGrid({ selected = [] }: { selected?: Section[] }) {
  return (
    <fieldset className="rounded-control border border-border p-4">
      <legend className="px-1 text-sm font-semibold text-ink">Sections this person can manage</legend>
      <p className="mb-3 text-xs text-ink-muted">Content editors only see and change the sections ticked here. Super administrators can manage everything regardless.</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {SECTIONS.map((section) => (
          <CheckboxField key={section} name="permissions" value={section} label={SECTION_LABELS[section]} defaultChecked={selected.includes(section)} />
        ))}
      </div>
    </fieldset>
  );
}
