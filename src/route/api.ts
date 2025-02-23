import express from "express";
import {authMiddleware} from "../middleware/auth-middleware";
import {UserController} from "../controller/user-controller";
// import {guardMiddleware} from "../middleware/guard-middleware";

export const apiRouter = express.Router();
apiRouter.use(authMiddleware);

apiRouter.get("/api/users/current", UserController.get);
apiRouter.patch("/api/users/current", UserController.update);
apiRouter.delete("/api/users/current", UserController.logout);

// apiRouter.get(
//   "/api/users",
//   guardMiddleware("admin"),
//   UserController.getAllUser
// );
