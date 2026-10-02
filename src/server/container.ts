import "server-only";
import { MockInsightRepository } from "@/repositories/mock/insight.repository";
import { MockLeaderRepository } from "@/repositories/mock/leader.repository";
import { MockPageRepository } from "@/repositories/mock/page.repository";
import { MockProjectRepository } from "@/repositories/mock/project.repository";
import { MockSiteRepository } from "@/repositories/mock/site.repository";
import { MockSubmissionRepository } from "@/repositories/mock/submission.repository";
import { InsightService } from "@/services/insight.service";
import { LeaderService } from "@/services/leader.service";
import { PageService } from "@/services/page.service";
import { ProjectService } from "@/services/project.service";
import { SubmissionService } from "@/services/submission.service";

// Composition root. Phase 2 swaps the Mock* adapters for Mysql* ones here — nowhere else.
const projectRepository = new MockProjectRepository();

export const projectService = new ProjectService(projectRepository);
export const insightService = new InsightService(new MockInsightRepository());
export const leaderService = new LeaderService(new MockLeaderRepository());
export const pageService = new PageService(new MockPageRepository(), new MockSiteRepository());
export const submissionService = new SubmissionService(
  new MockSubmissionRepository(),
  projectRepository,
);
