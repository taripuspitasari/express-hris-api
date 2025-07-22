import {Response, NextFunction} from "express";
import {UserRequest} from "../types/user-request";
import {AttendanceService} from "../services/attendance-service";

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
      const response = await AttendanceService.history(req.user!);
      res.status(200).json({
        data: response,
      });
    } catch (err) {
      next(err);
    }
  }
}
