import {Response, NextFunction} from "express";
import {UserRequest} from "../types/user-request";
import {AttendanceService} from "../services/attendance-service";
import {SearchAttendanceRequest} from "../models/attendance-model";

export class AttendanceController {
  static async checkIn(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const response = await AttendanceService.checkIn(req.user!);
      res.status(200).json({
        data: response,
        message: "Check-in successful.",
      });
    } catch (err) {
      next(err);
    }
  }

  static async checkOut(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const response = await AttendanceService.checkOut(req.user!);
      res.status(200).json({
        data: response,
        message: "Check-out successful.",
      });
    } catch (err) {
      next(err);
    }
  }

  static async history(req: UserRequest, res: Response, next: NextFunction) {
    try {
      // const page = req.query.page ? Number(req.query.page) : 1;
      const request: SearchAttendanceRequest = {
        ...req.query,
        user_id: req.user?.id,
        page: req.query.page ? Number(req.query.page) : 1,
        size: req.query.size ? Number(req.query.size) : 8,
      };
      const response = await AttendanceService.report(request);
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  static async report(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: SearchAttendanceRequest = {
        ...req.query,
        page: req.query.page ? Number(req.query.page) : 1,
        size: req.query.size ? Number(req.query.size) : 8,
      };
      const response = await AttendanceService.report(request);
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  static async get(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const response = await AttendanceService.get(req.user!);
      res.status(200).json({
        data: response,
      });
    } catch (err) {
      next(err);
    }
  }
}
