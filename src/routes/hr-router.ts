import express from "express";
import {DepartmentController} from "../controllers/department-controller";
import {UserController} from "../controllers/user-controller";

export const hrRouter = express.Router();

hrRouter.post("/departments", DepartmentController.create);
hrRouter.put("/departments/:departmentId", DepartmentController.update);
hrRouter.delete("/departments/:departmentId", DepartmentController.remove);
hrRouter.get("/users/:userId", UserController.get);
hrRouter.get("/users", UserController.search);
