import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { getCurrentUser } from "@/lib/auth/session";
import { audit } from "@/lib/auth/audit";
import { hitRateLimit } from "@/lib/auth/rate-limit";
import { storageMode } from "@/lib/storage/mode";
import { limitsFor, saveLocalUpload, validateUpload, type UploadKind } from "@/lib/storage/server";
import { adminAvailability } from "@/lib/admin/availability";

/**
 * Upload endpoint for the admin (not under /admin/*, so Vercel Blob's callback
 * isn't blocked by the sign-in proxy). EVERY request is authenticated here.
 *  - blob mode:  the browser uploads straight to Vercel Blob with a short-lived
 *                token we mint after checking who's asking and what they ask for.
 *  - local mode: development only; the file is posted here and written to .data/.
 */
export const dynamic = "force-dynamic";

const json = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

/** CSRF defence for a route handler (Server Actions get this from Next; handlers don't). */
function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}

async function requireUploader() {
  if (!adminAvailability().available) return null;
  const user = await getCurrentUser();
  if (!user) return null;
  if (user.role !== "super_admin" && user.permissions.length === 0) return null;
  return user;
}

export async function POST(request: Request) {
  const mode = storageMode();
  if (mode === "none") return json({ error: "Uploading isn't set up yet." }, 503);

  const contentType = request.headers.get("content-type") ?? "";

  /* ---- local development: multipart form ---- */
  if (contentType.startsWith("multipart/form-data")) {
    if (mode !== "local") return json({ error: "Not available." }, 404);
    if (!sameOrigin(request)) return json({ error: "Forbidden." }, 403);
    const user = await requireUploader();
    if (!user) return json({ error: "Please sign in again." }, 401);
    if (await hitRateLimit(`upload:${user.id}`, 60, 3600)) return json({ error: "Too many uploads. Please try again later." }, 429);

    const form = await request.formData();
    const file = form.get("file");
    const kind: UploadKind = form.get("kind") === "file" ? "file" : "image";
    if (!(file instanceof File)) return json({ error: "No file received." }, 400);
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const ext = validateUpload(kind, file.name, file.type, bytes);
      const url = await saveLocalUpload(kind, file.name, bytes, ext);
      await audit({ id: user.id, label: user.email }, "upload", { summary: `Uploaded ${kind} ${file.name}`, meta: { url, bytes: bytes.byteLength } });
      return json({ url });
    } catch (error) {
      return json({ error: error instanceof Error ? error.message : "The upload failed." }, 400);
    }
  }

  /* ---- Vercel Blob: token minting ---- */
  if (mode !== "blob") return json({ error: "Not available." }, 404);
  const body = (await request.json()) as HandleUploadBody;
  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        if (!sameOrigin(request)) throw new Error("Forbidden.");
        const user = await requireUploader();
        if (!user) throw new Error("Please sign in again.");
        if (await hitRateLimit(`upload:${user.id}`, 60, 3600)) throw new Error("Too many uploads. Please try again later.");

        const kind: UploadKind = clientPayload === "file" ? "file" : "image";
        const { folder, types, maxBytes } = limitsFor(kind);
        const ext = pathname.split(".").pop()?.toLowerCase() ?? "";
        const allowedExt = Object.values(types).flat() as string[];
        if (!pathname.startsWith(`${folder}/`) || pathname.includes("..") || !allowedExt.includes(ext)) throw new Error("That file isn't allowed.");

        await audit({ id: user.id, label: user.email }, "upload", { summary: `Requested upload of ${pathname}` });
        return { allowedContentTypes: Object.keys(types), maximumSizeInBytes: maxBytes, addRandomSuffix: true, tokenPayload: JSON.stringify({ userId: user.id }) };
      },
      // Not relied on: Vercel can't reach localhost, so the browser reports the URL itself and the
      // save action re-validates it. Present only because handleUpload requires a handler.
      onUploadCompleted: async () => {},
    });
    return json(result);
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "The upload failed." }, 400);
  }
}
