import data from "@/data/mock/projects.json";
import type { Project } from "@/models/project";
import type { ProjectRepository } from "@/repositories/contracts";

const projects = data as Project[];

export class MockProjectRepository implements ProjectRepository {
  async list(): Promise<Project[]> {
    return structuredClone(projects);
  }

  async findBySlug(slug: string): Promise<Project | null> {
    const project = projects.find((item) => item.slug === slug);
    return project ? structuredClone(project) : null;
  }
}
