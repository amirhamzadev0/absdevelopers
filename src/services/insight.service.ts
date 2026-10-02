import { z } from "zod";
import type { Insight, InsightSummary } from "@/models/insight";
import type { ListQuery, PageResult } from "@/models/query";
import type { InsightRepository } from "@/repositories/contracts";
import { slugSchema } from "./project.service";

export const DEFAULT_PAGE_SIZE = 9;

export const listQuerySchema = z.object({
  search: z.string().trim().max(120).optional(),
  page: z.coerce.number().int().min(1).max(1_000).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(DEFAULT_PAGE_SIZE),
});

function toSummary(insight: Insight): InsightSummary {
  const summary: Partial<Insight> = { ...insight };
  delete summary.body;
  return summary as InsightSummary;
}

export class InsightService {
  constructor(private readonly repo: InsightRepository) {}

  async list(query: ListQuery = {}): Promise<PageResult<InsightSummary>> {
    const { search, page, pageSize } = listQuerySchema.parse(query);
    const term = search?.toLowerCase();
    const matches = (await this.sorted()).filter(
      (insight) =>
        !term ||
        insight.title.toLowerCase().includes(term) ||
        insight.excerpt.toLowerCase().includes(term) ||
        insight.category.toLowerCase().includes(term),
    );
    const total = matches.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const current = Math.min(page, totalPages);
    const start = (current - 1) * pageSize;
    return {
      items: matches.slice(start, start + pageSize).map(toSummary),
      total,
      page: current,
      pageSize,
      totalPages,
    };
  }

  async latest(limit = 3): Promise<InsightSummary[]> {
    return (await this.sorted()).slice(0, limit).map(toSummary);
  }

  async findBySlug(slug: string): Promise<Insight | null> {
    const parsed = slugSchema.safeParse(slug);
    if (!parsed.success) return null;
    return this.repo.findBySlug(parsed.data);
  }

  async related(slug: string, limit = 3): Promise<InsightSummary[]> {
    return (await this.sorted())
      .filter((insight) => insight.slug !== slug)
      .slice(0, limit)
      .map(toSummary);
  }

  private async sorted(): Promise<Insight[]> {
    const insights = await this.repo.list();
    return insights.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  }
}
