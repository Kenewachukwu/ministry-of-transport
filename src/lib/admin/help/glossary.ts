import type { GlossaryTerm } from "./types";

/** Plain-language meanings of words used in the admin. Keep each to one or two sentences. */
export const GLOSSARY: GlossaryTerm[] = [
  { term: "Activity log", meaning: "A permanent record of who signed in, changed, archived or restored what, and when. Only super administrators can read it, and nobody can edit it." },
  { term: "Archive", meaning: "Hide something from the website without deleting it. Archived items stay in the Archived tab and can be restored at any time." },
  { term: "Content editor", meaning: "A person who can change only the sections of the website a super administrator has given them." },
  { term: "Event", meaning: "An entry on the Events page for something happening on a date, such as a council meeting, with a place and a short summary." },
  { term: "Enquiry", meaning: "A message someone sent through the contact form on the website. It is emailed to the right team and kept in the Enquiries section until someone marks it as handled." },
  { term: "Feature (an item)", meaning: "Mark a news item so it is highlighted on the home page." },
  { term: "Hero", meaning: "The large picture-and-headline carousel at the top of the home page. Each picture with its words is a slide." },
  { term: "Invitation", meaning: "The email that lets a new person choose a password and start using the admin. The link works once and lasts 72 hours." },
  { term: "Kind", meaning: "For news items, whether it is online news, photo news or an event. It decides which page of the website it appears on." },
  { term: "Approval", meaning: "A publisher's decision on work an editor submitted. Approved work goes on the website; work sent back returns to its author with a note." },
  { term: "Draft", meaning: "A new item that is saved but not on the website yet. It goes live only when a publisher approves it (or a publisher publishes it)." },
  { term: "Live", meaning: "Visible on the public website. A publisher's saved changes go live straight away; an editor's wait for approval." },
  { term: "Proposed changes", meaning: "Edits to something already published, saved beside it. The website keeps the published version until a publisher approves them." },
  { term: "Publisher", meaning: "A person who has the Publish permission for a section: they can approve others' work, put changes on the website, archive and re-arrange. Super administrators can publish everywhere." },
  { term: "Photo news", meaning: "A news item built around a photograph, shown on the Photo News page." },
  { term: "Picture description", meaning: "A short sentence saying what a picture shows, read aloud to people who use a screen reader and shown if the picture cannot load. Also called alt text." },
  { term: "Placeholder", meaning: "Words shown while the real information is not ready, for example Name to be announced in place of a leader's name." },
  { term: "Press release", meaning: "An official statement from the Ministry. In the admin it is an online news item with the press release box ticked." },
  { term: "Published", meaning: "Shown on the website now. The opposite of archived." },
  { term: "Section", meaning: "A part of the website you can manage, such as News or Departments. Content editors are given sections one by one." },
  { term: "Session", meaning: "The period you stay signed in, 12 hours. The admin warns you shortly before it ends." },
  { term: "Super administrator", meaning: "A person who can change everything: all sections, plus people, the activity log and system status." },
  { term: "Unsaved changes", meaning: "Words or choices you have typed that have not been saved yet. The admin shows a note and asks before you leave." },
];
