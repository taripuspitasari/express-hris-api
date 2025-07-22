import express from "express";
import {authMiddleware} from "../middlewares/auth-middleware";
import {UserController} from "../controllers/user-controller";
import {AttendanceController} from "../controllers/attendance-controller";

export const apiRouter = express.Router();
apiRouter.use(authMiddleware);
apiRouter.get("/api/users/current", UserController.get);
apiRouter.patch("/api/users/current", UserController.update);
apiRouter.delete("/api/users/current", UserController.logout);

apiRouter.post("/api/attendance/check-in", AttendanceController.checkIn);
apiRouter.post("/api/attendance/check-out", AttendanceController.checkOut);
apiRouter.get("/api/attendance/history", AttendanceController.history);
