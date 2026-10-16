export type StorageMode = "blob" | "local" | "none";

/** Where uploads go: Vercel Blob when its token is set; a local folder in development; otherwise nowhere. */
export function storageMode(env: NodeJS.ProcessEnv = process.env): StorageMode {
  if (env.BLOB_READ_WRITE_TOKEN) return "blob";
  if (env.NODE_ENV !== "production") return "local";
  return "none";
}
