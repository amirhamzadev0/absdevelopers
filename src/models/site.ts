export interface Office {
  id: string;
  label: string;
  address: string;
  city: string;
}

export type SocialPlatform = "instagram" | "facebook" | "linkedin";

export interface SocialLink {
  platform: SocialPlatform;
  label: string;
  href: string;
}

export interface ContactChannel {
  id: "phone" | "whatsapp" | "email";
  label: string;
  value: string;
  href: string;
  note: string;
}

export interface SiteInfo {
  name: string;
  tagline: string;
  description: string;
  country: string;
  email: string;
  phone: string;
  phoneHref: string;
  whatsappHref: string;
  headOffice: Office;
  channels: ContactChannel[];
  social: SocialLink[];
}

export interface NavItem {
  key: string;
  label: string;
  href: string;
}
