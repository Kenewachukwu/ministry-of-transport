/**
 * Thin abstraction over the static content/*.ts files. Every template
 * calls through here rather than importing content files directly, so a
 * future swap to a real headless CMS only touches this file.
 */
import { leadership, welcomeMessage } from "@/content/leadership";
import { departments } from "@/content/departments";
import { agencies } from "@/content/agencies";
import { stakeholders } from "@/content/stakeholders";
import { pillars } from "@/content/pillars";
import { stats } from "@/content/stats";
import { news } from "@/content/news";
import { events } from "@/content/events";
import { documents, nctCommuniques } from "@/content/documents";
import { eServices } from "@/content/eServices";

export function getLeadership() {
  return leadership;
}

export function getWelcomeMessage() {
  return welcomeMessage;
}

export function getDepartments() {
  return departments;
}

export function getAgencies() {
  return agencies;
}

export function getStakeholders() {
  return stakeholders;
}

export function getPillars() {
  return pillars;
}

export function getStats() {
  return stats;
}

export function getNews() {
  return news;
}

export function getFeaturedNews(limit = 3) {
  return news.filter((n) => n.featured).slice(0, limit).length
    ? news.filter((n) => n.featured).slice(0, limit)
    : news.slice(0, limit);
}

export function getNewsBySlug(slug: string) {
  return news.find((n) => n.slug === slug);
}

export function getEvents() {
  return events;
}

export function getDocuments() {
  return documents;
}

export function getNctCommuniques() {
  return nctCommuniques;
}

export function getEServices() {
  return eServices;
}
