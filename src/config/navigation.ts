import type { NavItem } from "@/models/site";

export const mainNavigation: NavItem[] = [
  { key: "home", label: "Home", href: "/" },
  { key: "projects", label: "Our Projects", href: "/projects" },
  { key: "about", label: "About Us", href: "/about" },
  { key: "shariah", label: "Shariah Compliant", href: "/shariah-compliant" },
  { key: "insights", label: "Insights", href: "/insights" },
  { key: "contact", label: "Contact Us", href: "/contact" },
];

export const footerNavigation: NavItem[] = [
  { key: "home", label: "Home", href: "/" },
  { key: "projects", label: "Our Projects", href: "/projects" },
  { key: "about", label: "About Us", href: "/about" },
  { key: "shariah", label: "Shariah Compliant", href: "/shariah-compliant" },
  { key: "insights", label: "Insights", href: "/insights" },
  { key: "live", label: "Live Construction", href: "/live" },
  { key: "privacy", label: "Privacy Policy", href: "/privacy-policy" },
];

export const registerInterestHref = "/contact#register-interest";
