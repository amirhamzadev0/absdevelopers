import "server-only";
import { cache } from "react";
import { footerNavigation, mainNavigation, registerInterestHref } from "@/config/navigation";
import { pageService } from "@/server/container";

export const getShellViewModel = cache(async () => {
  const site = await pageService.siteInfo();
  return {
    site,
    navigation: mainNavigation,
    footerNavigation,
    registerInterestHref,
    year: new Date().getFullYear(),
  };
});

export type ShellViewModel = Awaited<ReturnType<typeof getShellViewModel>>;
