import {Department, Employee, Person, Position} from "@prisma/client";
import {ProfileResponse} from "./person-model";
import {DepartmentResponse} from "./department-model";
import {PositionResponse} from "./position-model";

export type EmployeeResponse = {
  id: number;
  employee_number: string;
  join_date: Date;
  status: string;
  profile: ProfileResponse;
  department: DepartmentResponse;
  position: PositionResponse;
};

export type PromoteEmployeeRequest = {
  person_id: number;
  position_id: number;
  department_id: number;
  join_date: string;
  status: string;
};

export type UpdateEmployeeRequest = {
  id: number;
  join_date?: string;
  status?: string;
  position_id?: number;
  department_id?: number;
};

export type SearchEmployeeRequest = {
  fullname?: string;
  employee_number?: string;
  status?: string;
  department_id?: number;
  page: number;
  size: number;
};

export function toEmployeeResponse(
  employee: Employee & {
    person: Person;
    position: Position;
    department: Department;
  },
): EmployeeResponse {
  return {
    id: employee.id,
    employee_number: employee.employee_number,
    join_date: employee.join_date,
    status: employee.status,
    profile: {
      id: employee.person.id,
      email: employee.person.email,
      fullname: employee.person.fullname,
      phone: employee.person.phone,
      gender: employee.person.gender,
      birth_date: employee.person.birth_date
        ? employee.person.birth_date.toISOString().split("T")[0]
        : null,
    },
    department: {
      id: employee.department.id,
      name: employee.department.name,
    },
    position: {
      id: employee.position.id,
      name: employee.position.name,
      level: employee.position.level,
    },
  };
}
