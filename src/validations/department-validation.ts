import {z, ZodType} from "zod";

export class DepartmentValidation {
  static readonly CREATE: ZodType = z.object({
    name: z.string().min(1).max(191),
    description: z.string().min(1),
  });

  static readonly UPDATE: ZodType = z.object({
    id: z.number().positive(),
    name: z.string().max(191).optional(),
    description: z.string().optional(),
  });

  static readonly SEARCH: ZodType = z.object({
    name: z.string().max(191).optional(),
    page: z.number().min(1).positive(),
    size: z.number().min(1).max(100).positive(),
  });
}
