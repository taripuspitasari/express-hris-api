import {z, ZodType} from "zod";

export class AttendanceValidation {
  static readonly SEARCH: ZodType = z.object({
    id: z.number().positive(),
    page: z.number().min(1).positive(),
    size: z.number().min(1).max(100).positive(),
  });
}
