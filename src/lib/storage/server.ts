import "server-only";
import { randomBytes } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { DOCUMENT_TYPES, IMAGE_TYPES, MAX_DOCUMENT_BYTES, MAX_IMAGE_BYTES } from "./validate";

export const LOCAL_UPLOAD_ROOT = path.join(process.cwd(), ".data", "uploads");

export type UploadKind = "image" | "file";

export function limitsFor(kind: UploadKind) {
  return kind === "image"
    ? { types: IMAGE_TYPES as Record<string, readonly string[]>, maxBytes: MAX_IMAGE_BYTES, folder: "images" as const }
    : { types: DOCUMENT_TYPES as Record<string, readonly string[]>, maxBytes: MAX_DOCUMENT_BYTES, folder: "documents" as const };
}

/** What a file actually IS, from its first bytes — a renamed .exe doesn't become a picture. */
export function sniffContentType(bytes: Uint8Array): string | null {
  const startsWith = (...sig: number[]) => sig.every((b, i) => bytes[i] === b);
  if (startsWith(0xff, 0xd8, 0xff)) return "image/jpeg";
  if (startsWith(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)) return "image/png";
  if (startsWith(0x52, 0x49, 0x46, 0x46) && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) return "image/webp";
  if (bytes[4] === 0x66 && bytes[5] === 0x74 && bytes[6] === 0x79 && bytes[7] === 0x70 && bytes[8] === 0x61 && bytes[9] === 0x76 && bytes[10] === 0x69 && bytes[11] === 0x66) return "image/avif";
  if (startsWith(0x25, 0x50, 0x44, 0x46)) return "application/pdf";
  if (startsWith(0x50, 0x4b, 0x03, 0x04)) return "zip"; // .docx / .xlsx are zip containers
  return null;
}

/** Validates a file against the kind's allowed types; returns its extension. Throws a user-readable message. */
export function validateUpload(kind: UploadKind, name: string, declaredType: string, bytes: Uint8Array): string {
  const { types, maxBytes } = limitsFor(kind);
  if (bytes.byteLength === 0) throw new Error("That file is empty.");
  if (bytes.byteLength > maxBytes) throw new Error(`That file is too large. The limit is ${Math.round(maxBytes / 1024 / 1024)} MB.`);
  const extensions = types[declaredType];
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (!extensions || !extensions.includes(ext)) {
    throw new Error(kind === "image" ? "Use a JPG, PNG, WebP or AVIF picture." : "Use a PDF, Word (.docx) or Excel (.xlsx) file.");
  }
  const sniffed = sniffContentType(bytes);
  const matches = sniffed === declaredType || (sniffed === "zip" && (ext === "docx" || ext === "xlsx"));
  if (!matches) throw new Error("That file's contents don't match its type.");
  return ext;
}

const safeStem = (name: string) =>
  name
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50) || "file";

/** Development only: stores the file under .data/uploads and returns its site URL (/uploads/…). */
export async function saveLocalUpload(kind: UploadKind, name: string, bytes: Uint8Array, ext: string): Promise<string> {
  const { folder } = limitsFor(kind);
  const filename = `${randomBytes(6).toString("hex")}-${safeStem(name)}.${ext}`;
  const dir = path.join(LOCAL_UPLOAD_ROOT, folder);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), bytes);
  return `/uploads/${folder}/${filename}`;
}

export async function readLocalUpload(segments: string[]): Promise<{ bytes: Buffer; filename: string } | null> {
  if (segments.length !== 2 || !["images", "documents"].includes(segments[0])) return null;
  if (!/^[a-z0-9][a-z0-9._-]*$/.test(segments[1])) return null; // no slashes, no "..", nothing hidden
  const full = path.join(LOCAL_UPLOAD_ROOT, segments[0], segments[1]);
  if (!full.startsWith(LOCAL_UPLOAD_ROOT + path.sep)) return null;
  try {
    return { bytes: await readFile(full), filename: segments[1] };
  } catch {
    return null;
  }
}
