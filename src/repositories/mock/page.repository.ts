import data from "@/data/mock/pages.json";
import type { PageContentMap, PageKey } from "@/models/page";
import type { PageRepository } from "@/repositories/contracts";

const pages = data as PageContentMap;

export class MockPageRepository implements PageRepository {
  async get<K extends PageKey>(key: K): Promise<PageContentMap[K]> {
    return structuredClone(pages[key]);
  }
}
