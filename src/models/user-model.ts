import {User, Person, Role} from "@prisma/client";

export type AuthResponse = {
  id: number;
  is_active: boolean;
  roles: string[];
  token?: string;
  profile: {
    fullname: string;
    email: string;
    phone: string | null;
    gender: string | null;
    birth_date: string | null;
  };
};

export type RegisterRequest = {
  fullname: string;
  email: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type UpdateProfileRequest = {
  fullname?: string;
  email?: string;
  phone?: string;
  birth_date?: string;
  gender?: string;
};

export type UpdatePasswordRequest = {
  old_password: string;
  new_password: string;
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

export function toAuthResponse(
  user: User & {person: Person; roles: {role: Role}[]},
): AuthResponse {
  return {
    id: user.id,
    is_active: user.is_active,
    roles: user.roles.map(ur => ur.role.name),
    profile: {
      fullname: user.person.fullname,
      email: user.person.email,
      phone: user.person.phone,
      gender: user.person.gender,
      birth_date: user.person.birth_date
        ? user.person.birth_date.toISOString().split("T")[0]
        : null,
    },
  };
}
