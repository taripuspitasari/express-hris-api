import {Department, Employee, User} from "@prisma/client";
import {UserResponse} from "./user-model";
import {DepartmentResponse} from "./department-model";

export type EmployeeResponse = {
  id: number;
  position: string;
  join_date: Date;
  status: string;
  user: UserResponse;
  department: DepartmentResponse;
};

export type CreateEmployeeRequest = {
  user_id: number;
  position: string;
  department_id: number;
  join_date: string;
  status: string;
};

export type UpdateEmployeeRequest = {
  id: number;
  position?: string;
  department_id?: number;
  join_date?: string;
  status?: string;
};

export type SearchEmployeeRequest = {
  name?: string;
  status?: string;
  department_id?: number;
  page: number;
  size: number;
};

export function toEmployeeResponse(
  employee: Employee & {user: User; department: Department}
): EmployeeResponse {
  return {
    id: employee.id,
    position: employee.position,
    join_date: employee.join_date,
    status: employee.status,
    user: {
      id: employee.user.id,
      email: employee.user.email,
      name: employee.user.name,
      role: employee.user.role,
    },
    department: {
      id: employee.department.id,
      name: employee.department.name,
      description: employee.department.description,
    },
  };
}
