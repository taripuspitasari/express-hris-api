import {NextFunction, Response} from "express";
import {UserRequest} from "../types/user-request";
import {LeaveService} from "../services/leave-service";
import {
  ApproveLeaveRequest,
  CreateLeaveRequest,
  SearchLeaveRequest,
} from "../models/leave-model";

export class LeaveController {
  static async create(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: CreateLeaveRequest = {
        ...req.body,
        user_id: req.user!.id,
      };
      const response = await LeaveService.create(request);
      res.status(201).json({
        data: response,
        message: "Leave requested",
      });
    } catch (err) {
      next(err);
    }
  }

  static async search(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: SearchLeaveRequest = {
        ...req.query,
        page: req.query.page ? Number(req.query.page) : 1,
        size: req.query.size ? Number(req.query.size) : 6,
      };

      const response = await LeaveService.search(request);
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  static async get(req: UserRequest, res: Response, next: NextFunction) {
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

  static async history(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: SearchLeaveRequest = {
        ...req.query,
        user_id: req.user?.id,
        page: req.query.page ? Number(req.query.page) : 1,
        size: req.query.size ? Number(req.query.size) : 6,
      };

      const response = await LeaveService.search(request);
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  static async approve(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: ApproveLeaveRequest = {
        ...req.body,
        user_id: req.user!.id,
        id: Number(req.params.leaveId),
      };
      const response = await LeaveService.approve(request);
      res.status(200).json({
        data: response,
        message: "Updated successfully",
      });
    } catch (err) {
      next(err);
    }
  }
}
