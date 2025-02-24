import {User, Role} from "@prisma/client";

export type UserResponse = {
  id: string;
  email: string;
  name: string;
  role: Role;
  token?: string;
};

export type CreateUserRequest = {
  name: string;
  email: string;
  password: string;
};

export type LoginUserRequest = {
  email: string;
  password: string;
};

export type UpdateUserRequest = {
  name?: string;
  password?: string;
  email?: string;
};

// memformat data user sebelum dikirim sbg response api
export function toUserResponse(user: User): UserResponse {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}
