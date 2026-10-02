import type { Insight } from "@/models/insight";
import type { Leader } from "@/models/leader";
import type { PageContentMap, PageKey } from "@/models/page";
import type { Project } from "@/models/project";
import type { SiteInfo } from "@/models/site";
import type { InterestInput, SubmissionRecord } from "@/models/submission";

export interface ProjectRepository {
  list(): Promise<Project[]>;
  findBySlug(slug: string): Promise<Project | null>;
}

export interface InsightRepository {
  list(): Promise<Insight[]>;
  findBySlug(slug: string): Promise<Insight | null>;
}

export interface LeaderRepository {
  list(): Promise<Leader[]>;
}

export interface PageRepository {
  get<K extends PageKey>(key: K): Promise<PageContentMap[K]>;
}

export interface SiteRepository {
  get(): Promise<SiteInfo>;
}

export interface SubmissionRepository {
  saveInterest(input: InterestInput): Promise<SubmissionRecord<InterestInput>>;
}
