export interface RouteSeo {
  title: string;
  description: string;
}

export const routeSeo = {
  home: {
    title: "ABS Developers — Building landmarks. Shaping generations.",
    description:
      "Shariah-compliant real-estate developer behind Burj Quaid, Pearl One Tower and 13+ residential, commercial and mixed-use developments across Pakistan.",
  },
  projects: {
    title: "Our Projects",
    description:
      "Explore all ABS Developers projects in Lahore, Karachi, Islamabad and Sialkot — residential towers, malls and mixed-use landmarks.",
  },
  about: {
    title: "About Us",
    description: "Meet the people and principles behind ABS Developers.",
  },
  shariah: {
    title: "Shariah Compliant",
    description:
      "No price difference, zero late fees, lab-tested materials and on-time delivery — the principles behind every ABS development.",
  },
  insights: {
    title: "Insights",
    description:
      "Property, construction, investment and lifestyle insights from the ABS Developers journal.",
  },
  live: {
    title: "Live Construction",
    description: "Watch live construction views from ABS Developers projects.",
  },
  contact: {
    title: "Contact Us",
    description:
      "Call, WhatsApp or email ABS Developers, or register your interest in a development.",
  },
  privacy: {
    title: "Privacy Policy",
    description: "How ABS Developers handles the information you share with us.",
  },
} satisfies Record<string, RouteSeo>;
