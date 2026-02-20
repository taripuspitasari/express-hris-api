import {Response, NextFunction} from "express";
import {prismaClient} from "../application/database";
import {UserRequest} from "../types/user-request";

export const authMiddleware = async (
  req: UserRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.get("Authorization");

  if (token) {
    const user = await prismaClient.user.findFirst({
      where: {
        token: token,
      },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {include: {permission: true}},
              },
            },
          },
        },
      },
    });

    if (user) {
      const permissions = user.roles.flatMap(ur =>
        ur.role.permissions.map(rp => rp.permission.name),
      );
      req.user = {...user, permissions: [...new Set(permissions)]};
      return next();
    }
  }

  res
    .status(401)
    .json({
      errors: "Access denied. No authentication token provided.",
    })
    .end();
};
