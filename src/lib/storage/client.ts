import { DOCUMENT_TYPES, IMAGE_TYPES, MAX_DOCUMENT_BYTES, MAX_IMAGE_BYTES } from "./validate";

export type UploadMode = "blob" | "local" | "none";

const safeName = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(-80) || "file";

/**
 * Uploads a picture or document from the browser and returns its public URL.
 * Checks here are only for a quick, friendly error — the server repeats every
 * check, because nothing the browser says can be trusted.
 */
export async function uploadFile(file: File, kind: "image" | "file", mode: UploadMode): Promise<string> {
  const allowed = kind === "image" ? IMAGE_TYPES : DOCUMENT_TYPES;
  const maxBytes = kind === "image" ? MAX_IMAGE_BYTES : MAX_DOCUMENT_BYTES;
  if (!(file.type in allowed)) {
    throw new Error(kind === "image" ? "Use a JPG, PNG, WebP or AVIF picture." : "Use a PDF, Word (.docx) or Excel (.xlsx) file.");
  }
  if (file.size > maxBytes) throw new Error(`That file is too large. The limit is ${Math.round(maxBytes / 1024 / 1024)} MB.`);
  if (mode === "none") throw new Error("Uploading isn't set up yet.");

  const folder = kind === "image" ? "images" : "documents";

  if (mode === "blob") {
    const { upload } = await import("@vercel/blob/client");
    const blob = await upload(`${folder}/${safeName(file.name)}`, file, {
      access: "public",
      handleUploadUrl: "/api/admin/upload",
      clientPayload: kind,
    });
    return blob.url;
  }

  const form = new FormData();
  form.set("file", file);
  form.set("kind", kind);
  const response = await fetch("/api/admin/upload", { method: "POST", body: form });
  const data = (await response.json().catch(() => ({}))) as { url?: string; error?: string };
  if (!response.ok || !data.url) throw new Error(data.error ?? "The upload failed.");
  return data.url;
}
