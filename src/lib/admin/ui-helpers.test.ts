import { describe, expect, it } from "vitest";
import { serializeEntries } from "./dirty";
import { sessionNotice, SESSION_WARNING_MS } from "./session-notice";

describe("serializeEntries (unsaved-changes detection)", () => {
  it("is equal for identical content and different once a value changes", () => {
    const before = serializeEntries([["title", "Hello"], ["body", "World"]]);
    expect(serializeEntries([["title", "Hello"], ["body", "World"]])).toBe(before);
    expect(serializeEntries([["title", "Hello!"], ["body", "World"]])).not.toBe(before);
  });

  it("ignores the record id and version, which the server changes after a save", () => {
    const a = serializeEntries([["id", "1"], ["version", "3"], ["title", "Hello"]]);
    const b = serializeEntries([["id", "1"], ["version", "4"], ["title", "Hello"]]);
    expect(a).toBe(b);
  });

  it("ignores files and other non-text values", () => {
    const withFile = serializeEntries([["title", "Hello"], ["upload", { name: "a.pdf" }]]);
    expect(withFile).toBe(serializeEntries([["title", "Hello"]]));
  });

  it("notices a checkbox being ticked, a repeater row being added, and a field being emptied", () => {
    const base = serializeEntries([["featured", "on"], ["rows", "[]"], ["title", "Hello"]]);
    expect(serializeEntries([["rows", "[]"], ["title", "Hello"]])).not.toBe(base); // unticked
    expect(serializeEntries([["featured", "on"], ["rows", '[{"a":"b"}]'], ["title", "Hello"]])).not.toBe(base);
    expect(serializeEntries([["featured", "on"], ["rows", "[]"], ["title", ""]])).not.toBe(base);
  });
});

describe("sessionNotice", () => {
  const expires = Date.parse("2026-10-20T20:00:00Z");

  it("stays quiet until the warning window", () => {
    expect(sessionNotice(expires - SESSION_WARNING_MS - 1, expires)).toEqual({ level: "ok" });
  });

  it("warns inside the window and counts whole minutes up", () => {
    expect(sessionNotice(expires - SESSION_WARNING_MS, expires)).toEqual({ level: "soon", minutes: 15 });
    expect(sessionNotice(expires - 90_000, expires)).toEqual({ level: "soon", minutes: 2 });
    expect(sessionNotice(expires - 1_000, expires)).toEqual({ level: "soon", minutes: 1 });
  });

  it("reports an ended session at and after the expiry time", () => {
    expect(sessionNotice(expires, expires)).toEqual({ level: "ended" });
    expect(sessionNotice(expires + 60_000, expires)).toEqual({ level: "ended" });
  });

  it("does not warn when the expiry is unknown", () => {
    expect(sessionNotice(Date.now(), Number.NaN)).toEqual({ level: "ok" });
  });
});
