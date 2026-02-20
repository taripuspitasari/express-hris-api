import {z, ZodType} from "zod";

export class PersonValidation {
  static readonly UPDATE: ZodType = z.object({
    fullname: z.string().max(191).optional(),
    email: z.email().max(191).optional(),
    phone: z.string().min(8).max(14).optional(),
    // birth_date: z.string().optional(),
    birth_date: z.coerce.date().optional(),
    gender: z.string().optional(),
  });
}
