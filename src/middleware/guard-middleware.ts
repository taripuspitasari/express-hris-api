import {NextFunction, Response} from "express";
import {UserRequest} from "../type/user-request";

export const guardMiddleware = (requiredRole: string) => {
  return (req: UserRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({errors: "Unauthorized"});
      return;
    }

    if (req.user.role !== requiredRole) {
      res.status(403).json({errors: "Forbidden: Access Denied"});
      return;
    }

    next();
  };
};
