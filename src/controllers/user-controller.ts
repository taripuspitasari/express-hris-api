import {NextFunction, Response} from "express";
import {UserRequest} from "../types/user-request";
import {UserService} from "../services/user-service";
import {SearchDepartmentRequest} from "../models/department-model";

export class UserController {
  static async get(req: UserRequest, res: Response, next: NextFunction) {
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

  static async search(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: SearchDepartmentRequest = {
        name: req.query.name as string,
        page: req.query.page ? Number(req.query.page) : 1,
        size: req.query.size ? Number(req.query.size) : 10,
      };
      const response = await UserService.search(request);
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }
}
