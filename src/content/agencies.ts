import type { Agency } from "./types";

/**
 * Only two agencies sit under this ministry post-2023 split — maritime
 * agencies (NIMASA, NPA, NIWA, etc.) now belong to the separate Ministry of
 * Marine & Blue Economy. Do not add them here.
 */
export const agencies: Agency[] = [
  {
    id: "nrc",
    name: "Nigerian Railway Corporation",
    shortName: "NRC",
    description:
      "The statutory body responsible for the operation, maintenance, and development of Nigeria's rail network.",
    href: "https://nrc.gov.ng",
    photoUrl: "/images/sourced/agency-nrc.jpg",
  },
  {
    id: "nitt",
    name: "Nigerian Institute of Transport Technology",
    shortName: "NITT",
    description:
      "Nigeria's foremost institute for training and research in transport technology and management.",
    href: "https://nitt.edu.ng",
    photoUrl: "/images/sourced/agency-nitt-campus.jpg",
  },
];
