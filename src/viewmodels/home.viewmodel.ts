import "server-only";
import { cache } from "react";
import { insightService, pageService, projectService } from "@/server/container";
import { toProjectCard } from "@/viewmodels/project.viewmodel";

export const getHomeViewModel = cache(async () => {
  const [content, projects, insights, projectOptions] = await Promise.all([
    pageService.get("home"),
    projectService.list(),
    insightService.latest(3),
    projectService.options(),
  ]);
  return { content, projects: projects.map(toProjectCard), insights, projectOptions };
});
