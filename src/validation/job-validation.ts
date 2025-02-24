import {z, ZodType} from "zod";

export class JobValidation {
  static readonly CREATE: ZodType = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    status: z.enum(["OPEN", "CLOSED", "DRAFT"]),
    job_type: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"]),
    workplace_type: z.enum(["ONSITE", "REMOTE", "HYBRID"]),
    experience_level: z.enum(["JUNIOR", "MID", "SENIOR"]),
    location: z.string().min(1).optional(),
    salary_range: z.string().min(1).optional(),
    expiry_date: z.string().min(1).optional(),
  });
}
