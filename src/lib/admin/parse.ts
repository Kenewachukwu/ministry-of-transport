import type { FieldDef, FieldValues } from "./fields";

function json(raw: FormDataEntryValue | null): unknown {
  try {
    return JSON.parse(String(raw ?? "[]"));
  } catch {
    return [];
  }
}

/** Turns submitted form data into plain values, per the field definitions (validation happens next, in zod). */
export function parseFields(fields: FieldDef[], formData: FormData): FieldValues {
  const out: FieldValues = {};
  for (const f of fields) {
    const raw = formData.get(f.name);
    switch (f.kind) {
      case "checkbox":
        out[f.name] = raw === "on";
        break;
      case "paragraphs":
        out[f.name] = String(raw ?? "")
          .split(/\n\s*\n/)
          .map((p) => p.trim())
          .filter(Boolean);
        break;
      case "repeater":
      case "gallery":
      case "sections":
        out[f.name] = json(raw);
        break;
      case "textarea":
        out[f.name] = String(raw ?? "").replace(/\r\n/g, "\n").trim();
        break;
      default:
        out[f.name] = String(raw ?? "").trim();
    }
  }
  return out;
}

/** Row → what the form shows initially. */
export function toFormValues(fields: FieldDef[], row: Record<string, unknown>): FieldValues {
  const out: FieldValues = { ...row };
  for (const f of fields) {
    if (f.kind === "paragraphs") out[f.name] = Array.isArray(row[f.name]) ? (row[f.name] as string[]).join("\n\n") : "";
  }
  return out;
}
