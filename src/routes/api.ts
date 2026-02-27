import express from "express";
import {authMiddleware} from "../middlewares/auth-middleware";
import {authorizeMiddleware} from "../middlewares/authorize-middleware";
import {AuthController} from "../controllers/auth-controller";
import {AttendanceController} from "../controllers/attendance-controller";
import {DepartmentController} from "../controllers/department-controller";
import {hrRouter} from "./hr-router";
import {LeaveController} from "../controllers/leave-controller";
import {PositionController} from "../controllers/position-controller";

export const apiRouter = express.Router();
apiRouter.use(authMiddleware);

apiRouter.get("/api/auth/me", AuthController.get);
apiRouter.patch("/api/auth/update-profile", AuthController.updateProfile);
apiRouter.patch("/api/auth/change-password", AuthController.updatePassword);
apiRouter.delete("/api/auth/logout", AuthController.logout);

apiRouter.get(
  "/api/departments",
  authorizeMiddleware("view_department"),
  DepartmentController.search,
);
apiRouter.get(
  "/api/departments/:departmentId",
  authorizeMiddleware("view_department"),
  DepartmentController.get,
);
apiRouter.post(
  "/api/departments",
  authorizeMiddleware("create_department"),
  DepartmentController.create,
);

apiRouter.put(
  "/api/departments/:departmentId",
  authorizeMiddleware("update_department"),
  DepartmentController.update,
);

apiRouter.delete(
  "/api/departments/:departmentId",
  authorizeMiddleware("delete_department"),
  DepartmentController.remove,
);

apiRouter.get(
  "/api/positions",
  authorizeMiddleware("view_position"),
  PositionController.search,
);
apiRouter.get(
  "/api/positions/:positionId",
  authorizeMiddleware("view_position"),
  PositionController.get,
);
apiRouter.post(
  "/api/positions",
  authorizeMiddleware("create_position"),
  PositionController.create,
);

apiRouter.put(
  "/api/positions/:positionId",
  authorizeMiddleware("update_position"),
  PositionController.update,
);

apiRouter.delete(
  "/api/positions/:positionId",
  authorizeMiddleware("delete_position"),
  PositionController.remove,
);

apiRouter.get("/api/users/current", AuthController.get);
apiRouter.patch("/api/users/current", AuthController.updatePassword);
apiRouter.delete("/api/users/current", AuthController.logout);

apiRouter.post("/api/attendance/check-in", AttendanceController.checkIn);
apiRouter.post("/api/attendance/check-out", AttendanceController.checkOut);
apiRouter.get("/api/attendance/history", AttendanceController.history);
apiRouter.get("/api/attendance", AttendanceController.get);

apiRouter.post("/api/leaves", LeaveController.create);
apiRouter.get("/api/leaves", LeaveController.search);
apiRouter.get("/api/leave/:leaveId", LeaveController.get);
// apiRouter.use("/api/hr", hrRouter);
