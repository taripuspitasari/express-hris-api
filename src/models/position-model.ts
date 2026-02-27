import {Department, Position} from "@prisma/client";

export type PositionResponse = {
  id: number;
  name: string;
  level: string;
  department: {
    id: number;
    name: string;
  };
};

export type CreatePositionRequest = {
  name: string;
  level: string;
  department_id: number;
};

export type UpdatePositionRequest = {
  id: number;
  name?: string;
  level?: string;
  department_id?: number;
};

export type SearchPositionRequest = {
  name?: string;
  level?: string;
  department_id?: number;
  page: number;
  size: number;
};

export function toPositionResponse(
  position: Position & {department: Department},
): PositionResponse {
  return {
    id: position.id,
    name: position.name,
    level: position.level,
    department: {
      id: position.department.id,
      name: position.department.name,
    },
  };
}
