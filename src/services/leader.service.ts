import type { Leader } from "@/models/leader";
import type { LeaderRepository } from "@/repositories/contracts";

export class LeaderService {
  constructor(private readonly repo: LeaderRepository) {}

  async list(): Promise<Leader[]> {
    const leaders = await this.repo.list();
    return leaders.sort((a, b) => a.order - b.order);
  }
}
