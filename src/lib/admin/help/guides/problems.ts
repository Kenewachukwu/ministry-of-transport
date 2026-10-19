import type { HelpGuide } from "../types";

export const problemGuides: HelpGuide[] = [
  {
    slug: "troubleshooting",
    title: "Common problems and quick answers",
    summary: "The things people most often get stuck on, and what to do.",
    area: "problems",
    audience: "everyone",
    steps: [
      { text: "Find your problem below, and follow the answer. If it does not help, tell a super administrator exactly what you pressed and what the screen said." },
    ],
    problems: [
      { q: "I cannot sign in.", a: "Check your email address and password, then use “Forgot your password?” if needed. After several wrong attempts the admin makes you wait for a few minutes. If your account was deactivated, ask a super administrator." },
      { q: "A section I need is missing from the menu.", a: "You only see sections you have been given. Ask a super administrator to add it to your access." },
      { q: "I saved, but the website looks the same.", a: "Saved changes go live straight away. Refresh the website tab. Then check you edited the right item, that it is not archived, and (for news) that its Kind is the one you meant." },
      { q: "My change was refused with 'Please correct the highlighted fields'.", a: "Look for a field marked in red, fix it, and press save again. What you typed is kept." },
      { q: "It says someone else changed the item.", a: "Reload the page, then make your change again. See the guide When 'Someone else changed this item' appears." },
      { q: "A picture will not upload.", a: "Use JPG, PNG, WebP or AVIF under 8 MB. For documents use PDF, Word or Excel under 25 MB. See the guide Upload pictures and files." },
      { q: "The page asks if I want to leave.", a: "You have changes that are not saved yet. Stay, press save, then leave." },
      { q: "A banner says my session is ending.", a: "Save your work. If it ends first, press “Sign in again in a new tab”, sign in there, then come back to your page and press save. Nothing you typed is lost." },
      { q: "I cannot archive the last hero slide.", a: "The home page needs at least one slide. Add a new one first, then archive the old one." },
    ],
    related: ["finding-your-way-around", "upload-pictures-and-files", "if-someone-else-saved-first"],
    reviewed: "2026-10-19",
  },
];
