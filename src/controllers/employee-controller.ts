import {NextFunction, Response} from "express";
import {UserRequest} from "../types/user-request";
import {
  PromoteEmployeeRequest,
  SearchEmployeeRequest,
  UpdateEmployeeRequest,
} from "../models/employee-model";
import {EmployeeService} from "../services/employee-service";

export class EmployeeController {
  static async promote(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: PromoteEmployeeRequest =
        req.body as PromoteEmployeeRequest;
      const response = await EmployeeService.promote(request);
      res.status(201).json({
        data: response,
        message: "Employee created successfully.",
      });
    } catch (err) {
      next(err);
    }
  }

  static async update(req: UserRequest, res: Response, next: NextFunction) {
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

  static async get(req: UserRequest, res: Response, next: NextFunction) {
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

  static async offboard(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const employeeId = Number(req.params.employeeId);
      await EmployeeService.offboard(employeeId);
      res.status(200).json({
        message: "Employee offboarded and access revoked successfully.",
      });
    } catch (err) {
      next(err);
    }
  }

  static async search(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: SearchEmployeeRequest = {
        fullname: req.query.fullname as string,
        status: req.query.status as string,
        employee_number: req.query.employee_number as string,
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
