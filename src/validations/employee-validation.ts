import {z, ZodType} from "zod";

export class EmployeeValidation {
  static readonly CREATE: ZodType = z.object({
    user_id: z.number().positive(),
    position: z.string().min(1).max(191),
    department_id: z.number().positive(),
    join_date: z.coerce.date(),
    status: z.string().min(1).max(191),
  });

  static readonly UPDATE: ZodType = z.object({
    id: z.number().positive(),
    position: z.string().min(1).max(191).optional(),
    department_id: z.number().positive().optional(),
    join_date: z.coerce.date().optional(),
    status: z.string().min(1).max(191).optional(),
  });

  static readonly SEARCH: ZodType = z.object({
    name: z.string().max(191).optional(),
    status: z.string().max(191).optional(),
    department_id: z.string().optional(),
    page: z.number().min(1).positive(),
    size: z.number().min(1).max(100).positive(),
  });
}
