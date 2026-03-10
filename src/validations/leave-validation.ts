import {z, ZodType} from "zod";

export class LeaveValidation {
  static readonly CREATE: ZodType = z.object({
    user_id: z.number().positive(),
    type: z.string(),
    start_date: z.coerce.date(),
    end_date: z.coerce.date(),
    reason: z.string(),
  });

  static readonly APPROVE: ZodType = z.object({
    user_id: z.number().positive(),
    id: z.number().positive(),
    status: z.string(),
    rejection_reason: z.string().max(191).optional(),
  });

  static readonly SEARCH: ZodType = z.object({
    user_id: z.number().positive().optional(),
    fullname: z.string().max(191).optional(),
    type: z.string().max(191).optional(),
    status: z.string().max(191).optional(),
    page: z.number().min(1).positive(),
    size: z.number().min(1).max(100).positive(),
  });
}
