import "server-only";
import { cache } from "react";
import type { Project, ProjectCardView, ProjectCategory, ProjectStatus } from "@/models/project";
import { pageService, projectService } from "@/server/container";

const statusLabels: Record<ProjectStatus, string> = {
  completed: "Completed",
  ongoing: "Ongoing",
  "pre-launch": "Pre-launch",
};

const categoryLabels: Record<ProjectCategory, string> = {
  residential: "Residential",
  commercial: "Commercial",
  "mixed-use": "Mixed-use",
};

export function toProjectCard(project: Project): ProjectCardView {
  return {
    slug: project.slug,
    name: project.name,
    number: String(project.order).padStart(2, "0"),
    city: project.city,
    category: categoryLabels[project.category],
    status: statusLabels[project.status],
    summary: project.summary,
    image: project.image,
  };
}

export const getProjectListViewModel = cache(async () => {
  const [content, projects, cities] = await Promise.all([
    pageService.get("projects"),
    projectService.list(),
    projectService.cities(),
  ]);
  return { content, projects: projects.map(toProjectCard), cities };
});

export const getProjectDetailViewModel = cache(async (slug: string) => {
  const project = await projectService.findBySlug(slug);
  if (!project) return null;
  const [related, projectOptions] = await Promise.all([
    projectService.related(slug, 3),
    projectService.options(),
  ]);
  return {
    project,
    status: statusLabels[project.status],
    category: categoryLabels[project.category],
    related: related.map(toProjectCard),
    projectOptions,
  };
});

export async function getProjectSlugs(): Promise<string[]> {
  return (await projectService.list()).map((project) => project.slug);
}
