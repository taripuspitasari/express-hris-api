import {NextFunction, Response} from "express";
import {UserRequest} from "../type/user-request";
import {
  CreateApplicationRequest,
  UpdateApplicationRequest,
} from "../model/application-model";
import {ApplicationService} from "../service/application-service";

export class ApplicationController {
  static async create(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: CreateApplicationRequest =
        req.body as CreateApplicationRequest;
      const response = await ApplicationService.create(req.user!, request);
      res.status(201).json({
        data: response,
        message: "Application successfully created",
      });
    } catch (e) {
      next(e);
    }
  }

  static async get(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const applicationId = Number(req.params.applicationId);
      const response = await ApplicationService.get(req.user!, applicationId);
      res.status(200).json({
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }

  static async update(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: UpdateApplicationRequest =
        req.body as UpdateApplicationRequest;
      request.id = Number(req.params.applicationId);
      const response = await ApplicationService.update(req.user!, request);
      res.status(200).json({
        data: response,
        message: "Application status updated",
      });
    } catch (e) {
      next(e);
    }
  }

  static async remove(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const applicationId = Number(req.params.applicationId);
      await ApplicationService.remove(req.user!, applicationId);
      res.status(200).json({
        message: "Application deleted",
      });
    } catch (e) {
      next(e);
    }
  }

  static async getUser(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const response = await ApplicationService.listForUser(req.user!);
      res.status(200).json({
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }

  static async getHR(_req: UserRequest, res: Response, next: NextFunction) {
    try {
      const response = await ApplicationService.listForHR();
      res.status(200).json({
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }
}
