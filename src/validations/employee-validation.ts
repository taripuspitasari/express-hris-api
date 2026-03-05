import {z, ZodType} from "zod";

export class EmployeeValidation {
  static readonly PROMOTE: ZodType = z.object({
    person_id: z.number().positive(),
    position_id: z.number().positive(),
    department_id: z.number().positive(),
    join_date: z.coerce.date(),
    status: z.string().min(1).max(191),
  });

  static readonly UPDATE: ZodType = z.object({
    id: z.number().positive(),
    position_id: z.number().positive().optional(),
    department_id: z.number().positive().optional(),
    join_date: z.coerce.date().optional(),
    status: z.string().min(1).max(191).optional(),
  });

  static readonly SEARCH: ZodType = z.object({
    fullname: z.string().max(191).optional(),
    status: z.string().max(191).optional(),
    employee_number: z.string().max(191).optional(),
    department_id: z.number().optional(),
    page: z.number().min(1).positive(),
    size: z.number().min(1).max(100).positive(),
  });
}
