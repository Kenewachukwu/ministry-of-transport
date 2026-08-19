import type { DocumentItem } from "./types";

export const documents: DocumentItem[] = [
  { id: "finance-act", title: "Finance Act", category: "Finance & Budget", href: "#" },
  {
    id: "fiscal-responsibility-act",
    title: "Fiscal Responsibility Act",
    category: "Relevant Acts",
    href: "#",
  },
  {
    id: "afcfta",
    title: "African Continental Free Trade Area (AfCFTA) Agreement",
    category: "International Agreements",
    href: "#",
  },
  {
    id: "imo-conventions",
    title: "IMO Conventions",
    category: "International Convention & Protocols",
    href: "#",
  },
  {
    id: "ecowas-protocols",
    title: "ECOWAS Protocols",
    category: "International Convention & Protocols",
    href: "#",
  },
  { id: "iata-conventions", title: "IATA Conventions", category: "International Convention & Protocols", href: "#" },
  { id: "port-process-manual", title: "Port Process Manual", category: "Policies", href: "#" },
  {
    id: "nigerian-ports-sop",
    title: "Nigerian Ports Authority Standard Operating Procedure",
    category: "Policies",
    href: "#",
  },
  {
    id: "covid-19-measures",
    title: "COVID-19 Measures and Action Plan",
    category: "Reports",
    href: "#",
  },
  { id: "budget-appropriation", title: "Budget Appropriation", category: "Finance & Budget", href: "#" },
];

export const nctCommuniques: DocumentItem[] = [
  {
    id: "nct-18-communique",
    title: "February 2024 NCT Communique — 18th Edition",
    category: "Reports",
    href: "#",
  },
  {
    id: "nct-17-communique",
    title: "December 2022 NCT Communique — 17th Edition",
    category: "Reports",
    href: "#",
  },
];

export const documentCategories = [
  "All",
  "Finance & Budget",
  "International Agreements",
  "International Convention & Protocols",
  "Policies",
  "Relevant Acts",
  "Reports",
  "Others",
] as const;
