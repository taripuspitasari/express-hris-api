import express from "express";
import {DepartmentController} from "../controllers/department-controller";
import {UserController} from "../controllers/user-controller";
import {EmployeeController} from "../controllers/employee-controller";

export const hrRouter = express.Router();

hrRouter.post("/departments", DepartmentController.create);
hrRouter.put("/departments/:departmentId", DepartmentController.update);
hrRouter.delete("/departments/:departmentId", DepartmentController.remove);
hrRouter.get("/users/:userId", UserController.get);
hrRouter.put("/users/:userId", UserController.update);
hrRouter.get("/users", UserController.search);
hrRouter.post("/employees", EmployeeController.create);
hrRouter.put("/employees/:employeeId", EmployeeController.update);
hrRouter.get("/employees/:employeeId", EmployeeController.get);
hrRouter.get("/employees", EmployeeController.search);
