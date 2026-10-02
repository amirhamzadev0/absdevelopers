import data from "@/data/mock/site.json";
import type { SiteInfo } from "@/models/site";
import type { SiteRepository } from "@/repositories/contracts";

const site = data as SiteInfo;

export class MockSiteRepository implements SiteRepository {
  async get(): Promise<SiteInfo> {
    return structuredClone(site);
  }
}
