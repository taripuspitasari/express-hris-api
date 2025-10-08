import {User} from "@prisma/client";

export type UserResponse = {
  id: number;
  email: string;
  name: string;
  role: string;
  is_active: boolean;
  token?: string;
};

export type CreateUserRequest = {
  email: string;
  password: string;
  name: string;
};

export type LoginUserRequest = {
  email: string;
  password: string;
};

export type UpdateUserRequest = {
  email?: string;
  password?: string;
  name?: string;
};

export type UpdateUserStatusRequest = {
  id: number;
  is_active: boolean;
};

export type SearchUserRequest = {
  name?: string;
  role?: string;
  page: number;
  size: number;
};

export function toUserResponse(user: User): UserResponse {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    is_active: user.is_active,
    role: user.role,
  };
}
