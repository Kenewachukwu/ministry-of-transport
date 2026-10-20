import { DIRECT_SECTIONS, SECTIONS, SECTION_LABELS, type Section } from "@/lib/auth/permissions";

const box = "h-4 w-4 accent-[var(--color-cta)]";

/**
 * One row per content section with two ticks: may EDIT it, and may PUBLISH in it.
 * Publishing includes editing (the server enforces it), so ticking Publish alone is fine.
 * Sections made of fixed text (see DIRECT_SECTIONS) have no drafts, so they offer Publish only.
 * Ignored for super administrators, who can do everything.
 */
export function PermissionGrid({ editSelected = [], publishSelected = [] }: { editSelected?: Section[]; publishSelected?: Section[] }) {
  return (
    <fieldset className="rounded-control border border-border p-4">
      <legend className="px-1 text-sm font-semibold text-ink">Sections this person can manage</legend>
      <p className="mb-3 text-xs text-ink-muted">
        <strong>Edit</strong> lets them write drafts and propose changes. <strong>Publish</strong> lets them approve other people&rsquo;s work, put changes on the website, archive and re-arrange. Publishing includes editing. Where a section is a few fixed pieces of text, only Publish is offered, because those changes go live as soon as they are saved. Super administrators can do everything regardless.
      </p>
      <table className="w-full text-left text-sm">
        <thead className="text-xs uppercase tracking-wide text-ink-muted">
          <tr>
            <th scope="col" className="py-1.5 pr-3 font-semibold">Section</th>
            <th scope="col" className="w-20 py-1.5 text-center font-semibold">Edit</th>
            <th scope="col" className="w-20 py-1.5 text-center font-semibold">Publish</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {SECTIONS.map((section) => {
            const direct = DIRECT_SECTIONS.includes(section);
            return (
              <tr key={section}>
                <th scope="row" className="py-2 pr-3 font-medium text-ink">{SECTION_LABELS[section]}</th>
                <td className="text-center">
                  {direct ? (
                    <span aria-hidden className="text-ink-muted">&ndash;</span>
                  ) : (
                    <input type="checkbox" name="permissions" value={section} defaultChecked={editSelected.includes(section) || publishSelected.includes(section)} className={box} aria-label={`Can edit ${SECTION_LABELS[section]}`} />
                  )}
                </td>
                <td className="text-center">
                  <input type="checkbox" name="publish" value={section} defaultChecked={publishSelected.includes(section)} className={box} aria-label={`Can publish in ${SECTION_LABELS[section]}`} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </fieldset>
  );
}
