import { z } from "zod";
import type { Project, ProjectOption } from "@/models/project";
import type { ProjectRepository } from "@/repositories/contracts";

export const projectCategories = ["residential", "commercial", "mixed-use"] as const;

export const projectFilterSchema = z.object({
  category: z.enum(projectCategories).optional(),
  city: z.string().trim().max(60).optional(),
});

export type ProjectFilter = z.infer<typeof projectFilterSchema>;

export const slugSchema = z
  .string()
  .trim()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export class ProjectService {
  constructor(private readonly repo: ProjectRepository) {}

  async list(filter: ProjectFilter = {}): Promise<Project[]> {
    const { category, city } = projectFilterSchema.parse(filter);
    const projects = await this.repo.list();
    return projects
      .filter((project) => !category || project.category === category)
      .filter((project) => !city || project.city.toLowerCase() === city.toLowerCase())
      .sort((a, b) => a.order - b.order);
  }

  async findBySlug(slug: string): Promise<Project | null> {
    const parsed = slugSchema.safeParse(slug);
    if (!parsed.success) return null;
    return this.repo.findBySlug(parsed.data);
  }

  async options(): Promise<ProjectOption[]> {
    const projects = await this.list();
    return projects.map(({ slug, name }) => ({ slug, name }));
  }

  async cities(): Promise<string[]> {
    const projects = await this.list();
    return [...new Set(projects.map((project) => project.city))];
  }

  async related(slug: string, limit = 3): Promise<Project[]> {
    const projects = await this.list();
    const current = projects.find((project) => project.slug === slug);
    if (!current) return [];
    const others = projects.filter((project) => project.slug !== slug);
    const sameCity = others.filter((project) => project.city === current.city);
    const rest = others.filter((project) => project.city !== current.city);
    return [...sameCity, ...rest].slice(0, limit);
  }
}
