import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { trainingPack, uatScript } from "../../../../scripts/build-docs";

const read = (file: string) => readFileSync(path.resolve(import.meta.dirname, "../../../../docs", file), "utf8");

describe("training pack and UAT script", () => {
  it("are in step with the Help guides (run `npm run docs:build` if this fails)", () => {
    expect(read("training-pack.md")).toBe(trainingPack());
    expect(read("uat-script.md")).toBe(uatScript());
  });

  it("put every guide in a training session and point every scenario at a real guide", () => {
    // Both functions throw if a guide is in no session or a scenario names a guide that does not exist.
    expect(() => trainingPack()).not.toThrow();
    expect(() => uatScript()).not.toThrow();
  });
});
