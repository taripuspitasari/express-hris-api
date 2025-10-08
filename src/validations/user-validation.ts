import {z, ZodType} from "zod";

export class UserValidation {
  static readonly SEARCH: ZodType = z.object({
    name: z.string().max(191).optional(),
    role: z.string().max(191).optional(),
    page: z.number().min(1).positive(),
    size: z.number().min(1).max(100).positive(),
  });

  static readonly UPDATE: ZodType = z.object({
    id: z.number().positive(),
    is_active: z.boolean(),
  });
}
