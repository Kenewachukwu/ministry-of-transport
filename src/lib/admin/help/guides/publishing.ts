import type { HelpGuide } from "../types";

const reviewed = "2026-10-19";

export const publishingGuides: HelpGuide[] = [
  {
    slug: "submit-work-for-approval",
    title: "Submit your work for approval",
    summary: "Write something as a draft, send it to a publisher, and see what happens next.",
    area: "publishing",
    audience: "everyone",
    time: "3 minutes",
    steps: [
      { text: "Open the section you work in and press the green Add button, or open an item with “Edit”." },
      { text: "Fill in the form as usual." },
      {
        text: "Press “Save as draft” to keep it for later, or “Submit for approval” when it is ready.",
        detail: "A draft is saved but is not on the website. Submitting sends it to the people who can publish in this section.",
      },
      {
        text: "Look at the Approval panel at the top of the item's page.",
        detail: "It says “Draft” or “Waiting for approval”, and what that means for the website.",
      },
      {
        text: "Find your work again from the section's list: drafts are under “Drafts”, submitted work under “Waiting for approval”.",
        detail: "Once a publisher approves it, it moves to “Published” and appears on the website.",
      },
      {
        text: "If a publisher sends it back, open it and read the note in the Approval panel. Make the changes and press “Submit for approval” again.",
        detail: "Nothing is lost: your work is exactly as you left it, with their note on top.",
      },
    ],
    tips: [
      "If the button says “Create item” (or the name of that kind of content) instead of “Save as draft”, you can publish in this section, so what you create goes live at once.",
      "Changing something you already submitted takes it out of the queue until you submit it again.",
      "To abandon a draft, press “Discard draft”. It is archived, not deleted, and a publisher can restore it.",
    ],
    problems: [{ q: "Nobody has looked at my submission.", a: "Tell a publisher for that section. The “Waiting for approval” tab shows it is in the queue." }],
    related: ["change-something-already-published", "approve-or-return-work", "how-changes-reach-the-website"],
    reviewed,
  },
  {
    slug: "change-something-already-published",
    title: "Change something that is already on the website",
    summary: "Propose changes to a published item without touching what the public sees.",
    area: "publishing",
    audience: "everyone",
    time: "3 minutes",
    steps: [
      { text: "Open the section and press “Edit” beside the item." },
      { text: "Make your changes." },
      {
        text: "Press “Save proposed changes”.",
        detail: "The website keeps showing the published version. Your changes are kept beside it, and the item is marked “Published · changes in draft”.",
      },
      {
        text: "When they are ready, press “Submit for approval”.",
        detail: "A publisher compares your version with what is published, then approves it or sends it back with a note.",
      },
      {
        text: "To drop your changes instead, press “Discard proposed changes” in the Approval panel.",
        detail: "The website was never affected, so nothing needs undoing.",
      },
    ],
    tips: [
      "If you can publish in this section, you will see “Save changes” instead: it puts your version on the website at once.",
      "When you open the item again, the form shows your proposed version, not the published one. The Approval panel lists exactly what differs.",
    ],
    related: ["submit-work-for-approval", "approve-or-return-work"],
    reviewed,
  },
  {
    slug: "approve-or-return-work",
    title: "Approve work, or send it back",
    summary: "For publishers: review what colleagues submitted and decide.",
    area: "publishing",
    audience: "everyone",
    time: "3 minutes",
    steps: [
      {
        text: "Press “Approvals” in the menu.",
        detail: "The number beside it is how many items wait for your decision. You only see sections you can publish in.",
        link: { label: "Open Approvals", href: "/admin/review" },
      },
      { text: "Press “Review” beside an item." },
      {
        text: "Read the Approval panel.",
        detail: "For a new item it lists everything that would be published. For a change to something already published it shows each field that differs, with “On the website now” beside “Proposed”.",
      },
      { text: "To publish it, press “Approve and publish”.", detail: "It goes on the website straight away. For a change, the published version is replaced." },
      {
        text: "To send it back, type what needs to change in “Note to the author” and press “Send back”.",
        detail: "The website is not changed. The author sees your note when they open the item, fixes it and submits it again.",
      },
    ],
    tips: [
      "A note is required when you send something back, so the author knows what to fix.",
      "You can also fix it yourself: change the form below the Approval panel, then press “Publish now” (new item) or “Save changes”.",
      "You may approve your own work. The “Activity log” records who submitted, approved and sent back each item.",
    ],
    problems: [{ q: "A colleague says they submitted something, but I do not see it.", a: "You only see sections you can publish in. Check they pressed “Submit for approval” (a draft is not submitted yet), or ask a super administrator to check your permissions." }],
    related: ["submit-work-for-approval", "change-something-already-published", "read-the-activity-log"],
    reviewed,
  },
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
      { text: "A box asks you to confirm. Press “Archive” in the box, or “Cancel” to stop.", detail: "The item disappears from the website straight away. Anyone who has its web address now sees a page not found message." },
      { text: "To bring it back, open the “Archived” tab and press “Restore” beside it.", detail: "It is published again immediately." },
    ],
    tips: [
      "Nothing is ever deleted. Archived items stay in the “Archived” tab for good, and the “Activity log” records who archived them.",
      "In lists that can be re-arranged, a restored item rejoins at the end. Move it where you want it with “Up” and “Down”, then press “Save new order”.",
      "The last published home page hero slide cannot be archived. Add another slide first.",
      "Archive, Restore and re-arranging change what the website shows, so they need the publish permission. If you cannot see the buttons, ask a publisher.",
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
      "Re-arranging puts a new order on the website at once, so it needs the publish permission for the section.",
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
