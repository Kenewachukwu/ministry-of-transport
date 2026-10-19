/**
 * Declarative description of an editor form. These definitions are plain data
 * (no functions), so the same object drives the server-side parsing and the
 * client-side form without crossing the server/client boundary awkwardly.
 */
export interface RepeaterColumn {
  name: string;
  label: string;
  placeholder?: string;
  multiline?: boolean;
}

export type FieldDef = {
  name: string;
  label: string;
  help?: string;
  required?: boolean;
  /** Show this field only while another field has one of these values (e.g. "type" is "link"). */
  showWhen?: { field: string; in: string[] };
  /** Can't be changed after the item is created (URLs depend on it). */
  lockAfterCreate?: boolean;
} & (
  | { kind: "text"; inputType?: "text" | "url" | "date" | "number"; maxLength?: number; placeholder?: string }
  | { kind: "textarea"; rows?: number; maxLength?: number }
  /** Paragraphs separated by a blank line; stored as a list of strings. */
  | { kind: "paragraphs"; rows?: number }
  | { kind: "select"; options: { value: string; label: string }[] }
  | { kind: "checkbox" }
  /** A picture: link or upload. `altName` is the separate text field holding its description. */
  | { kind: "image"; altName?: string }
  /** A downloadable file (PDF / Word / Excel): upload or link. Sets the file name/size/type fields too. */
  | { kind: "file" }
  | { kind: "repeater"; columns: RepeaterColumn[]; addLabel?: string }
  /** Several pictures, each with a screen-reader description and an optional caption. */
  | { kind: "gallery"; addLabel?: string }
  /** Department-style blocks: heading, optional lead-in, and one item per line. */
  | { kind: "sections" }
);

export type FieldValues = Record<string, unknown>;
