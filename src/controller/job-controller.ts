import {NextFunction, Response} from "express";
import {UserRequest} from "../type/user-request";
import {CreateJobRequest} from "../model/job-model";
import {JobService} from "../service/job-service";

export class JobController {
  static async create(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: CreateJobRequest = req.body as CreateJobRequest;
      const response = await JobService.create(req.user!, request);
      res.status(201).json({
        data: response,
        message: "Job successfully created",
      });
    } catch (e) {
      next(e);
    }
  }
}
