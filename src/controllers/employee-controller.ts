import {NextFunction, Request, Response} from "express";
import {
  CreateEmployeeRequest,
  SearchEmployeeRequest,
  UpdateEmployeeRequest,
} from "../models/employee-model";
import {EmployeeService} from "../services/employee-service";

export class EmployeeController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const request: CreateEmployeeRequest = req.body as CreateEmployeeRequest;
      const response = await EmployeeService.create(request);
      res.status(201).json({
        data: response,
        message: "Employee created successfully.",
      });
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const request: UpdateEmployeeRequest = req.body as UpdateEmployeeRequest;
      request.id = Number(req.params.employeeId);
      const response = await EmployeeService.update(request);
      res.status(200).json({
        data: response,
        message: "Employee updated successfully.",
      });
    } catch (err) {
      next(err);
    }
  }

  static async get(req: Request, res: Response, next: NextFunction) {
    try {
      const employeeId = Number(req.params.employeeId);
      const response = await EmployeeService.get(employeeId);
      res.status(200).json({
        data: response,
      });
    } catch (err) {
      next(err);
    }
  }

  static async search(req: Request, res: Response, next: NextFunction) {
    try {
      const request: SearchEmployeeRequest = {
        name: req.query.name as string,
        status: req.query.status as string,
        department_id: Number(req.query.department_id ?? 0),
        page: req.query.page ? Number(req.query.page) : 1,
        size: req.query.size ? Number(req.query.size) : 6,
      };
      const response = await EmployeeService.search(request);
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }
}
