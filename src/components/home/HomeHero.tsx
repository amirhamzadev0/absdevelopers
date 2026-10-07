import type { HomePageContent } from "@/models/page";
import { PearlCapitalHero } from "./PearlCapitalHero";

export function HomeHero({ hero }: { hero?: HomePageContent["hero"] }) {
  return <PearlCapitalHero initialTitle={hero?.title} />;
}
