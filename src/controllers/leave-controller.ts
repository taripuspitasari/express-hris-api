import {NextFunction, Response, Request} from "express";
import {UserRequest} from "../types/user-request";
import {LeaveService} from "../services/leave-service";
import {CreateLeaveRequest, SearchLeaveRequest} from "../models/leave-model";

export class LeaveController {
  static async create(req: UserRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({message: "Unauthorized"});
      }

      const request: CreateLeaveRequest = {...req.body, user_id: req.user.id};
      const response = await LeaveService.create(request);
      res.status(201).json({
        data: response,
        message: "Leave requested",
      });
    } catch (err) {
      next(err);
    }
  }

  static async search(req: Request, res: Response, next: NextFunction) {
    try {
      const request: SearchLeaveRequest = {
        type: req.query.type as string,
        status: req.query.status as string,
        page: req.query.page ? Number(req.query.page) : 1,
        size: req.query.size ? Number(req.query.size) : 6,
      };

      const response = await LeaveService.search(request);
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  static async get(req: Request, res: Response, next: NextFunction) {
    try {
      const leaveId = Number(req.params.leaveId);
      const response = await LeaveService.get(leaveId);
      res.status(200).json({
        data: response,
      });
    } catch (err) {
      next(err);
    }
  }
}
