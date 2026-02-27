import {NextFunction, Response} from "express";
import {UserRequest} from "../types/user-request";
import {PositionService} from "../services/position-service";
import {
  CreatePositionRequest,
  SearchPositionRequest,
  UpdatePositionRequest,
} from "../models/position-model";

export class PositionController {
  static async create(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: CreatePositionRequest = req.body as CreatePositionRequest;
      const response = await PositionService.create(request);
      res.status(201).json({
        data: response,
        message: "Position created successfully.",
      });
    } catch (err) {
      next(err);
    }
  }

  static async update(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: UpdatePositionRequest = req.body as UpdatePositionRequest;
      request.id = Number(req.params.positionId);
      const response = await PositionService.update(request);
      res.status(200).json({
        data: response,
        message: "Position updated successfully.",
      });
    } catch (err) {
      next(err);
    }
  }

  static async remove(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const positionId = Number(req.params.positionId);
      await PositionService.remove(positionId);
      res.status(200).json({
        message: "Position deleted successfully.",
      });
    } catch (err) {
      next(err);
    }
  }

  static async get(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const positionId = Number(req.params.positionId);
      const response = await PositionService.get(positionId);
      res.status(200).json({
        data: response,
      });
    } catch (err) {
      next(err);
    }
  }

  static async search(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: SearchPositionRequest = {
        name: req.query.name as string,
        level: req.query.level as string,
        department_id: req.query.department_id
          ? Number(req.query.department_id)
          : undefined,
        page: req.query.page ? Number(req.query.page) : 1,
        size: req.query.size ? Number(req.query.size) : 10,
      };
      const response = await PositionService.search(request);
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }
}
