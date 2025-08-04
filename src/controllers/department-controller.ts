import {Response, NextFunction} from "express";
import {UserRequest} from "../types/user-request";
import {DepartmentService} from "../services/department-service";
import {
  CreateDepartmentRequest,
  SearchDepartmentRequest,
  UpdateDepartmentRequest,
} from "../models/department-model";

export class DepartmentController {
  static async create(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: CreateDepartmentRequest =
        req.body as CreateDepartmentRequest;
      const response = await DepartmentService.create(request);
      res.status(201).json({
        data: response,
        message: "Department created successfully.",
      });
    } catch (err) {
      next(err);
    }
  }

  static async update(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: UpdateDepartmentRequest =
        req.body as UpdateDepartmentRequest;
      request.id = Number(req.params.departmentId);
      const response = await DepartmentService.update(request);
      res.status(200).json({
        data: response,
        message: "Department updated successfully.",
      });
    } catch (err) {
      next(err);
    }
  }

  static async remove(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const departmentId = Number(req.params.departmentId);
      await DepartmentService.remove(departmentId);
      res.status(200).json({
        message: "Department deleted successfully.",
      });
    } catch (err) {
      next(err);
    }
  }

  static async get(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const departmentId = Number(req.params.departmentId);
      const response = await DepartmentService.get(departmentId);
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
      const response = await DepartmentService.search(request);
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }
}
