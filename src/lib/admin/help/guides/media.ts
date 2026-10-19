import type { HelpGuide } from "../types";

const reviewed = "2026-10-19";

export const mediaGuides: HelpGuide[] = [
  {
    slug: "upload-pictures-and-files",
    title: "Upload pictures and files",
    summary: "Add a picture or document to an item, with the right type and size.",
    area: "media",
    audience: "everyone",
    time: "2 minutes",
    steps: [
      { text: "Open the item you are editing and find the picture or file field (for example “Picture”, “Background picture”, “Photo” or “File or link”)." },
      { text: "Press “Upload a picture” (or “Upload a file”) and choose the file from your computer or phone.", detail: "A small preview appears for pictures when the upload finishes." },
      { text: "Alternatively, paste a link into the box next to the preview.", detail: "Pictures can be linked from Unsplash or Pexels. Files can be linked from any https:// address." },
      { text: "Fill in the picture description if the form asks for one, then save the item as usual." },
    ],
    tips: [
      "Pictures: JPG, PNG, WebP or AVIF, up to 8 MB. Documents: PDF, Word (.docx) or Excel (.xlsx), up to 25 MB.",
      "Sizes that look best: hero slides, landscape and at least 1600 pixels wide. News and department cards, about 1200 × 750. Leader photos, portrait (4 wide by 5 tall).",
      "Do not upload pictures you do not have the right to use. Pictures with text in them (such as flyers) need a full description.",
      "The change is only saved when you save the item. Choosing a file alone does nothing until you press the save button.",
    ],
    problems: [
      { q: "It says 'Use a JPG, PNG, WebP or AVIF picture.'", a: "Only those picture types are accepted. SVG and GIF files are not. Open the picture in an editor and save or export it as a JPG or PNG." },
      { q: "It says the file is too large.", a: "Pictures must be under 8 MB and documents under 25 MB. Reduce the picture size, or save the document as a smaller PDF." },
      { q: "It says 'Uploading isn\'t set up yet.'", a: "File storage has not been connected. You can still paste a picture link instead. Ask a super administrator to check “System status”." },
      { q: "My linked picture is refused.", a: "Only pictures uploaded here and links from Unsplash or Pexels are accepted for pictures." },
    ],
    related: ["write-picture-descriptions", "publish-a-document"],
    reviewed,
  },
  {
    slug: "write-picture-descriptions",
    title: "Describe a picture for screen readers",
    summary: "Write the short description that lets people who cannot see a picture understand it.",
    area: "media",
    audience: "everyone",
    time: "1 minute",
    steps: [
      { text: "Find the description field next to the picture, usually “Picture description (for screen readers)”." },
      { text: "Write one sentence saying what the picture shows and why it is there.", detail: "For example: 'Engineers reviewing drawings beside the new rail line', not 'photo1.jpg'." },
      { text: "If the picture contains words (a flyer, a chart), include the important words in the description." },
      { text: "Save the item." },
    ],
    tips: [
      "Do not start with 'Picture of' or 'Image of': screen readers already say it is a picture.",
      "Keep it under about 125 characters unless the picture contains a lot of important text.",
      "Do not name people unless the Ministry has approved naming them.",
    ],
    related: ["upload-pictures-and-files"],
    reviewed,
  },
];
