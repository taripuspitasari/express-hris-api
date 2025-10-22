import {NextFunction, Response, Request} from "express";
import {UserService} from "../services/user-service";
import {SearchUserRequest, UpdateUserStatusRequest} from "../models/user-model";

export class UserController {
  static async get(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = Number(req.params.userId);
      const response = await UserService.get(userId);
      res.status(200).json({
        data: response,
      });
    } catch (err) {
      next(err);
    }
  }

  static async search(req: Request, res: Response, next: NextFunction) {
    try {
      const request: SearchUserRequest = {
        name: req.query.name as string,
        role: req.query.role as string,
        page: req.query.page ? Number(req.query.page) : 1,
        size: req.query.size ? Number(req.query.size) : 10,
      };
      const response = await UserService.search(request);
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const request: UpdateUserStatusRequest =
        req.body as UpdateUserStatusRequest;
      request.id = Number(req.params.userId);
      const response = await UserService.update(request);
      res.status(200).json({
        data: response,
        message: "User updated successfully.",
      });
    } catch (err) {
      next(err);
    }
  }
}
