import express from "express";
import {authMiddleware} from "../middleware/auth-middleware";
import {UserController} from "../controller/user-controller";
// import {guardMiddleware} from "../middleware/guard-middleware";
import {JobController} from "../controller/job-controller";
import {ApplicationController} from "../controller/application-controller";

export const apiRouter = express.Router();
apiRouter.use(authMiddleware);

apiRouter.get("/api/users/current", UserController.get);
apiRouter.patch("/api/users/current", UserController.update);
apiRouter.delete("/api/users/current", UserController.logout);

// apiRouter.post("/api/jobs", guardMiddleware("HR"), JobController.create);
apiRouter.post("/api/jobs", JobController.create);
apiRouter.get("/api/jobs/:jobId(\\d+)", JobController.get);
apiRouter.put("/api/jobs/:jobId(\\d+)", JobController.update);
apiRouter.delete("/api/jobs/:jobId(\\d+)", JobController.remove);
apiRouter.get("/api/jobs", JobController.search);

apiRouter.post("/api/applications", ApplicationController.create);
apiRouter.get("/api/applications", ApplicationController.getHR);
apiRouter.get("/api/applications/my", ApplicationController.getUser);
apiRouter.get("/api/applications/:id", ApplicationController.get);
apiRouter.put("/api/applications/:id", ApplicationController.update);
apiRouter.delete("/api/applications/:id", ApplicationController.remove);
