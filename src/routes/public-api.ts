import express from "express";
import {AuthController} from "../controllers/auth-controller";

export const publicRouter = express.Router();
publicRouter.post("/api/users", AuthController.register);
publicRouter.post("/api/users/login", AuthController.login);
