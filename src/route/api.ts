import express from "express";
import {authMiddleware} from "../middleware/auth-middleware";
import {UserController} from "../controller/user-controller";
// import {guardMiddleware} from "../middleware/guard-middleware";
import {JobController} from "../controller/job-controller";

export const apiRouter = express.Router();
apiRouter.use(authMiddleware);

apiRouter.get("/api/users/current", UserController.get);
apiRouter.patch("/api/users/current", UserController.update);
apiRouter.delete("/api/users/current", UserController.logout);

// apiRouter.post("/api/jobs", guardMiddleware("HR"), JobController.create);
apiRouter.post("/api/jobs", JobController.create);
