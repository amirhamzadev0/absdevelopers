import data from "@/data/mock/insights.json";
import type { Insight } from "@/models/insight";
import type { InsightRepository } from "@/repositories/contracts";

const insights = data as Insight[];

export class MockInsightRepository implements InsightRepository {
  async list(): Promise<Insight[]> {
    return structuredClone(insights);
  }

  async findBySlug(slug: string): Promise<Insight | null> {
    const insight = insights.find((item) => item.slug === slug);
    return insight ? structuredClone(insight) : null;
  }
}
