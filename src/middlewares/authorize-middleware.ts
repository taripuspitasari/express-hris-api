import {Response, NextFunction} from "express";
import {UserRequest} from "../types/user-request";

export const authorizeMiddleware = (requiredPermission: string) => {
  return async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({errors: "Unauthorized"});
      }

      const hasPermission = user.permissions.includes(requiredPermission);

      if (!hasPermission) {
        return res.status(403).json({
          errors: `Forbidden: You don't have '${requiredPermission}' permission.`,
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
