import { describe, expect, it } from "vitest";
import { sniffContentType, validateUpload, readLocalUpload } from "./server";
import { storageMode } from "./mode";

const bytes = (...b: number[]) => new Uint8Array([...b, ...new Array(32).fill(0)]);
const jpeg = bytes(0xff, 0xd8, 0xff, 0xe0);
const png = bytes(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a);
const pdf = bytes(0x25, 0x50, 0x44, 0x46, 0x2d);
const zip = bytes(0x50, 0x4b, 0x03, 0x04);
const exe = bytes(0x4d, 0x5a, 0x90, 0x00); // "MZ": a Windows executable

describe("upload validation", () => {
  it("recognises files by their contents", () => {
    expect(sniffContentType(jpeg)).toBe("image/jpeg");
    expect(sniffContentType(png)).toBe("image/png");
    expect(sniffContentType(pdf)).toBe("application/pdf");
    expect(sniffContentType(zip)).toBe("zip");
    expect(sniffContentType(exe)).toBeNull();
  });

  it("accepts a genuine picture and document", () => {
    expect(validateUpload("image", "Photo.JPG", "image/jpeg", jpeg)).toBe("jpg");
    expect(validateUpload("file", "report.pdf", "application/pdf", pdf)).toBe("pdf");
    expect(validateUpload("file", "table.xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", zip)).toBe("xlsx");
  });

  it("rejects a renamed executable, whatever it claims to be", () => {
    expect(() => validateUpload("image", "totally-a-photo.jpg", "image/jpeg", exe)).toThrow(/contents don't match/);
    expect(() => validateUpload("file", "invoice.pdf", "application/pdf", exe)).toThrow(/contents don't match/);
  });

  it("rejects types that aren't allowed (SVG can carry scripts)", () => {
    expect(() => validateUpload("image", "logo.svg", "image/svg+xml", bytes(0x3c, 0x73, 0x76, 0x67))).toThrow();
    expect(() => validateUpload("image", "x.gif", "image/gif", bytes(0x47, 0x49, 0x46))).toThrow();
    expect(() => validateUpload("file", "script.js", "text/javascript", bytes(0x61))).toThrow();
  });

  it("rejects a mismatched extension, empty files and oversized files", () => {
    expect(() => validateUpload("image", "photo.png", "image/jpeg", jpeg)).toThrow();
    expect(() => validateUpload("image", "a.jpg", "image/jpeg", new Uint8Array())).toThrow(/empty/);
    expect(() => validateUpload("image", "big.jpg", "image/jpeg", new Uint8Array(9 * 1024 * 1024).fill(0xff))).toThrow(/too large/);
  });
});

describe("local file serving", () => {
  it("refuses path traversal and odd names", async () => {
    for (const segs of [["images", "../../package.json"], ["..", "x.png"], ["images", ".hidden"], ["images", "a/b.png"], ["other", "x.png"], ["images"], ["images", "x.png", "extra"]]) {
      expect(await readLocalUpload(segs), segs.join("/")).toBeNull();
    }
  });
});

describe("storage mode", () => {
  const env = (v: Record<string, string>) => v as unknown as NodeJS.ProcessEnv;
  it("uses Blob when its token is set, a local folder in development, otherwise nothing", () => {
    expect(storageMode(env({ BLOB_READ_WRITE_TOKEN: "t", NODE_ENV: "production" }))).toBe("blob");
    expect(storageMode(env({ NODE_ENV: "development" }))).toBe("local");
    expect(storageMode(env({ NODE_ENV: "production" }))).toBe("none");
  });
});
