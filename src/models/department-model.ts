import {Department} from "@prisma/client";

export type DepartmentResponse = {
  id: number;
  name: string;
  description: string;
};

export type CreateDepartmentRequest = {
  name: string;
  description: string;
};

export type UpdateDepartmentRequest = {
  id: number;
  name?: string;
  description?: string;
};

export type SearchDepartmentRequest = {
  name?: string;
  page: number;
  size: number;
};

export function toDepartmentResponse(
  department: Department
): DepartmentResponse {
  return {
    id: department.id,
    name: department.name,
    description: department.description,
  };
}
