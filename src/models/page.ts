import type { CallToAction, ContentBlock, Principle, SectionHeading, Stat } from "./content";

export interface HomePageContent {
  hero: {
    eyebrow: string;
    title: string;
    /** Second line of the headline, set in the accent colour. */
    titleAccent: string;
    text: string;
    badge: { value: string; label: string };
    image: string;
    imageAlt: string;
    primary: CallToAction;
    secondary: CallToAction;
  };
  stats: Stat[];
  projects: SectionHeading;
  interest: SectionHeading;
  insights: SectionHeading;
}

export interface AboutPageContent {
  hero: SectionHeading;
  story: { heading: SectionHeading; body: ContentBlock[] };
  stats: Stat[];
  leadership: SectionHeading;
  values: { heading: SectionHeading; items: Principle[] };
}

export interface ShariahPageContent {
  hero: SectionHeading;
  principles: { heading: SectionHeading; items: Principle[] };
  commitment: SectionHeading;
}

export interface SimplePageContent {
  hero: SectionHeading;
  body: ContentBlock[];
}

export interface LivePageContent {
  hero: SectionHeading;
  featuredProjectSlug: string;
  note: string;
}

export interface PageContentMap {
  home: HomePageContent;
  about: AboutPageContent;
  shariah: ShariahPageContent;
  projects: SectionHeading;
  insights: SectionHeading;
  live: LivePageContent;
  contact: SectionHeading;
  privacy: SimplePageContent;
}

export type PageKey = keyof PageContentMap;
