import express from "express";
import {authMiddleware} from "../middlewares/auth-middleware";
import {authorizeMiddleware} from "../middlewares/authorize-middleware";
import {AuthController} from "../controllers/auth-controller";
import {AttendanceController} from "../controllers/attendance-controller";
import {DepartmentController} from "../controllers/department-controller";
import {hrRouter} from "./hr-router";
import {LeaveController} from "../controllers/leave-controller";
import {PositionController} from "../controllers/position-controller";
import {EmployeeController} from "../controllers/employee-controller";

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

apiRouter.get(
  "/api/employees",
  authorizeMiddleware("view_employee"),
  EmployeeController.search,
);
apiRouter.get(
  "/api/employees/:employeeId",
  authorizeMiddleware("view_employee"),
  EmployeeController.get,
);
apiRouter.post(
  "/api/employees/promote",
  authorizeMiddleware("promote_employee"),
  EmployeeController.promote,
);

apiRouter.put(
  "/api/employees/:employeeId",
  authorizeMiddleware("update_employee"),
  EmployeeController.update,
);

apiRouter.delete(
  "/api/employees/:employeeId/offboard",
  authorizeMiddleware("offboard_employee"),
  EmployeeController.offboard,
);

apiRouter.get("/api/attendance", AttendanceController.get);
apiRouter.post("/api/attendance/check-in", AttendanceController.checkIn);
apiRouter.post("/api/attendance/check-out", AttendanceController.checkOut);
apiRouter.get("/api/attendance/history", AttendanceController.history);
apiRouter.get(
  "/api/hr/attendance/report",
  authorizeMiddleware("view_attendance"),
  AttendanceController.report,
);

apiRouter.post("/api/leaves", LeaveController.create);
apiRouter.get("/api/leaves", LeaveController.search);
apiRouter.get("/api/leave/:leaveId", LeaveController.get);
// apiRouter.use("/api/hr", hrRouter);
