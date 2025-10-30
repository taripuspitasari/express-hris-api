import {z, ZodType} from "zod";

export class LeaveValidation {
  static readonly CREATE: ZodType = z.object({
    user_id: z.number().positive(),
    start_date: z.string(),
    end_date: z.string(),
    type: z.string(),
  });

  static readonly SEARCH: ZodType = z.object({
    status: z.string().max(191).optional(),
    type: z.string().max(191).optional(),
    page: z.number().min(1).positive(),
    size: z.number().min(1).max(100).positive(),
  });
}
