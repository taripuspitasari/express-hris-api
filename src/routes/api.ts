import express from "express";
import {authMiddleware} from "../middlewares/auth-middleware";
import {UserController} from "../controllers/user-controller";
import {AttendanceController} from "../controllers/attendance-controller";
import {DepartmentController} from "../controllers/department-controller";
import {hrRouter} from "./hr-router";

export const apiRouter = express.Router();
apiRouter.use(authMiddleware);
apiRouter.get("/api/users/current", UserController.get);
apiRouter.patch("/api/users/current", UserController.update);
apiRouter.delete("/api/users/current", UserController.logout);

apiRouter.post("/api/attendance/check-in", AttendanceController.checkIn);
apiRouter.post("/api/attendance/check-out", AttendanceController.checkOut);
apiRouter.get("/api/attendance/history", AttendanceController.history);
apiRouter.get("/api/attendance", AttendanceController.get);

apiRouter.get("/api/departments/:departmentId", DepartmentController.get);
apiRouter.get("/api/departments", DepartmentController.search);
apiRouter.use("/api/hr", hrRouter);
