import {z, ZodType} from "zod";

export class UserValidation {
  static readonly SEARCH: ZodType = z.object({
    name: z.string().max(191).optional(),
    page: z.number().min(1).positive(),
    size: z.number().min(1).max(100).positive(),
  });
}
