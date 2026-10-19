"use client";

import { useId, useState } from "react";
import { ArrowDown, ArrowUp, FileText, ImageIcon, Plus, Trash2, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RepeaterColumn } from "@/lib/admin/fields";
import { uploadFile, type UploadMode } from "@/lib/storage/client";
import { inputClasses, useFieldError } from "./form";

type Row = Record<string, string>;

const smallButton =
  "inline-flex items-center gap-1 rounded-control border border-border bg-surface-raised px-2.5 py-1.5 text-xs font-semibold text-ink transition-colors hover:border-cta hover:text-cta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta disabled:opacity-40";

function Label({ id, children, help }: { id?: string; children: React.ReactNode; help?: string }) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-ink">
        {children}
      </label>
      {help && <p className="mt-0.5 text-xs text-ink-muted">{help}</p>}
    </div>
  );
}

function moveItem<T>(list: T[], from: number, to: number): T[] {
  if (to < 0 || to >= list.length) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

/* ---------- repeating rows (biography details, targets) -------------------------------------------- */

export function RepeaterField({
  name,
  label,
  help,
  columns,
  initial,
  addLabel = "Add another",
}: {
  name: string;
  label: string;
  help?: string;
  columns: RepeaterColumn[];
  initial: Row[];
  addLabel?: string;
}) {
  const [rows, setRows] = useState<Row[]>(initial ?? []);
  const set = (i: number, key: string, value: string) => setRows((r) => r.map((row, j) => (j === i ? { ...row, [key]: value } : row)));
  const blank = () => Object.fromEntries(columns.map((c) => [c.name, ""])) as Row;
  const baseId = useId();

  return (
    <div className="flex flex-col gap-2">
      <Label help={help}>{label}</Label>
      <input type="hidden" name={name} value={JSON.stringify(rows)} />
      <ul className="flex flex-col gap-3">
        {rows.map((row, i) => (
          <li key={i} className="rounded-control border border-border bg-surface p-3">
            <div className="grid gap-3 sm:grid-cols-2">
              {columns.map((c) => {
                const id = `${baseId}-${i}-${c.name}`;
                return (
                  <div key={c.name} className={cn("flex flex-col gap-1", c.multiline && "sm:col-span-2")}>
                    <label htmlFor={id} className="text-xs font-semibold text-ink-muted">
                      {c.label}
                    </label>
                    {c.multiline ? (
                      <textarea id={id} rows={2} value={row[c.name] ?? ""} placeholder={c.placeholder} onChange={(e) => set(i, c.name, e.target.value)} className={inputClasses} />
                    ) : (
                      <input id={id} value={row[c.name] ?? ""} placeholder={c.placeholder} onChange={(e) => set(i, c.name, e.target.value)} className={inputClasses} />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-3 flex gap-2">
              <button type="button" className={smallButton} onClick={() => setRows((r) => moveItem(r, i, i - 1))} disabled={i === 0} aria-label="Move up">
                <ArrowUp size={13} aria-hidden /> Up
              </button>
              <button type="button" className={smallButton} onClick={() => setRows((r) => moveItem(r, i, i + 1))} disabled={i === rows.length - 1} aria-label="Move down">
                <ArrowDown size={13} aria-hidden /> Down
              </button>
              <button type="button" className={cn(smallButton, "ml-auto")} onClick={() => setRows((r) => r.filter((_, j) => j !== i))}>
                <Trash2 size={13} aria-hidden /> Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
      <button type="button" className={cn(smallButton, "self-start")} onClick={() => setRows((r) => [...r, blank()])}>
        <Plus size={13} aria-hidden /> {addLabel}
      </button>
    </div>
  );
}

/* ---------- department sections (heading + lead-in + one item per line) ----------------------------- */

interface SectionRow {
  heading: string;
  note: string;
  itemsText: string;
}

export function SectionsField({
  name,
  label,
  help,
  initial,
}: {
  name: string;
  label: string;
  help?: string;
  initial: { heading: string; note?: string; items: string[] }[];
}) {
  const [rows, setRows] = useState<SectionRow[]>((initial ?? []).map((s) => ({ heading: s.heading, note: s.note ?? "", itemsText: s.items.join("\n") })));
  const set = (i: number, patch: Partial<SectionRow>) => setRows((r) => r.map((row, j) => (j === i ? { ...row, ...patch } : row)));
  const value = JSON.stringify(
    rows.map((r) => ({
      heading: r.heading,
      note: r.note,
      items: r.itemsText
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean),
    }))
  );
  const baseId = useId();

  return (
    <div className="flex flex-col gap-2">
      <Label help={help}>{label}</Label>
      <input type="hidden" name={name} value={value} />
      <ul className="flex flex-col gap-4">
        {rows.map((row, i) => (
          <li key={i} className="rounded-control border border-border bg-surface p-4">
            <div className="grid gap-3">
              <div className="flex flex-col gap-1">
                <label htmlFor={`${baseId}-${i}-h`} className="text-xs font-semibold text-ink-muted">Heading</label>
                <input id={`${baseId}-${i}-h`} value={row.heading} placeholder="Functions" onChange={(e) => set(i, { heading: e.target.value })} className={inputClasses} />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor={`${baseId}-${i}-n`} className="text-xs font-semibold text-ink-muted">Lead-in sentence (optional)</label>
                <input id={`${baseId}-${i}-n`} value={row.note} onChange={(e) => set(i, { note: e.target.value })} className={inputClasses} />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor={`${baseId}-${i}-i`} className="text-xs font-semibold text-ink-muted">List — one item per line</label>
                <textarea id={`${baseId}-${i}-i`} rows={Math.min(14, Math.max(4, row.itemsText.split("\n").length + 1))} value={row.itemsText} onChange={(e) => set(i, { itemsText: e.target.value })} className={cn(inputClasses, "leading-relaxed")} />
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <button type="button" className={smallButton} onClick={() => setRows((r) => moveItem(r, i, i - 1))} disabled={i === 0}>
                <ArrowUp size={13} aria-hidden /> Up
              </button>
              <button type="button" className={smallButton} onClick={() => setRows((r) => moveItem(r, i, i + 1))} disabled={i === rows.length - 1}>
                <ArrowDown size={13} aria-hidden /> Down
              </button>
              <button type="button" className={cn(smallButton, "ml-auto")} onClick={() => setRows((r) => r.filter((_, j) => j !== i))}>
                <Trash2 size={13} aria-hidden /> Remove block
              </button>
            </div>
          </li>
        ))}
      </ul>
      <button type="button" className={cn(smallButton, "self-start")} onClick={() => setRows((r) => [...r, { heading: "", note: "", itemsText: "" }])}>
        <Plus size={13} aria-hidden /> Add a block
      </button>
    </div>
  );
}

/* ---------- picture / file with optional upload ---------------------------------------------------- */

/**
 * The picture-or-file control without its label: a preview, a box for a link,
 * and an Upload button. Controlled, so it works both as a single field and as
 * one row of a gallery.
 */
function MediaPicker({
  id,
  name,
  value,
  onChange,
  mode,
  uploadMode,
  invalid,
}: {
  id: string;
  /** Present for a stand-alone field (the link box is what gets submitted); absent inside a gallery. */
  name?: string;
  value: string;
  onChange: (next: string) => void;
  mode: "image" | "file";
  uploadMode: UploadMode;
  invalid?: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  const previewable = mode === "image" && value && (value.startsWith("/") || value.startsWith("https://"));

  async function onPick(file: File | undefined) {
    if (!file) return;
    setProblem(null);
    setBusy(true);
    try {
      onChange(await uploadFile(file, mode, uploadMode));
    } catch (e) {
      setProblem(e instanceof Error ? e.message : "The upload failed.");
    } finally {
      setBusy(false);
    }
  }

  const accept = mode === "image" ? "image/jpeg,image/png,image/webp,image/avif" : ".pdf,.docx,.xlsx,application/pdf";
  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row">
        {previewable && (
          // eslint-disable-next-line @next/next/no-img-element -- admin preview of an arbitrary uploaded picture
          <img src={value} alt="" className="h-24 w-36 shrink-0 rounded-control border border-border bg-brand-50 object-cover" />
        )}
        {!previewable && mode === "image" && (
          <span className="flex h-24 w-36 shrink-0 items-center justify-center rounded-control border border-dashed border-border bg-surface text-ink-muted">
            <ImageIcon size={22} aria-hidden />
          </span>
        )}
        {mode === "file" && (
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-control border border-border bg-surface text-ink-muted">
            <FileText size={20} aria-hidden />
          </span>
        )}
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <input
            id={id}
            name={name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={mode === "image" ? "/images/… or https://… picture link" : "https://… link to the file"}
            aria-invalid={invalid ? true : undefined}
            className={inputClasses}
          />
          {uploadMode !== "none" ? (
            <label className={cn(smallButton, "w-fit cursor-pointer", busy && "pointer-events-none opacity-60")}>
              <Upload size={13} aria-hidden />
              {busy ? "Uploading…" : mode === "image" ? "Upload a picture" : "Upload a file"}
              <input type="file" accept={accept} className="sr-only" onChange={(e) => onPick(e.target.files?.[0])} disabled={busy} />
            </label>
          ) : (
            <p className="text-xs text-ink-muted">Uploading isn&rsquo;t set up yet, so paste a link instead. Ask your administrator to connect file storage.</p>
          )}
        </div>
      </div>
      {problem && (
        <p role="alert" className="text-xs font-medium text-red-700">
          {problem}
        </p>
      )}
    </>
  );
}

export function MediaField({
  name,
  label,
  help,
  required,
  defaultValue,
  error,
  mode,
  uploadMode,
}: {
  name: string;
  label: string;
  help?: string;
  required?: boolean;
  defaultValue?: string | null;
  error?: string;
  mode: "image" | "file";
  uploadMode: UploadMode;
}) {
  const [value, setValue] = useState(defaultValue ?? "");
  const id = `f-${name}`;
  return (
    <div className="flex flex-col gap-2">
      <Label id={id} help={!error ? help : undefined}>
        {label}
        {required && <span className="text-red-700" aria-hidden> *</span>}
      </Label>
      <MediaPicker id={id} name={name} value={value} onChange={setValue} mode={mode} uploadMode={uploadMode} invalid={Boolean(error)} />
      {error && <p className="text-xs font-medium text-red-700">{error}</p>}
    </div>
  );
}

/* ---------- gallery: several pictures, each with a description and an optional caption ----------- */

interface GalleryRow {
  src: string;
  alt: string;
  caption: string;
}

export function GalleryField({
  name,
  label,
  help,
  initial,
  uploadMode,
  addLabel = "Add a picture",
}: {
  name: string;
  label: string;
  help?: string;
  initial: { src: string; alt: string; caption?: string }[];
  uploadMode: UploadMode;
  addLabel?: string;
}) {
  const [rows, setRows] = useState<GalleryRow[]>((initial ?? []).map((r) => ({ src: r.src, alt: r.alt, caption: r.caption ?? "" })));
  const error = useFieldError(name);
  const baseId = useId();
  const set = (i: number, patch: Partial<GalleryRow>) => setRows((all) => all.map((row, j) => (j === i ? { ...row, ...patch } : row)));
  const value = JSON.stringify(rows.map((r) => ({ src: r.src, alt: r.alt, ...(r.caption.trim() ? { caption: r.caption.trim() } : {}) })));

  return (
    <div className="flex flex-col gap-2" id={`f-${name}`}>
      <Label help={!error ? help : undefined}>{label}</Label>
      <input type="hidden" name={name} value={value} />
      <ul className="flex flex-col gap-3">
        {rows.map((row, i) => (
          <li key={i} className="rounded-control border border-border bg-surface p-3">
            <p className="mb-2 text-xs font-semibold text-ink-muted">Picture {i + 1}</p>
            <MediaPicker id={`${baseId}-${i}-src`} value={row.src} onChange={(src) => set(i, { src })} mode="image" uploadMode={uploadMode} />
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <label htmlFor={`${baseId}-${i}-alt`} className="text-xs font-semibold text-ink-muted">Picture description (for screen readers)</label>
                <input id={`${baseId}-${i}-alt`} value={row.alt} maxLength={200} onChange={(e) => set(i, { alt: e.target.value })} className={inputClasses} />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor={`${baseId}-${i}-caption`} className="text-xs font-semibold text-ink-muted">Caption (optional)</label>
                <input id={`${baseId}-${i}-caption`} value={row.caption} maxLength={200} onChange={(e) => set(i, { caption: e.target.value })} className={inputClasses} />
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <button type="button" className={smallButton} onClick={() => setRows((r) => moveItem(r, i, i - 1))} disabled={i === 0}>
                <ArrowUp size={13} aria-hidden /> Up
              </button>
              <button type="button" className={smallButton} onClick={() => setRows((r) => moveItem(r, i, i + 1))} disabled={i === rows.length - 1}>
                <ArrowDown size={13} aria-hidden /> Down
              </button>
              <button type="button" className={cn(smallButton, "ml-auto")} onClick={() => setRows((r) => r.filter((_, j) => j !== i))}>
                <Trash2 size={13} aria-hidden /> Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
      <button type="button" className={cn(smallButton, "self-start")} onClick={() => setRows((r) => [...r, { src: "", alt: "", caption: "" }])}>
        <Plus size={13} aria-hidden /> {addLabel}
      </button>
      {error && <p className="text-xs font-medium text-red-700">{error}</p>}
    </div>
  );
}
