import type { PageContentMap, PageKey } from "@/models/page";
import type { SiteInfo } from "@/models/site";
import type { PageRepository, SiteRepository } from "@/repositories/contracts";

export class PageService {
  constructor(
    private readonly pages: PageRepository,
    private readonly site: SiteRepository,
  ) {}

  get<K extends PageKey>(key: K): Promise<PageContentMap[K]> {
    return this.pages.get(key);
  }

  siteInfo(): Promise<SiteInfo> {
    return this.site.get();
  }
}
