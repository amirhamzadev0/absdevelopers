import data from "@/data/mock/leaders.json";
import type { Leader } from "@/models/leader";
import type { LeaderRepository } from "@/repositories/contracts";

const leaders = data as Leader[];

export class MockLeaderRepository implements LeaderRepository {
  async list(): Promise<Leader[]> {
    return structuredClone(leaders);
  }
}
