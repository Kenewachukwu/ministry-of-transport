import type { NewsItem } from "./types";

/**
 * The 18th NCT (Abeokuta, Feb 2024) and Dala Inland Dry Port items reflect
 * real events referenced on the live site. The remaining items are
 * representative placeholder content matching the ministry's real news
 * categories (Online News Report / Press Release / Photo News) — meant to
 * demonstrate the FeaturedNews pattern, not to assert unverified facts.
 * Replace with real copy before launch.
 */
export const news: NewsItem[] = [
  {
    id: "nct-19-preview",
    slug: "19th-national-council-on-transportation-abuja-2026",
    title: "Ministry Welcomes Stakeholders to the 19th National Council on Transportation",
    category: "Press Release",
    excerpt:
      "The 19th NCT will unveil the National Land Transport Policy, with Vice President Kashim Shettima, GCON, as Special Guest of Honour.",
    body: [
      "The Federal Ministry of Transportation is set to welcome stakeholders of all transport modes to the 19th National Council on Transportation (NCT) and the unveiling of the National Land Transport Policy (NLTP) in Abuja, holding 31st August – 3rd September 2026 at the National Judicial Institute Auditorium, Off Airport Bypass, Abuja-FCT.",
      "This year's edition runs under the theme 'Developing Effective Transport System for Nigeria: The Role of Integrated Transportation', with His Excellency, Vice President Kashim Shettima, GCON, attending as Special Guest of Honour.",
    ],
    date: "2026-08-24",
    imageQuery: "19th National Council on Transportation Abuja 2026 flyer",
    imageUrl: "/images/sourced/news-19th-nct.jpeg",
    readTimeMinutes: 2,
    featured: true,
  },
  {
    id: "nct-18-communique",
    slug: "18th-national-council-on-transportation-communique",
    title: "18th National Council on Transportation Concludes in Abeokuta",
    category: "Press Release",
    excerpt:
      "Council resolves to prioritise innovation and technology in tackling the sector's energy and sustainability challenges.",
    body: [
      "The 18th edition of the National Council on Transportation (NCT) held in Abeokuta, Ogun State, under the theme 'Embracing Innovations & Technologies for Sustainable Transportation; Tackling the Energy Challenges'.",
      "State and federal transport stakeholders reviewed progress since the 17th edition and agreed on a set of resolutions to guide the sector's near-term priorities, later published as the 18th Edition Communique.",
    ],
    date: "2024-02-29",
    imageQuery: "government conference hall Nigeria delegates",
    readTimeMinutes: 3,
    featured: true,
  },
  {
    id: "dala-inland-dry-port",
    slug: "dala-inland-dry-port-commissioning",
    title: "Dala Inland Dry Port Commissioned to Ease Cargo Bottlenecks",
    category: "Online News Report",
    excerpt:
      "The new inland dry port is expected to decongest port cities and shorten cargo clearance times for northern Nigeria.",
    body: [
      "The Federal Ministry of Transportation commissioned the Dala Inland Dry Port, extending intermodal cargo capacity further inland and reducing pressure on coastal port infrastructure.",
      "The facility is designed to integrate with rail and road freight corridors, forming part of the Ministry's wider intermodal connectivity goals.",
    ],
    date: "2024-03-14",
    imageQuery: "dry port cargo containers rail",
    readTimeMinutes: 2,
    featured: true,
  },
  {
    id: "rail-rehabilitation-inspection",
    slug: "minister-inspects-rail-rehabilitation-works",
    title: "Minister Inspects Kubwa Rail Station in Abuja",
    category: "Online News Report",
    excerpt:
      "A site visit to assess station facilities and platform readiness along the Abuja rail corridor.",
    body: [
      "The Honourable Minister led a delegation, including security detail and ministry officials, on a site visit to the Kubwa rail station in Abuja, reviewing platform facilities and engaging with staff on outstanding works.",
    ],
    date: "2025-11-04",
    imageQuery: "Minister inspects Kubwa rail station Abuja",
    imageUrl: "/images/sourced/news-whatsapp-2024.jpeg",
    readTimeMinutes: 2,
  },
  {
    id: "road-safety-campaign",
    slug: "ministry-backs-national-road-safety-campaign",
    title: "Ministry Backs National Road Safety Awareness Campaign",
    category: "Press Release",
    excerpt:
      "A joint initiative with road safety agencies to reduce accident rates ahead of the festive travel season.",
    body: [
      "The Ministry announced its backing for a nationwide road safety awareness drive, coordinated with the Federal Road Safety Corps and state transport ministries ahead of the peak travel period.",
    ],
    date: "2025-12-01",
    imageQuery: "highway traffic safety signage Nigeria",
    readTimeMinutes: 2,
  },
  {
    id: "nitt-graduation",
    slug: "nitt-graduation-ceremony",
    title: "NITT Holds Graduation Ceremony for Transport Technology Cohort",
    category: "Photo News",
    excerpt:
      "The Nigerian Institute of Transport Technology marks another cohort's completion of its professional training programmes.",
    body: [
      "Graduates from the Nigerian Institute of Transport Technology's professional and postgraduate programmes were formally conferred at a ceremony attended by Ministry officials.",
    ],
    date: "2026-01-22",
    imageQuery: "graduation ceremony university Nigeria",
    readTimeMinutes: 1,
  },
  {
    id: "fcssip-quarterly-review",
    slug: "fcssip-25-quarterly-review",
    title: "FCSSIP 25 Quarterly Implementation Review Holds at the Ministry",
    category: "Online News Report",
    excerpt:
      "Departmental heads present progress against the Federal Civil Service Strategy Implementation Plan targets.",
    body: [
      "Directors across the Ministry's fifteen departments presented quarterly progress reports against the FCSSIP 25 implementation plan, with the Permanent Secretary chairing the review session.",
    ],
    date: "2026-04-10",
    imageQuery: "office meeting presentation government Nigeria",
    readTimeMinutes: 2,
  },
];
