import "server-only";
import { cache } from "react";
import { insightService, pageService } from "@/server/container";
import { listQuerySchema } from "@/services/insight.service";

/** Untrusted searchParams in, a valid first page out (bad values fall back to defaults). */
export const getInsightListViewModel = cache(async (search?: string, page?: string) => {
  const parsed = listQuerySchema.safeParse({ search: search || undefined, page });
  const query = parsed.success ? parsed.data : listQuerySchema.parse({});
  const [content, result] = await Promise.all([
    pageService.get("insights"),
    insightService.list(query),
  ]);
  return { content, initialResult: result, initialSearch: query.search ?? "" };
});

export const getInsightDetailViewModel = cache(async (slug: string) => {
  const insight = await insightService.findBySlug(slug);
  if (!insight) return null;
  const related = await insightService.related(slug, 3);
  return { insight, related };
});

export async function getInsightSlugs(): Promise<string[]> {
  const all = await insightService.list({ pageSize: 50 });
  return all.items.map((insight) => insight.slug);
}
