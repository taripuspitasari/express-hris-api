import {Request} from "express";
import {User, Role, Permission} from "@prisma/client";

export type AuthUser = User & {
  roles: {
    role: Role & {
      permissions: {
        permission: Permission;
      }[];
    };
  }[];
  permissions: string[];
};

export interface UserRequest extends Request {
  user?: AuthUser;
}
