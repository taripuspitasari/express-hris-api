import {z, ZodType} from "zod";

export class PositionValidation {
  static readonly CREATE: ZodType = z.object({
    name: z.string().min(1).max(191),
    level: z.string().min(1).max(191),
    department_id: z.number().positive(),
  });

  static readonly UPDATE: ZodType = z.object({
    id: z.number().positive(),
    name: z.string().max(191).optional(),
    level: z.string().max(191).optional(),
    department_id: z.number().positive().optional(),
  });

  static readonly SEARCH: ZodType = z.object({
    name: z.string().max(191).optional(),
    level: z.string().max(191).optional(),
    department_id: z.number().positive().optional(),
    page: z.number().min(1).positive(),
    size: z.number().min(1).max(100).positive(),
  });
}
