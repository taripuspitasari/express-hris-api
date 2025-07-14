import {User} from "@prisma/client";

export type UserResponse = {
  id: number;
  email: string;
  name: string;
  role: string;
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

export function toUserResponse(user: User): UserResponse {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}
