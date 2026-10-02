import "server-only";
import { cache } from "react";
import { insightService, leaderService, pageService, projectService } from "@/server/container";

export const getAboutViewModel = cache(async () => {
  const [content, leaders, insights] = await Promise.all([
    pageService.get("about"),
    leaderService.list(),
    insightService.latest(3),
  ]);
  return { content, leaders, insights };
});

export const getShariahViewModel = cache(async () => {
  const [content, insights] = await Promise.all([
    pageService.get("shariah"),
    insightService.latest(3),
  ]);
  return { content, insights };
});

export const getLiveViewModel = cache(async () => {
  const content = await pageService.get("live");
  const project = await projectService.findBySlug(content.featuredProjectSlug);
  return { content, project };
});

export const getContactViewModel = cache(async () => {
  const [content, site, projectOptions] = await Promise.all([
    pageService.get("contact"),
    pageService.siteInfo(),
    projectService.options(),
  ]);
  return { content, site, projectOptions };
});

export const getPrivacyViewModel = cache(async () => pageService.get("privacy"));
