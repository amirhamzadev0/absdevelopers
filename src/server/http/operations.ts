import "server-only";
import { z } from "zod";
import { insightService, projectService, submissionService } from "@/server/container";
import { listQuerySchema } from "@/services/insight.service";
import { projectFilterSchema } from "@/services/project.service";

export class HttpError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

type GetHandler = (params: URLSearchParams) => Promise<unknown>;
type PostHandler = (body: unknown) => Promise<unknown>;

const slugQuery = z.object({ slug: z.string().trim().min(1).max(120) });

function query(params: URLSearchParams): Record<string, string> {
  return Object.fromEntries(params.entries());
}

async function orNotFound<T>(value: Promise<T | null>, label: string): Promise<T> {
  const result = await value;
  if (!result) throw new HttpError(404, `${label} not found.`);
  return result;
}

export const getOperations: Record<string, GetHandler> = {
  getProjectList: async (params) => projectService.list(projectFilterSchema.parse(query(params))),
  getProjectBySlug: async (params) =>
    orNotFound(projectService.findBySlug(slugQuery.parse(query(params)).slug), "Project"),
  getInsightList: async (params) => insightService.list(listQuerySchema.parse(query(params))),
  getInsightBySlug: async (params) =>
    orNotFound(insightService.findBySlug(slugQuery.parse(query(params)).slug), "Insight"),
};

export const postOperations: Record<string, PostHandler> = {
  submitInterest: async (body) => submissionService.submitInterest(body),
};
