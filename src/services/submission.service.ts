import { z } from "zod";
import type { InterestInput, SubmissionResult } from "@/models/submission";
import type { ProjectRepository, SubmissionRepository } from "@/repositories/contracts";

const phone = z
  .string()
  .trim()
  .min(7, "Enter a valid phone number.")
  .max(40)
  .regex(/^[+()\d\s-]+$/, "Use digits, spaces, +, - or brackets only.");

export const OTHER_PROJECT = "other";

export const interestSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required.").max(80),
  lastName: z.string().trim().min(1, "Last name is required.").max(80),
  email: z.email("Enter a valid email address.").trim().max(160),
  phone,
  whatsapp: phone,
  unitType: z.enum(["residential", "commercial", "not-sure"], "Select a unit type."),
  project: z.string().trim().min(1, "Select a development.").max(120),
  message: z.string().trim().max(5_000).optional(),
  consent: z.literal(true, "Please agree to be contacted."),
  path: z.string().trim().max(300).optional(),
});

export class SubmissionService {
  constructor(
    private readonly submissions: SubmissionRepository,
    private readonly projects: ProjectRepository,
  ) {}

  async submitInterest(input: unknown): Promise<SubmissionResult> {
    const data: InterestInput = interestSchema.parse(input);
    if (data.project !== OTHER_PROJECT && !(await this.projects.findBySlug(data.project))) {
      throw new z.ZodError([
        {
          code: "custom",
          path: ["project"],
          message: "Select a development from the list.",
          input: data.project,
        },
      ]);
    }
    const record = await this.submissions.saveInterest(data);
    return {
      id: record.id,
      message: "Thank you — our team will contact you shortly.",
    };
  }
}
