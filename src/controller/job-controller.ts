import {NextFunction, Response} from "express";
import {UserRequest} from "../type/user-request";
import {
  CreateJobRequest,
  SearchJobRequest,
  UpdateJobRequest,
} from "../model/job-model";
import {JobService} from "../service/job-service";
import {ExperienceLevel, JobType, WorkplaceType} from "@prisma/client";

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

  static async search(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: SearchJobRequest = {
        title: req.query.title as string,
        job_type: req.query.job_type as JobType,
        workplace_type: req.query.workplace_type as WorkplaceType,
        experience_level: req.query.experience_level as ExperienceLevel,
        location: req.query.location as string,
        page: req.query.page ? Number(req.query.page) : 1,
        size: req.query.size ? Number(req.query.size) : 10,
      };
      const response = await JobService.search(request);
      res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  }
}
