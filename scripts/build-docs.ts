/**
 * Builds the training pack and the user-acceptance (UAT) script from the in-app
 * Help guides, so they can never disagree with the admin:
 *
 *   npm run docs:build        writes docs/training-pack.md and docs/uat-script.md
 *
 * Do not edit the generated files by hand: change the guides in
 * src/lib/admin/help/guides/ (or the lists below) and run this again.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { GLOSSARY, GUIDES, HELP_AREAS, getGuide, type HelpGuide } from "../src/lib/admin/help";
import { SECTION_LABELS } from "../src/lib/auth/permissions";

const OUT = path.resolve(process.cwd(), "docs");

const audienceLabel = (g: HelpGuide) => (g.audience === "everyone" ? "Everyone" : g.audience === "super_admin" ? "Super administrators" : `Anyone who can edit “${SECTION_LABELS[g.audience]}”`);

function renderGuide(g: HelpGuide, level = 3): string {
  const h = "#".repeat(level);
  const lines = [`${h} ${g.title}`, "", `*${audienceLabel(g)}${g.time ? ` · about ${g.time}` : ""}*`, "", g.summary, ""];
  g.steps.forEach((s, i) => {
    lines.push(`${i + 1}. ${s.text}${s.link ? ` (\`${s.link.href}\`)` : ""}`);
    if (s.detail) lines.push(`   - ${s.detail}`);
  });
  if (g.tips?.length) lines.push("", "**Good to know**", ...g.tips.map((t) => `- ${t}`));
  if (g.problems?.length) lines.push("", "**If something goes wrong**", ...g.problems.map((p) => `- *${p.q}* ${p.a}`));
  lines.push("");
  return lines.join("\n");
}

/* ---------- training pack ----------------------------------------------------------------------- */

const SESSIONS: { title: string; who: string; minutes: number; goal: string; slugs: string[] }[] = [
  {
    title: "Session 1: Getting started",
    who: "Everyone who will use the admin",
    minutes: 45,
    goal: "Everyone can sign in, find their way around, understand when changes reach the website, and know where to get help.",
    slugs: ["accept-your-invitation", "finding-your-way-around", "how-changes-reach-the-website", "change-your-password", "forgot-your-password", "troubleshooting"],
  },
  {
    title: "Session 2: Writing and editing content",
    who: "Content editors",
    minutes: 90,
    goal: "Editors can change the content they look after, use pictures and files correctly, and send their work for approval.",
    slugs: [
      "publish-a-news-story", "publish-photo-news", "add-an-event", "change-a-hero-slide", "add-or-edit-a-department", "update-a-leader", "edit-the-road-ahead",
      "edit-the-fcssip-page", "add-or-edit-an-e-service", "publish-a-document", "upload-pictures-and-files", "write-picture-descriptions",
      "submit-work-for-approval", "change-something-already-published", "preview-before-publishing", "if-someone-else-saved-first",
    ],
  },
  {
    title: "Session 3: Publishing",
    who: "Publishers (people who can approve and publish)",
    minutes: 45,
    goal: "Publishers can review work, approve it or send it back clearly, and keep the website tidy.",
    slugs: ["approve-or-return-work", "preview-before-publishing", "edit-mandate-mission-vision", "edit-contact-details", "archive-and-restore", "rearrange-the-order"],
  },
  {
    title: "Session 4: The enquiries desk",
    who: "People who deal with messages from the contact form",
    minutes: 30,
    goal: "Enquiries are read, answered and closed, and nothing is missed.",
    slugs: ["handle-enquiries"],
  },
  {
    title: "Session 5: Administering the admin",
    who: "Super administrators",
    minutes: 60,
    goal: "Super administrators can bring people on and off, choose what each can do, route enquiries, and check that everything is connected.",
    slugs: [
      "invite-someone", "change-someones-access", "change-someones-email", "resend-an-invitation", "deactivate-or-reactivate-someone", "set-where-enquiries-go",
      "read-the-activity-log", "check-system-status",
    ],
  },
];

export function trainingPack(): string {
  const out: string[] = [
    "# Training pack: Federal Ministry of Transportation website admin",
    "",
    "> Generated from the in-app Help guides by `npm run docs:build`. Do not edit by hand.",
    "",
    "This pack has everything a trainer needs to teach the website admin, and everything a person needs to practise afterwards. The same guides are inside the admin under **Help**, searchable and printable.",
    "",
    "## How to run the training",
    "",
    "- Group people by what they will do (the five sessions below). Run each session at a computer with the admin open, with a **practice** account and the training copy of the site, never the live one.",
    "- For each guide: the trainer does it once while people watch, then everyone does it themselves. People learn by doing the guide's steps.",
    "- End every session with the **practice tasks** in the UAT script (`uat-script.md`) for that role. Someone who completes them unaided is ready.",
    "- Leave each person with the printable **quick reference** (Help → Quick reference) for their role.",
    "",
    "## The sessions",
    "",
    "| Session | For | Time | Guides |",
    "|---|---|---|---|",
    ...SESSIONS.map((s) => `| ${s.title} | ${s.who} | ${s.minutes} min | ${s.slugs.length} |`),
    "",
  ];
  for (const s of SESSIONS) {
    out.push(`## ${s.title}`, "", `**For:** ${s.who} · **Time:** about ${s.minutes} minutes`, "", `**By the end:** ${s.goal}`, "", "**Guides in this session:**", "");
    for (const slug of s.slugs) {
      const g = getGuide(slug);
      if (!g) throw new Error(`Training session "${s.title}" lists a guide that does not exist: ${slug}`);
      out.push(`- ${g.title}${g.time ? ` (${g.time})` : ""}`);
    }
    out.push("");
    for (const slug of s.slugs) out.push(renderGuide(getGuide(slug)!));
  }
  const used = new Set(SESSIONS.flatMap((s) => s.slugs));
  const missing = GUIDES.filter((g) => !used.has(g.slug));
  if (missing.length) throw new Error(`These guides are in no training session: ${missing.map((g) => g.slug).join(", ")}. Add them to SESSIONS in scripts/build-docs.ts.`);

  out.push("## Words used in the admin", "", ...GLOSSARY.map((t) => `- **${t.term}**: ${t.meaning}`), "");
  out.push("## Help areas inside the admin", "", ...Object.values(HELP_AREAS).map((a) => `- **${a.title}**: ${a.blurb}`), "");
  return out.join("\n");
}

/* ---------- user-acceptance script ---------------------------------------------------------------- */

interface Scenario {
  role: string;
  title: string;
  slug: string;
  expect: string;
}

const SCENARIOS: Scenario[] = [
  { role: "Anyone", title: "Activate an account from an invitation", slug: "accept-your-invitation", expect: "A password is chosen, and the person lands on the dashboard seeing only the sections they were given." },
  { role: "Anyone", title: "Sign in, sign out, sign in again", slug: "finding-your-way-around", expect: "Sign-in works; the menu shows only permitted sections; Sign out returns to the sign-in page." },
  { role: "Anyone", title: "Reset a forgotten password", slug: "forgot-your-password", expect: "An email arrives, the link works once, and the new password signs in. The old password no longer works." },
  { role: "Anyone", title: "Change your own password", slug: "change-your-password", expect: "The new password works at the next sign-in; other browsers are signed out." },
  { role: "Anyone", title: "Find a guide with Help search", slug: "troubleshooting", expect: "Typing a word finds the right guide, which opens with its steps and links." },
  { role: "Editor", title: "Write a news story and submit it for approval", slug: "submit-work-for-approval", expect: "It saves as a Draft, is NOT on the public site, and appears under Waiting for approval after Submit for approval." },
  { role: "Editor", title: "Preview a draft before submitting", slug: "preview-before-publishing", expect: "Preview shows the story in the real site layout with an amber Preview bar; the public site still does not show it." },
  { role: "Editor", title: "Propose a change to a published story", slug: "change-something-already-published", expect: "The public site keeps the old text; the item shows Published · changes in draft; the editor sees their version when they reopen it." },
  { role: "Editor", title: "Add a photo gallery to a story, with picture descriptions", slug: "publish-a-news-story", expect: "Pictures upload, each needs a description, and the gallery shows under the story after approval." },
  { role: "Editor", title: "Upload a picture that is too large, then a wrong file type", slug: "upload-pictures-and-files", expect: "Each is refused with a clear message in plain words; nothing is half-saved." },
  { role: "Editor", title: "Try to archive or re-arrange something", slug: "archive-and-restore", expect: "Archive, Restore and the arrows are not offered (or are refused) for someone without the Publish permission." },
  { role: "Editor", title: "Edit while a colleague saves the same item", slug: "if-someone-else-saved-first", expect: "The second save is refused with 'Someone else changed this item'; typed text is kept; reload shows the colleague's version." },
  { role: "Editor", title: "Update a department's page and picture", slug: "add-or-edit-a-department", expect: "The department page shows the new introduction and picture after approval." },
  { role: "Editor", title: "Change a hero slide", slug: "change-a-hero-slide", expect: "The new slide appears in the home page carousel after approval, in the chosen order." },
  { role: "Editor", title: "Add an event", slug: "add-an-event", expect: "The event appears on the Events page after approval." },
  { role: "Editor", title: "Publish a document, and one without a file yet", slug: "publish-a-document", expect: "A document with a file shows Download; one without shows Available on request. Neither is a dead link." },
  { role: "Publisher", title: "Approve a new story", slug: "approve-or-return-work", expect: "After Approve and publish the story is on the public site and in Published; the author's draft is gone from Waiting." },
  { role: "Publisher", title: "Send work back with a note, and see the author fix it", slug: "approve-or-return-work", expect: "A note is required; the author sees it on the item, fixes it, resubmits, and the publisher approves." },
  { role: "Publisher", title: "Review proposed changes to a published item", slug: "approve-or-return-work", expect: "The review shows each changed field with On the website now beside Proposed; approving replaces the live version." },
  { role: "Publisher", title: "Be told about a submission", slug: "approve-or-return-work", expect: "The Approvals count and the email (if connected) arrive when an editor submits; the count falls as items are decided." },
  { role: "Publisher", title: "Archive something, then restore it", slug: "archive-and-restore", expect: "Archive disappears it from the public site (its address shows Page not found); Restore brings it back at the end of the list." },
  { role: "Publisher", title: "Re-arrange departments and save the new order", slug: "rearrange-the-order", expect: "Nothing changes publicly until Save new order is pressed; then the public order matches." },
  { role: "Publisher", title: "Try to archive the last published hero slide", slug: "archive-and-restore", expect: "It is refused: the home page needs at least one slide." },
  { role: "Publisher", title: "Edit the Mandate, Mission and Vision", slug: "edit-mandate-mission-vision", expect: "The home page and About Us show the new text straight away." },
  { role: "Publisher", title: "Update contact details and social links", slug: "edit-contact-details", expect: "The footer and Contact page change; an empty telephone number is simply not shown." },
  { role: "Enquiries desk", title: "Send a message through the contact form as a visitor", slug: "handle-enquiries", expect: "A thank-you message appears, the form clears, and the message is under New in Enquiries." },
  { role: "Enquiries desk", title: "Reply to an enquiry and mark it handled", slug: "handle-enquiries", expect: "Reply by email opens a message to the sender; Mark as handled moves it to Handled with the person's name and note." },
  { role: "Enquiries desk", title: "Mark an enquiry as spam, then reopen it", slug: "handle-enquiries", expect: "It moves to Spam and back to New; nothing is deleted." },
  { role: "Super administrator", title: "Invite a content editor with Edit only, and a publisher", slug: "invite-someone", expect: "Both receive an invitation; each sees only their sections; the publisher sees Approvals." },
  { role: "Super administrator", title: "Change what someone can do and see it take effect", slug: "change-someones-access", expect: "The change applies on their next page load, without signing in again." },
  { role: "Super administrator", title: "Correct a mistyped invitation address", slug: "change-someones-email", expect: "A new invitation goes to the corrected address and the old link stops working." },
  { role: "Super administrator", title: "Deactivate someone, then reactivate them", slug: "deactivate-or-reactivate-someone", expect: "They are signed out everywhere and cannot sign in; their history stays; the last super administrator cannot be deactivated." },
  { role: "Super administrator", title: "Send different enquiry topics to different teams", slug: "set-where-enquiries-go", expect: "A message about each topic is emailed to the address set for it; an empty box uses the main address." },
  { role: "Super administrator", title: "Find who changed something, and when", slug: "read-the-activity-log", expect: "The Activity log shows who submitted, approved or archived it, with times; no passwords or message text appear." },
  { role: "Super administrator", title: "Check that email, database and uploads are connected", slug: "check-system-status", expect: "Each line is green, or amber with a plain statement of what is missing." },
];

export function uatScript(): string {
  const roles = [...new Set(SCENARIOS.map((s) => s.role))];
  const out: string[] = [
    "# User-acceptance test script: Federal Ministry of Transportation website admin",
    "",
    "> Generated by `npm run docs:build` from the in-app Help guides. Do not edit by hand.",
    "",
    "**How to use it.** Each person who will use the admin works through the scenarios for their role, following the guide named in the table, on the **training copy** of the site. For each scenario, tick **Pass** only if what happened matches **Expected result** exactly. Anything else is a **Fail**: write what you saw in *Notes*, with the page address.",
    "",
    "**Who signs off.** The Ministry's ICT lead and one person from each role sign the last page. The site is ready for launch when every scenario has passed, or each failure has an agreed fix or an accepted reason.",
    "",
    "| | |",
    "|---|---|",
    "| Date of test | |",
    "| Address tested | |",
    "| Tester name and role | |",
    "",
  ];
  let n = 0;
  for (const role of roles) {
    out.push(`## ${role}`, "", "| # | Scenario | Guide to follow | Expected result | Pass | Fail | Notes |", "|---|---|---|---|---|---|---|");
    for (const s of SCENARIOS.filter((x) => x.role === role)) {
      const g = getGuide(s.slug);
      if (!g) throw new Error(`UAT scenario "${s.title}" names a guide that does not exist: ${s.slug}`);
      out.push(`| ${++n} | ${s.title} | ${g.title} | ${s.expect} | ☐ | ☐ | |`);
    }
    out.push("");
  }
  out.push(
    "## The public website",
    "",
    "| # | Check | Expected result | Pass | Fail | Notes |",
    "|---|---|---|---|---|---|",
    ...[
      ["Open the home page on a phone and on a computer", "Readable, no sideways scrolling, the carousel can be paused."],
      ["Use the keyboard only (Tab, Enter) to reach the menu and a news story", "Every control can be reached, and the focus is always visible."],
      ["Search for a word from a news story", "The story is found, with a passage from the text."],
      ["Open an address that does not exist", "A helpful Page not found screen, not a technical error."],
      ["Open an old /direction-a/... address from a shared link", "It goes straight to the same page at the new address."],
      ["Send the contact form with a missing email address", "A clear message beside the field, and what was typed is kept."],
      ["Look at a story shared on social media or in a messaging app", "A sensible title, summary and picture appear in the preview."],
    ].map(([c, e], i) => `| ${i + 1} | ${c} | ${e} | ☐ | ☐ | |`),
    "",
    "## Sign-off",
    "",
    "| Name | Role | Signature | Date |",
    "|---|---|---|---|",
    "| | Ministry ICT lead | | |",
    "| | Content editor | | |",
    "| | Publisher | | |",
    "| | Enquiries desk | | |",
    "| | Super administrator | | |",
    ""
  );
  return out.join("\n");
}

// Only write files when run as a script (the test imports the two functions above).
if (process.argv[1] && path.basename(process.argv[1]) === "build-docs.ts") {
  mkdirSync(OUT, { recursive: true });
  writeFileSync(path.join(OUT, "training-pack.md"), trainingPack());
  writeFileSync(path.join(OUT, "uat-script.md"), uatScript());
  console.log(`Wrote docs/training-pack.md (${GUIDES.length} guides) and docs/uat-script.md (${SCENARIOS.length} scenarios).`);
}
