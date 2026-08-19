import type { ImageManifestEntry } from "./types";

/**
 * Every non-authored image, logged with source/license for a pre-launch
 * audit. All entries below were pulled directly from the live
 * transportation.gov.ng site (the ministry's own official assets) on
 * 2026-08-19, per explicit user confirmation for each batch.
 */
export const imageManifest: ImageManifestEntry[] = [
  {
    path: "/images/brand/fmt-coat-of-arms.png",
    usage: "Header/footer logo lockup, both directions",
    source: "official",
    sourceUrl: "https://transportation.gov.ng/wp-content/uploads/2020/07/FMT_Coat_of_arms_of_Nigeria_Icon.png",
    attribution: "Federal Ministry of Transportation (official site asset)",
  },
  {
    path: "/images/sourced/minister-alkali.jpeg",
    usage: "Minister portrait — Leadership page, Welcome Message block",
    source: "official",
    sourceUrl: "https://transportation.gov.ng/wp-content/uploads/2021/03/New-HMT-1.jpeg",
    attribution: "Federal Ministry of Transportation (official site asset)",
  },
  {
    path: "/images/sourced/agency-nrc.jpg",
    usage: "Nigerian Railway Corporation agency card",
    source: "official",
    sourceUrl: "https://transportation.gov.ng/wp-content/uploads/2021/03/Nigeria-Railway-Corporation-NRC-600x300.jpg",
    attribution: "Federal Ministry of Transportation (official site asset)",
  },
  {
    path: "/images/sourced/agency-nitt.jpg",
    usage: "Nigerian Institute of Transport Technology agency card (fallback)",
    source: "official",
    sourceUrl: "https://transportation.gov.ng/wp-content/uploads/2020/07/nitt5.jpg",
    attribution: "Federal Ministry of Transportation (official site asset)",
  },
  {
    path: "/images/sourced/agency-nitt-campus.jpg",
    usage: "Nigerian Institute of Transport Technology agency card",
    source: "official",
    sourceUrl: "https://transportation.gov.ng/wp-content/uploads/2021/03/Institute-of-Transport-Technology-Zaria.jpg",
    attribution: "Federal Ministry of Transportation (official site asset)",
  },
  {
    path: "/images/sourced/dept-reform-coordination.jpg",
    usage: "Reform Coordination & Service Improvement department card",
    source: "official",
    sourceUrl: "https://transportation.gov.ng/wp-content/uploads/2020/07/reforms403220.jpg",
    attribution: "Federal Ministry of Transportation (official site asset)",
  },
  {
    path: "/images/sourced/dept-transport-planning.jpg",
    usage: "Transport Planning & Coordination department card",
    source: "official",
    sourceUrl: "https://transportation.gov.ng/wp-content/uploads/2020/07/tpc403220.jpg",
    attribution: "Federal Ministry of Transportation (official site asset)",
  },
  {
    path: "/images/sourced/dept-special-duties.jpg",
    usage: "Special Duties department card",
    source: "official",
    sourceUrl: "https://transportation.gov.ng/wp-content/uploads/2020/07/specialduties.jpg",
    attribution: "Federal Ministry of Transportation (official site asset)",
  },
  {
    path: "/images/sourced/dept-press-relations.png",
    usage: "Press and Public Relations department card",
    source: "official",
    sourceUrl: "https://transportation.gov.ng/wp-content/uploads/2023/08/PPR-Image.png",
    attribution: "Federal Ministry of Transportation (official site asset)",
  },
  {
    path: "/images/sourced/dept-finance-accounts.jpg",
    usage: "Finance and Accounts department card",
    source: "official",
    sourceUrl: "https://transportation.gov.ng/wp-content/uploads/2020/07/Finance_accounts1.jpg",
    attribution: "Federal Ministry of Transportation (official site asset)",
  },
  {
    path: "/images/sourced/dept-rail-transport.jpg",
    usage: "Rail Transport Services department card",
    source: "official",
    sourceUrl: "https://transportation.gov.ng/wp-content/uploads/2020/07/Rail-Transport-Services.jpg",
    attribution: "Federal Ministry of Transportation (official site asset)",
  },
  {
    path: "/images/sourced/dept-hrm.jpg",
    usage: "Human Resources Management department card",
    source: "official",
    sourceUrl: "https://transportation.gov.ng/wp-content/uploads/2020/07/hrm-1024x576.jpg",
    attribution: "Federal Ministry of Transportation (official site asset)",
  },
  {
    path: "/images/sourced/news-category-online.jpg",
    usage: "Generic image for 'Online News Report' category items",
    source: "official",
    sourceUrl: "https://transportation.gov.ng/wp-content/uploads/2025/12/ONLINE-NEWS-REPORT-DEC-10-25-506x560.jpg",
    attribution: "Federal Ministry of Transportation (official site asset)",
  },
  {
    path: "/images/sourced/news-category-press.jpg",
    usage: "Generic image for 'Press Release' category items",
    source: "official",
    sourceUrl: "https://transportation.gov.ng/wp-content/uploads/2025/12/PRESS-RELEASE-PIX-1-517x560.jpg",
    attribution: "Federal Ministry of Transportation (official site asset)",
  },
  {
    path: "/images/sourced/news-category-photo.jpeg",
    usage: "Generic image for 'Photo News' category items",
    source: "official",
    sourceUrl: "https://transportation.gov.ng/wp-content/uploads/2025/10/PHOTO-NEWS-IMAGE-4-1-560x374.jpeg",
    attribution: "Federal Ministry of Transportation (official site asset)",
  },
];
