import {z, ZodType} from "zod";

export class AttendanceValidation {
  static readonly SEARCH: ZodType = z.object({
    user_id: z.number().positive().optional(),
    employee_number: z.string().max(191).optional(),
    start_date: z.coerce.date().optional(),
    end_date: z.coerce.date().optional(),
    status: z.string().max(191).optional(),
    is_late: z.boolean().optional(),
    page: z.number().min(1).positive(),
    size: z.number().min(1).max(100).positive(),
  });
}
