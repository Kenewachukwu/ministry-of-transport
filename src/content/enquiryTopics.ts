/**
 * What a visitor can write to the Ministry about. The form's topic list, the
 * admin inbox labels and the routing settings (which desk's address each topic
 * goes to) all read this one list. Ids are stored with each enquiry, so never
 * reuse or rename an id; add a new one instead.
 */
export const ENQUIRY_TOPICS = [
  { id: "general", label: "General enquiry" },
  { id: "documents", label: "Request a document" },
  { id: "foi", label: "Freedom of information request" },
  { id: "media", label: "Media and press" },
  { id: "website", label: "A problem with this website" },
] as const;

export type EnquiryTopicId = (typeof ENQUIRY_TOPICS)[number]["id"];

export const ENQUIRY_TOPIC_IDS = ENQUIRY_TOPICS.map((t) => t.id) as [EnquiryTopicId, ...EnquiryTopicId[]];

export const enquiryTopicLabel = (id: string): string => ENQUIRY_TOPICS.find((t) => t.id === id)?.label ?? "Enquiry";
