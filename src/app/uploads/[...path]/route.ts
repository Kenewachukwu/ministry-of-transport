import { readLocalUpload } from "@/lib/storage/server";
import { storageMode } from "@/lib/storage/mode";

/**
 * Serves files uploaded during LOCAL development. In production uploads live in
 * Vercel Blob and this route does not exist (404).
 */
export const dynamic = "force-dynamic";

const TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  avif: "image/avif",
  pdf: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
};

export async function GET(_request: Request, ctx: RouteContext<"/uploads/[...path]">) {
  if (storageMode() !== "local") return new Response("Not found", { status: 404 });
  const { path } = await ctx.params;
  const file = await readLocalUpload(path);
  if (!file) return new Response("Not found", { status: 404 });
  const ext = file.filename.split(".").pop() ?? "";
  const type = TYPES[ext];
  if (!type) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(file.bytes), {
    headers: {
      "Content-Type": type,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "no-store",
      "Content-Disposition": type.startsWith("image/") ? "inline" : "attachment",
    },
  });
}
