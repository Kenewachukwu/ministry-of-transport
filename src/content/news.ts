import type { NewsItem } from "./types";

/**
 * The 18th NCT (Abeokuta, Feb 2024) and Dala Inland Dry Port items reflect
 * real events referenced on the live site. The remaining items are
 * representative placeholder content matching the ministry's real news
 * categories (Online News Report / Press Release / Photo News) — meant to
 * demonstrate the FeaturedNews pattern, not to assert unverified facts.
 * Replace with real copy before launch.
 */
const KANO_MARADI = "/images/news/kano-maradi-inspection-2026-10";

export const news: NewsItem[] = [
  // Real item: the Ministry's press release of 18 October 2026, as issued by Press and Public Relations.
  {
    id: "fg-approves-surveillance-coaches",
    slug: "fg-approves-surveillance-equipment-additional-railway-coaches",
    title: "Federal Government Approves Procurement of Surveillance Equipment, Additional Railway Coaches",
    category: "Press Release",
    excerpt:
      "President Tinubu has approved surveillance and security equipment and additional train coaches, the Permanent Secretary disclosed during an inspection of the Kano–Maradi Railway.",
    body: [
      "In a strategic move to enhance railway transportation, safeguard passengers and critical railway infrastructure, and address security threats, including banditry, kidnapping and vandalism across the country, President Bola Ahmed Tinubu has approved the acquisition of surveillance and security equipment, as well as additional train coaches, to strengthen the movement of people and goods along Nigeria’s railway corridors.",
      "The Permanent Secretary, Federal Ministry of Transportation, Engr. Funso Adebiyi, disclosed this on Saturday, 17 October 2026, during an inspection of the Kano–Daura–Katsina sections of the Kano–Maradi Railway Project.",
      "The inspection was aimed at providing the Ministry with a firsthand assessment of the level of project implementation, identifying outstanding technical, operational and logistical challenges, and evaluating preparedness for the project’s scheduled commissioning in December 2026.",
      "Engr. Adebiyi, accompanied by the Senior Special Assistant to the President on Transportation and Mobility, Prince Adetokunbo Ademola Ade-John, and other key Ministry officials, participated in a beam-launching exercise for the ongoing construction of a railway bridge at Chainage 191 along the Kano–Katsina–Maradi Railway Project.",
      "Speaking on the security challenges confronting railway operations in the country, the Permanent Secretary described insecurity as a major concern for the Ministry, citing the reported incident involving two trains on the Kaduna–Abuja corridor, which he attributed to vandalism and banditry.",
      "He said: “Security challenge has remained a major source of concern to us in the Ministry. You will recall that in Kaduna, the train activities between Kaduna and Abuja, two trains, had a head-on collision. It was due to vandalism and banditry.",
      "“I’m glad to inform you that Mr. President has given the go-ahead for us to embark on the acquisition of surveillance security equipment all across the country, and we are working round the clock to ensure this. I can assure you, by the time we are through, there will be no reason for vandalism. The Nigerian Railway Corporation has also recruited a surveillance team that patrols its routes regularly. So, I can assure you that security is seriously being considered.”",
      "The Permanent Secretary emphasised that the approved acquisition of surveillance and security equipment would strengthen monitoring and protection across railway routes nationwide. He also noted that the Nigerian Railway Corporation (NRC) had recruited a surveillance team to conduct regular patrols along its rail corridors as part of efforts to improve security.",
      "On the procurement and maintenance of additional train coaches, Engr. Adebiyi disclosed that President Tinubu had approved the contract for their acquisition. He further explained that the Ministry was taking steps to ensure that NRC personnel received the necessary training in the operation and maintenance of the new coaches.",
      "According to him, Nigerian Railway Corporation staff would be actively involved in the assembly of the coaches to enhance their technical capacity and facilitate effective maintenance after deployment.",
      "He stated: “Mr. President has approved the contract for the acquisition of more coaches, and we are going the extra mile also to get Nigerian Railway Corporation staff trained in the operation and maintenance of those new coaches. They will be deeply involved in assembling the coaches to ease maintenance thereafter. I can assure you people will be smiling very soon.”",
      "Engr. Adebiyi explained that these measures were designed to build local technical capacity and ensure that Nigerian personnel could undertake essential maintenance activities after the project had been completed and handed over to the Nigerian Railway Corporation.",
      "Earlier, the Senior Special Assistant to the President on Transportation and Mobility, Prince Adetokunbo Ademola Ade-John, commended the progress recorded on the Kano–Maradi Railway Project, describing it as tangible evidence of the Federal Government’s commitment to revitalising Nigeria’s transportation infrastructure under President Tinubu’s Renewed Hope Agenda.",
      "He observed that construction work was progressing across the various project corridors and disclosed that a railway tracking system had received approval in principle as part of broader efforts to strengthen railway security.",
      "Prince Ade-John further revealed that the project’s workforce had increased and working hours had been extended to accelerate construction activities and ensure that the project met its December 2026 deadline.",
      "He expressed optimism that the project would deliver sustainable economic and mobility benefits, improving the movement of people and goods while creating lasting value for both the present generation and generations to come.",
      "The Federal Ministry of Transportation remains committed to strengthening railway security, expanding passenger and freight capacity, building local technical expertise, and supporting the timely delivery of critical railway infrastructure in line with the Federal Government’s Renewed Hope Agenda.",
      "Gift Osima Seddon, for Deputy Director (Press and Public Relations).",
    ],
    date: "2026-10-18",
    imageQuery: "Kano–Maradi railway bridge beam launching Chainage 191",
    imageUrl: `${KANO_MARADI}/beam-launch-crane.jpg`,
    gallery: [
      {
        src: `${KANO_MARADI}/site-office.jpg`,
        alt: "Officials in safety vests and hard hats gathered outside a site office.",
        caption: "Officials at a site office during the inspection",
      },
      {
        src: `${KANO_MARADI}/sleeper-plant.jpg`,
        alt: "Officials in safety vests and white hard hats walking through a railway sleeper production plant.",
        caption: "Inside a railway sleeper production plant",
      },
      {
        src: `${KANO_MARADI}/sleeper-yard.jpg`,
        alt: "Rows of concrete railway sleepers stacked on timber in an open yard.",
        caption: "Concrete railway sleepers stacked in a production yard",
      },
      {
        src: `${KANO_MARADI}/beam-launch-camera.jpg`,
        alt: "A red crane lifting a precast concrete beam beside completed bridge spans, with a camera operator in the foreground.",
        caption: "Beam-launching exercise on the railway bridge at Chainage 191",
      },
      {
        src: `${KANO_MARADI}/beam-launch-bridge-piers.jpg`,
        alt: "Workers watching a red crane lift a precast concrete beam into place beside bridge piers and scaffolding.",
        caption: "A precast beam is lifted into position during the beam-launching exercise",
      },
      {
        src: `${KANO_MARADI}/media-briefing.jpg`,
        alt: "An official in an orange Ministry safety vest speaking into a microphone held by a journalist.",
        caption: "Addressing the media at the end of the inspection",
      },
      {
        src: `${KANO_MARADI}/group-photograph.jpg`,
        alt: "A group photograph of officials and project staff in orange and yellow safety vests and white hard hats.",
        caption: "Group photograph on site",
      },
    ],
    readTimeMinutes: 3,
    featured: true,
  },
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
