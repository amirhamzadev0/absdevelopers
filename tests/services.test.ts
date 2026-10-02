import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ZodError } from "zod";
import { MockInsightRepository } from "@/repositories/mock/insight.repository";
import { MockPageRepository } from "@/repositories/mock/page.repository";
import { MockProjectRepository } from "@/repositories/mock/project.repository";
import { MockSubmissionRepository } from "@/repositories/mock/submission.repository";
import { InsightService } from "@/services/insight.service";
import { ProjectService } from "@/services/project.service";
import { SubmissionService } from "@/services/submission.service";

const projectRepository = new MockProjectRepository();
const projects = new ProjectService(projectRepository);
const insights = new InsightService(new MockInsightRepository());

const validInterest = {
  firstName: "Ayesha",
  lastName: "Khan",
  email: "ayesha@example.com",
  phone: "+92 300 1234567",
  whatsapp: "+92 300 1234567",
  unitType: "residential",
  project: "burj-quaid",
  message: "Interested in a 2 BHK.",
  consent: true,
};

describe("ProjectService", () => {
  it("lists all 13 projects in display order", async () => {
    const list = await projects.list();
    assert.equal(list.length, 13);
    assert.deepEqual(
      list.map((project) => project.order),
      [...list.map((project) => project.order)].sort((a, b) => a - b),
    );
    assert.equal(list[0].slug, "burj-quaid");
  });

  it("filters by city and category", async () => {
    const lahore = await projects.list({ city: "lahore" });
    assert.ok(lahore.length > 0);
    assert.ok(lahore.every((project) => project.city === "Lahore"));
    const residential = await projects.list({ category: "residential" });
    assert.ok(residential.every((project) => project.category === "residential"));
  });

  it("rejects an unknown category", async () => {
    await assert.rejects(() => projects.list({ category: "castle" as never }), ZodError);
  });

  it("finds by slug and returns null for unknown or malformed slugs", async () => {
    assert.equal((await projects.findBySlug("pearl-one-tower"))?.status, "completed");
    assert.equal(await projects.findBySlug("does-not-exist"), null);
    assert.equal(await projects.findBySlug("../etc/passwd"), null);
  });

  it("returns related projects excluding the current one", async () => {
    const related = await projects.related("abs-central", 3);
    assert.equal(related.length, 3);
    assert.ok(related.every((project) => project.slug !== "abs-central"));
  });

  it("does not let callers mutate repository data", async () => {
    const first = await projects.findBySlug("burj-quaid");
    assert.ok(first);
    first.name = "Mutated";
    first.facts.length = 0;
    const second = await projects.findBySlug("burj-quaid");
    assert.equal(second?.name, "Burj Quaid");
    assert.ok(second && second.facts.length > 0);
  });
});

describe("InsightService", () => {
  it("sorts newest first and paginates", async () => {
    const page1 = await insights.list({ pageSize: 5 });
    assert.equal(page1.total, 12);
    assert.equal(page1.totalPages, 3);
    assert.equal(page1.items.length, 5);
    const dates = page1.items.map((item) => item.publishedAt);
    assert.deepEqual(dates, [...dates].sort().reverse());
    const page3 = await insights.list({ pageSize: 5, page: 3 });
    assert.equal(page3.items.length, 2);
  });

  it("clamps an out-of-range page to the last page", async () => {
    const result = await insights.list({ pageSize: 5, page: 99 });
    assert.equal(result.page, 3);
  });

  it("searches titles, excerpts and categories", async () => {
    const result = await insights.list({ search: "ring road" });
    assert.ok(
      result.items.some(
        (item) => item.slug === "lahore-ring-road-how-its-changing-property-values-nearby",
      ),
    );
    const none = await insights.list({ search: "zzzz-no-match" });
    assert.equal(none.total, 0);
    assert.equal(none.totalPages, 1);
  });

  it("omits the body from list items", async () => {
    const { items } = await insights.list();
    assert.ok(items.every((item) => !("body" in item)));
  });

  it("rejects invalid page sizes", async () => {
    await assert.rejects(() => insights.list({ pageSize: 0 }), ZodError);
    await assert.rejects(() => insights.list({ pageSize: 500 }), ZodError);
  });
});

describe("PageRepository", () => {
  it("returns cloned page content", async () => {
    const pages = new MockPageRepository();
    const home = await pages.get("home");
    home.hero.title = "Mutated";
    assert.equal((await pages.get("home")).hero.title, "The Tallest Tower");
  });
});

describe("SubmissionService", () => {
  it("accepts a valid interest submission", async () => {
    const store = new MockSubmissionRepository();
    const service = new SubmissionService(store, projectRepository);
    const result = await service.submitInterest(validInterest);
    assert.ok(result.id);
    assert.equal(store.count(), 1);
  });

  it("accepts 'other' as the project", async () => {
    const service = new SubmissionService(new MockSubmissionRepository(), projectRepository);
    await assert.doesNotReject(() =>
      service.submitInterest({ ...validInterest, project: "other" }),
    );
  });

  it("rejects an invalid email", async () => {
    const service = new SubmissionService(new MockSubmissionRepository(), projectRepository);
    await assert.rejects(
      () => service.submitInterest({ ...validInterest, email: "not-an-email" }),
      ZodError,
    );
  });

  it("rejects missing required fields and missing consent", async () => {
    const service = new SubmissionService(new MockSubmissionRepository(), projectRepository);
    const withoutName: Partial<typeof validInterest> = { ...validInterest };
    delete withoutName.firstName;
    await assert.rejects(() => service.submitInterest(withoutName), ZodError);
    await assert.rejects(
      () => service.submitInterest({ ...validInterest, consent: false }),
      ZodError,
    );
  });

  it("rejects an unknown project slug", async () => {
    const service = new SubmissionService(new MockSubmissionRepository(), projectRepository);
    await assert.rejects(
      () => service.submitInterest({ ...validInterest, project: "imaginary-tower" }),
      (error: unknown) => error instanceof ZodError && error.issues[0].path[0] === "project",
    );
  });

  it("keeps at most 1,000 records in memory", async () => {
    const store = new MockSubmissionRepository();
    const service = new SubmissionService(store, projectRepository);
    for (let i = 0; i < 1_005; i += 1) await service.submitInterest(validInterest);
    assert.equal(store.count(), 1_000);
  });
});
