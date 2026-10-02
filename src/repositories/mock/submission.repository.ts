import { randomUUID } from "node:crypto";
import type { InterestInput, SubmissionRecord } from "@/models/submission";
import type { SubmissionRepository } from "@/repositories/contracts";

const MAX_RECORDS = 1_000;

/** In-memory store for Phase 1. Oldest records are dropped beyond MAX_RECORDS. */
export class MockSubmissionRepository implements SubmissionRepository {
  private records: SubmissionRecord<InterestInput>[] = [];

  async saveInterest(input: InterestInput): Promise<SubmissionRecord<InterestInput>> {
    const record: SubmissionRecord<InterestInput> = {
      id: randomUUID(),
      kind: "interest",
      payload: structuredClone(input),
      createdAt: new Date().toISOString(),
    };
    this.records.push(record);
    if (this.records.length > MAX_RECORDS)
      this.records.splice(0, this.records.length - MAX_RECORDS);
    return structuredClone(record);
  }

  count(): number {
    return this.records.length;
  }
}
