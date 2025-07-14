import {Response, NextFunction} from "express";
import {prismaClient} from "../application/database";
import {UserRequest} from "../types/user-request";

export const authMiddleware = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.get("Authorization");

  if (token) {
    const user = await prismaClient.user.findFirst({
      where: {
        token: token,
      },
    });

    if (user) {
      req.user = user;
      next();
      return;
    }
  }

  res
    .status(401)
    .json({
      errors: "Access denied. No authentication token provided.",
    })
    .end();
};
