import {z, ZodType} from "zod";

export class AuthValidation {
  static readonly REGISTER: ZodType = z.object({
    fullname: z.string().min(1).max(191),
    email: z.email().max(191),
    password: z.string().min(8).max(191),
  });

  static readonly LOGIN: ZodType = z.object({
    email: z.email().max(191),
    password: z.string().min(8).max(191),
  });

  static readonly CHANGE_PASSWORD: ZodType = z.object({
    old_password: z.string().min(8).max(191),
    new_password: z.string().min(8).max(191),
  });
}
