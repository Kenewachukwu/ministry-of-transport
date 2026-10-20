import type { FieldDef } from "./fields";
import { toFormValues } from "./parse";
import { effectiveRow } from "./workflow";
import type { EntityDef, Row } from "./registry";

export interface FieldChange {
  name: string;
  label: string;
  kind: FieldDef["kind"];
  /** Readable text; may span several lines. */
  before: string;
  after: string;
  /** For picture fields: the links themselves, so a reviewer can see the picture. */
  beforeImage?: string;
  afterImage?: string;
}

const EMPTY = "(empty)";

const lines = (parts: string[]) => (parts.length ? parts.join("\n") : EMPTY);

/** A value, as a person would read it. */
export function describeValue(field: FieldDef, value: unknown): string {
  if (value === null || value === undefined || value === "") return EMPTY;
  switch (field.kind) {
    case "checkbox":
      return value ? "Yes" : "No";
    case "select":
      return field.options.find((o) => o.value === String(value))?.label ?? String(value);
    case "repeater": {
      const rows = Array.isArray(value) ? (value as Record<string, string>[]) : [];
      return lines(rows.map((r) => field.columns.map((c) => r[c.name]).filter(Boolean).join(" · ")));
    }
    case "gallery": {
      const items = Array.isArray(value) ? (value as { src: string; alt: string; caption?: string }[]) : [];
      return items.length === 0 ? EMPTY : lines([`${items.length} ${items.length === 1 ? "picture" : "pictures"}`, ...items.map((p) => `• ${p.alt}${p.caption ? ` — ${p.caption}` : ""} (${p.src.split("/").pop()})`)]);
    }
    case "sections": {
      const blocks = Array.isArray(value) ? (value as { heading: string; note?: string; items: string[] }[]) : [];
      return lines(blocks.map((b) => `${b.heading}: ${b.items.join("; ")}`));
    }
    default:
      return String(value);
  }
}

const same = (a: unknown, b: unknown) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
const imageOf = (field: FieldDef, value: unknown) => (field.kind === "image" && typeof value === "string" && value ? value : undefined);

/**
 * What a publisher is being asked to approve. For proposed changes to a live item,
 * only the fields that differ, as before/after. For a new item (nothing live to
 * compare with), every filled-in field, with `before` left empty.
 */
export function describeChanges(def: EntityDef, row: Row): { isNew: boolean; changes: FieldChange[] } {
  const isNew = row.status === "draft" || row.status === "pending";
  const liveForm = toFormValues(def.fields, def.fromRow ? def.fromRow(row) : row);
  const wantedRow = effectiveRow(row);
  const wantedForm = toFormValues(def.fields, def.fromRow ? def.fromRow(wantedRow) : wantedRow);
  const changes: FieldChange[] = [];

  for (const f of def.fields) {
    const before = isNew ? undefined : liveForm[f.name];
    const after = wantedForm[f.name];
    if (isNew ? describeValue(f, after) === EMPTY : same(before, after)) continue;
    changes.push({
      name: f.name,
      label: f.label,
      kind: f.kind,
      before: isNew ? EMPTY : describeValue(f, before),
      after: describeValue(f, after),
      beforeImage: isNew ? undefined : imageOf(f, before),
      afterImage: imageOf(f, after),
    });
  }
  return { isNew, changes };
}
