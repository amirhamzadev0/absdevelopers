import type { ContentBlock } from "./content";

export type ProjectCategory = "residential" | "commercial" | "mixed-use";

export type ProjectStatus = "completed" | "ongoing" | "pre-launch";

export interface ProjectFact {
  label: string;
  value: string;
}

export interface UnitType {
  name: string;
  /** Net / gross area in sq ft, when published. */
  area?: string;
}

export interface Project {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  city: string;
  location: string;
  category: ProjectCategory;
  status: ProjectStatus;
  summary: string;
  image: string;
  facts: ProjectFact[];
  highlights: string[];
  amenities: string[];
  unitTypes: UnitType[];
  /** Travel times / nearby landmarks. */
  connectivity: string[];
  body: ContentBlock[];
  order: number;
  featured: boolean;
}

export interface ProjectOption {
  slug: string;
  name: string;
}

/** Display-ready project card (labels resolved, number zero-padded). */
export interface ProjectCardView {
  slug: string;
  name: string;
  number: string;
  city: string;
  category: string;
  status: string;
  summary: string;
  image: string;
}
