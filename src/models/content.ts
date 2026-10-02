export type ContentBlock =
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "image"; src: string; alt: string };

export interface SectionHeading {
  eyebrow: string;
  title: string;
  intro?: string;
}

export interface CallToAction {
  label: string;
  href: string;
}

export interface Stat {
  id: string;
  value: number | null;
  /** Shown instead of an animated number when `value` is null. */
  display?: string;
  suffix: string;
  label: string;
}

export interface Principle {
  id: string;
  title: string;
  text: string;
}
