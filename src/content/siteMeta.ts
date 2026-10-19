import type { SiteMeta } from "./types";

/**
 * The defaults for the public contact details. Once the admin database is in
 * use, anything saved under "Contact details & links" overrides these.
 */
export const siteMeta: SiteMeta = {
  name: "Federal Ministry of Transportation",
  shortName: "FMT",
  country: "Federal Republic of Nigeria",
  address: "Bukar Dipcharima House, Central Business District, FCT, Abuja, Nigeria",
  hours: "Mon – Fri: 8:00 am – 4:00 pm",
  /** The Ministry's public telephone number. Hidden while empty: the old value was a placeholder, never a real line. */
  phone: null,
  email: "info@transportation.gov.ng",
  social: {
    x: "https://x.com/MinTransportNG",
    instagram: "https://www.instagram.com/transportchroniclesng/",
    facebook: "https://www.facebook.com/MinTransportNG/",
    youtube: "https://www.youtube.com/@federalministryoftransport1982",
  },
};
