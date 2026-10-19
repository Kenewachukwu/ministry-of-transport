import type { HelpGuide } from "../types";

const reviewed = "2026-10-19";

export const publishingGuides: HelpGuide[] = [
  {
    slug: "archive-and-restore",
    title: "Archive something, or bring it back",
    summary: "Take an item off the website without deleting it, and restore it later.",
    area: "publishing",
    audience: "everyone",
    time: "1 minute",
    steps: [
      { text: "Open the section that contains the item (for example “News, Photo News & Events”)." },
      { text: "Press “Archive” beside the item, or open it and press “Archive this item” near the bottom of the page." },
      { text: "Confirm when asked.", detail: "The item disappears from the website straight away. Anyone who has its web address now sees a page not found message." },
      { text: "To bring it back, open the “Archived” tab and press “Restore” beside it.", detail: "It is published again immediately." },
    ],
    tips: [
      "Nothing is ever deleted. Archived items stay in the “Archived” tab for good, and the “Activity log” records who archived them.",
      "In lists that can be re-arranged, a restored item rejoins at the end. Move it where you want it with “Up” and “Down”, then press “Save new order”.",
      "The last published home page hero slide cannot be archived. Add another slide first.",
    ],
    problems: [{ q: "I cannot find something I archived.", a: "Open the section and press the “Archived” tab. If it is not there, check you are in the right section." }],
    related: ["rearrange-the-order", "how-changes-reach-the-website"],
    reviewed,
  },
  {
    slug: "rearrange-the-order",
    title: "Re-arrange the order of a list",
    summary: "Decide which hero slide, department, leader, goal, block, service or document comes first.",
    area: "publishing",
    audience: "everyone",
    time: "2 minutes",
    steps: [
      { text: "Open a list that can be re-arranged and make sure the “Published” tab is selected.", detail: "These are Home page hero, Departments, Leadership, The Road Ahead, FCSSIP 25 page, E-Services and Resources & documents." },
      { text: "Use the up and down arrow buttons beside an item to move it.", detail: "Each one is labelled Move the item up or Move the item down for screen readers." },
      { text: "When it reads as you want, press “Save new order”.", detail: "Nothing changes on the website until you press it. While you have moved things, the page says you have unsaved changes to the order." },
    ],
    tips: [
      "News, Photo News & Events cannot be re-arranged: they are shown newest first.",
      "Re-ordering is switched off on the “Archived” tab, and while a filter such as Kind or List is selected. Choose “All” first.",
      "Moving on a phone works the same way: the arrows are large buttons.",
    ],
    related: ["archive-and-restore"],
    reviewed,
  },
  {
    slug: "if-someone-else-saved-first",
    title: "When 'Someone else changed this item' appears",
    summary: "What to do when two people edit the same item at once.",
    area: "publishing",
    audience: "everyone",
    steps: [
      { text: "Do not close the page yet. If you typed a lot, select your text and copy it first." },
      { text: "Reload the page.", detail: "You now see the version your colleague saved." },
      { text: "Make your change again on top of theirs, and press “Save changes”." },
    ],
    tips: [
      "This message protects both of you: the admin refuses to overwrite a colleague's work without you seeing it.",
      "To avoid it, agree who edits an item, and check the “Activity log” (super administrators) to see who edited it last.",
    ],
    related: ["how-changes-reach-the-website"],
    reviewed,
  },
];
