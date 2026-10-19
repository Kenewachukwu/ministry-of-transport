/**
 * How the editor decides whether a form has unsaved changes: serialise what the
 * person has typed and compare it with the same serialisation taken when the
 * form was loaded or last saved. Plain data in, plain string out, so it is
 * testable without a browser.
 *
 * `id` and `version` are left out on purpose: after a save the server hands the
 * form a new version number, which is not something the person changed.
 */
const IGNORED = new Set(["id", "version"]);

export function serializeEntries(entries: Iterable<[string, unknown]>): string {
  const out: [string, string][] = [];
  for (const [name, value] of entries) {
    if (typeof value === "string" && !IGNORED.has(name)) out.push([name, value]);
  }
  return JSON.stringify(out);
}

export const LEAVE_MESSAGE = "You have changes that haven't been saved. Leave this page and lose them?";
