import type { FcssipPage } from "./types";
import { ECMS_URL } from "./nav.config";

/**
 * The FCSSIP 25 page, as data. It was JSX inside the page file until the
 * Ministry's Oct 2026 review asked to be able to add, edit and archive its
 * content. Blocks render in order; consecutive `link` blocks form one list.
 */
export const fcssipPage: FcssipPage = {
  eyebrow: "Federal Civil Service Strategy",
  title: "FCSSIP 25",
  description: "The Federal Civil Service Strategy Implementation Plan (2021–2025) and related staff resources.",
  blocks: [
    {
      type: "paragraph",
      text: "FCSSIP 25 sets out the Ministry’s priorities for reforming service delivery, strengthening institutional capacity, and improving the ease of doing business across the transport sector. It sits alongside the Federal Civil Service Culture Change programme and the Presidential Enabling Business Environment Council’s (PEBEC) ReportGov initiative as part of a wider push to modernise how the civil service operates and serves the public.",
    },
    {
      type: "image",
      src: "/images/sourced/fcssip-25-plan.png",
      alt: "The New Civil Service — Federal Civil Service Strategy and Implementation Plan 2021–2025",
      caption: "Federal Civil Service Strategy and Implementation Plan, 2021–2025.",
      width: 740,
      height: 524,
      size: "full",
    },
    { type: "heading", text: "Staff resources & portals" },
    {
      type: "link",
      label: "View and download FCSSIP 2021–2025",
      href: "https://drive.google.com/file/d/1cyxIvt0FBgsyDX5YtbFgUdYczm62bnJn/view?usp=share_link",
    },
    { type: "link", label: "IPPIS Self-Service", href: "https://servicesoft.ippis.gov.ng/softsuite/" },
    { type: "link", label: "The Federal Civil Service Culture Change video", href: "https://youtu.be/siRjPvkX2PQ" },
    { type: "link", label: "PEBEC ReportGov Portal", href: "https://www.pebec.gov.ng/reportgov-ng" },
    { type: "link", label: "GovMail Portal", href: "https://webmail.transportation.gov.ng/" },
    { type: "link", label: "Ext. Corres.", href: ECMS_URL },
    { type: "heading", text: "FCSSIP 25 at a glance" },
    {
      type: "paragraph",
      text: "The plan’s vision, mission, and six pillars — Capability Building & Talent, Performance Management, IPPIS-Human Resource, Innovation, Digitalisation & Content Services, and Staff Welfare — sit on the enablers and core values below.",
    },
    {
      type: "image",
      src: "/images/sourced/fcssip-pillars.jpg",
      alt: "FCSSIP 25 vision, mission, pillars, enablers, and core values overview",
      width: 895,
      height: 497,
      size: "medium",
    },
  ],
};
