import {NextFunction, Response} from "express";
import {UserRequest} from "../type/user-request";
import {CreateJobRequest, UpdateJobRequest} from "../model/job-model";
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

  static async get(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const jobId = Number(req.params.jobId);
      const response = await JobService.get(jobId);
      res.status(200).json({
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }

  static async update(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: UpdateJobRequest = req.body as UpdateJobRequest;
      request.id = Number(req.params.jobId);
      const response = await JobService.update(req.user!, request);
      res.status(200).json({
        data: response,
        message: "Job successfully updated",
      });
    } catch (e) {
      next(e);
    }
  }

  static async remove(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const jobId = Number(req.params.jobId);
      await JobService.remove(req.user!, jobId);
      res.status(200).json({
        message: "Job successfully deleted.",
      });
    } catch (e) {
      next(e);
    }
  }
}
