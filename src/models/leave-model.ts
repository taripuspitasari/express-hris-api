import {Department, Employee, Leave, User} from "@prisma/client";
import {EmployeeResponse, toEmployeeResponse} from "./employee-model";

export type LeaveResponse = {
  id: number;
  type: string;
  start_date: Date;
  end_date: Date;
  total_days: number;
  status: string;
};

export type LeaveDetailResponse = {
  id: number;
  employee: EmployeeResponse;
  type: string;
  start_date: Date;
  end_date: Date;
  total_days: number;
  status: string;
  approver?: EmployeeResponse | null;
  approvedAt?: Date | null;
};

export type CreateLeaveRequest = {
  user_id: number;
  start_date: string;
  end_date: string;
  total_days: number;
  type: string;
};

export type SearchLeaveRequest = {
  type?: string;
  status?: string;
  page: number;
  size: number;
};

export function toLeaveResponse(leave: Leave): LeaveResponse {
  return {
    id: leave.id,
    type: leave.type,
    start_date: leave.start_date,
    end_date: leave.end_date,
    total_days: leave.total_days,
    status: leave.status,
  };
}

export function toLeaveDetailResponse(
  leave: Leave & {
    employee: Employee & {user: User; department: Department};
    approver: (Employee & {user: User; department: Department}) | null;
  }
): LeaveDetailResponse {
  return {
    id: leave.id,
    employee: toEmployeeResponse(leave.employee),
    type: leave.type,
    start_date: leave.start_date,
    end_date: leave.end_date,
    total_days: leave.total_days,
    status: leave.status,
    approver: leave.approver ? toEmployeeResponse(leave.approver) : null,
    approvedAt: leave.approvedAt ?? undefined,
  };
}
