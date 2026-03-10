import {Department, Employee, Leave, Person} from "@prisma/client";

export type LeaveResponse = {
  id: number;
  type: string;
  start_date: Date;
  end_date: Date;
  total_days: number;
  reason: string;
  status: string;
  created_at: Date;
  rejection_reason?: string | null;
  approved_at?: Date | null;
  employee: {
    id: number;
    employee_number: string;
    fullname: string;
    department: string;
  };
  approver?: {
    id: number;
    fullname: string;
  } | null;
};

export type CreateLeaveRequest = {
  user_id: number;
  type: string;
  start_date: Date;
  end_date: Date;
  reason: string;
};

export type SearchLeaveRequest = {
  user_id?: number;
  fullname?: string;
  type?: string;
  status?: string;
  page: number;
  size: number;
};

export type ApproveLeaveRequest = {
  id: number;
  user_id: number;
  status: string;
  rejection_reason?: string;
};

export function toLeaveResponse(
  leave: Leave & {
    employee: Employee & {person: Person; department: Department};
    approver?: (Employee & {person: Person}) | null;
  },
): LeaveResponse {
  return {
    id: leave.id,
    type: leave.type,
    start_date: leave.start_date,
    end_date: leave.end_date,
    total_days: leave.total_days,
    status: leave.status,
    reason: leave.reason,
    rejection_reason: leave.rejection_reason,
    created_at: leave.created_at,
    approved_at: leave.approved_at,
    employee: {
      id: leave.employee.id,
      employee_number: leave.employee.employee_number,
      fullname: leave.employee.person.fullname,
      department: leave.employee.department.name,
    },
    approver: leave.approver
      ? {
          id: leave.approver.id,
          fullname: leave.approver.person.fullname,
        }
      : null,
  };
}
