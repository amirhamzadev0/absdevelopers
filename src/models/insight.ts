import type { ContentBlock } from "./content";

export interface Insight {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  author: string;
  category: string;
  /** ISO date (YYYY-MM-DD). */
  publishedAt: string;
  body: ContentBlock[];
}

export type InsightSummary = Omit<Insight, "body">;
