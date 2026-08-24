import type { Department } from "./types";

const px = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=600&h=375&fit=crop`;

export const departments: Department[] = [
  {
    id: "press-public-relations",
    name: "Press and Public Relations",
    summary: "Manages the Ministry's public communications, media relations, and press engagements.",
    photoUrl: px(34398676),
  },
  {
    id: "rail-transport-services",
    name: "Rail Transport Services",
    summary: "Oversees policy and regulatory matters relating to rail transport across Nigeria.",
    photoUrl: "/images/stock/dept-rail-transport.jpg",
  },
  {
    id: "road-transport-mass-transit",
    name: "Road Transport & Mass Transit Administration",
    summary: "Coordinates national road transport policy and mass transit administration.",
    photoUrl: "https://images.unsplash.com/photo-1707008810904-f42b415fd99b?auto=format&fit=crop&w=600&h=375&q=80",
  },
  {
    id: "engineering-services",
    name: "Engineering Services",
    summary: "Provides engineering oversight for transport infrastructure projects.",
    photoUrl: "/images/stock/dept-engineering-services.jpg",
  },
  {
    id: "transport-planning-coordination",
    name: "Transport Planning & Coordination",
    summary: "Leads strategic planning and inter-agency coordination for the transport sector.",
    photoUrl: "/images/stock/dept-transport-planning.jpg",
  },
  {
    id: "special-duties",
    name: "Special Duties",
    summary: "Handles special assignments and cross-cutting initiatives for the Ministry.",
    photoUrl: "/images/stock/dept-special-duties.jpg",
  },
  {
    id: "human-resources-management",
    name: "Human Resources Management",
    summary: "Manages staffing, welfare, and human capital development across the Ministry.",
    photoUrl: px(30689321),
  },
  {
    id: "finance-accounts",
    name: "Finance and Accounts",
    summary: "Oversees the Ministry's budgeting, financial management, and accounting.",
    photoUrl: px(30677710),
  },
  {
    id: "reform-coordination",
    name: "Reform Coordination & Service Improvement",
    summary: "Drives civil service reform and service delivery improvement initiatives.",
    photoUrl: px(30688588),
  },
  {
    id: "procurement",
    name: "Procurement",
    summary: "Manages the Ministry's procurement processes in line with due process guidelines.",
    photoUrl: px(30677596),
  },
  {
    id: "general-services",
    name: "General Services",
    summary: "Provides administrative and logistical support services across the Ministry.",
    photoUrl: "https://images.unsplash.com/photo-1554457606-ed16c39db884?auto=format&fit=crop&w=600&h=375&q=80",
  },
  {
    id: "internal-audit",
    name: "Internal Audit",
    summary: "Provides independent assurance over the Ministry's financial and operational controls.",
    photoUrl: px(38649010),
  },
  {
    id: "legal-services",
    name: "Legal Services Unit",
    summary: "Provides legal advisory and drafting support to the Ministry.",
    photoUrl: px(34659065),
  },
  {
    id: "ppp-unit",
    name: "Public Private Partnership Unit",
    summary: "Coordinates public-private partnership initiatives within the transport sector.",
    photoUrl: px(36201583),
  },
  {
    id: "survey-hydrographics",
    name: "Survey & Hydrographics Unit",
    summary: "Conducts survey and hydrographic work supporting transport infrastructure planning.",
    photoUrl: px(27571326),
  },
];
