import {z, ZodType} from "zod";

export class ApplicationValidation {
  static readonly CREATE: ZodType = z.object({
    job_id: z.number().positive(),
    resume: z.string().min(1),
  });

  static readonly UPDATE: ZodType = z.object({
    id: z.number().positive(),
    status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
  });
}
