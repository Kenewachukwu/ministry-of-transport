"use client";

import { useState } from "react";
import { ActionForm, CheckboxField, Field, SelectField, SubmitButton, TextArea, UnsavedNote, useFieldError } from "./form";
import { GalleryField, MediaField, RepeaterField, SectionsField } from "./fields";
import type { FieldDef } from "@/lib/admin/fields";
import type { ActionState } from "@/lib/admin/action";
import type { UploadMode } from "@/lib/storage/client";

type Action = (state: ActionState, formData: FormData) => Promise<ActionState>;
type Values = Record<string, unknown>;

const str = (v: unknown) => (v === null || v === undefined ? "" : String(v));

function MediaWithError({ def, value, mode, uploadMode }: { def: FieldDef; value: unknown; mode: "image" | "file"; uploadMode: UploadMode }) {
  const error = useFieldError(def.name);
  return <MediaField name={def.name} label={def.label} help={def.help} required={def.required} defaultValue={str(value)} error={error} mode={mode} uploadMode={uploadMode} />;
}

/**
 * The editor form for any content type, built from its field definitions.
 * Fields can appear only for certain values of another field (an event's
 * location, a link's address), and fields that must never change after
 * creation (a block's type) are shown but locked.
 */
export function EntityForm({
  action,
  fields,
  initial,
  id,
  version,
  uploadMode,
  submitLabel,
}: {
  action: Action;
  fields: FieldDef[];
  initial: Values;
  id?: string;
  version?: number;
  uploadMode: UploadMode;
  submitLabel: string;
}) {
  const isEdit = Boolean(id);
  const watchedNames = new Set(fields.flatMap((f) => (f.showWhen ? [f.showWhen.field] : [])));
  const [watched, setWatched] = useState<Record<string, string>>(() => Object.fromEntries([...watchedNames].map((n) => [n, str(initial[n])])));

  return (
    <ActionForm
      action={action}
      warnOnLeave
      // One handler at the form level keeps the "show when" fields in step with their controlling field.
    >
      <div
        className="flex flex-col gap-5"
        onChange={(e) => {
          const t = e.target as HTMLInputElement | HTMLSelectElement;
          if (t.name && watchedNames.has(t.name)) setWatched((w) => ({ ...w, [t.name]: t.value }));
        }}
      >
        {id && <input type="hidden" name="id" value={id} />}
        {version !== undefined && <input type="hidden" name="version" value={version} />}

        {fields.map((f) => {
          if (f.showWhen && !f.showWhen.in.includes(watched[f.showWhen.field] ?? "")) return null;
          const value = initial[f.name];
          const locked = isEdit && f.lockAfterCreate;

          if (locked) {
            return (
              <div key={f.name} className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-ink">{f.label}</span>
                <span className="text-sm text-ink-muted">
                  {f.kind === "select" ? (f.options.find((o) => o.value === str(value))?.label ?? str(value)) : str(value)} <span className="text-xs">(can&rsquo;t be changed once created)</span>
                </span>
                <input type="hidden" name={f.name} value={str(value)} />
              </div>
            );
          }

          switch (f.kind) {
            case "text":
              return <Field key={f.name} name={f.name} label={f.label} type={f.inputType ?? "text"} defaultValue={str(value)} required={f.required} help={f.help} maxLength={f.maxLength} placeholder={f.placeholder} />;
            case "textarea":
              return <TextArea key={f.name} name={f.name} label={f.label} defaultValue={str(value)} required={f.required} help={f.help} rows={f.rows} maxLength={f.maxLength} />;
            case "paragraphs":
              return <TextArea key={f.name} name={f.name} label={f.label} defaultValue={str(value)} required={f.required} help={f.help} rows={f.rows ?? 6} />;
            case "select":
              return <SelectField key={f.name} name={f.name} label={f.label} options={f.options} defaultValue={str(value) || f.options[0]?.value} required={f.required} help={f.help} />;
            case "checkbox":
              return <CheckboxField key={f.name} name={f.name} label={f.label} defaultChecked={Boolean(value)} help={f.help} />;
            case "image":
              return <MediaWithError key={f.name} def={f} value={value} mode="image" uploadMode={uploadMode} />;
            case "file":
              return <MediaWithError key={f.name} def={f} value={value} mode="file" uploadMode={uploadMode} />;
            case "repeater":
              return <RepeaterField key={f.name} name={f.name} label={f.label} help={f.help} columns={f.columns} initial={(value as Record<string, string>[]) ?? []} addLabel={f.addLabel} />;
            case "gallery":
              return <GalleryField key={f.name} name={f.name} label={f.label} help={f.help} initial={(value as { src: string; alt: string; caption?: string }[]) ?? []} uploadMode={uploadMode} addLabel={f.addLabel} />;
            case "sections":
              return <SectionsField key={f.name} name={f.name} label={f.label} help={f.help} initial={(value as { heading: string; note?: string; items: string[] }[]) ?? []} />;
          }
        })}

        <div className="flex flex-wrap items-center gap-4">
          <SubmitButton>{submitLabel}</SubmitButton>
          <UnsavedNote />
        </div>
      </div>
    </ActionForm>
  );
}
