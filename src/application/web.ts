import express from "express";
import cors from "cors";
import {publicRouter} from "../route/public-api";
import {errorMiddleware} from "../middleware/error-middleware";
import {apiRouter} from "../route/api";

export const web = express();
web.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "x-token-api"],
  })
);

web.use(express.json());

web.use(publicRouter);
web.use(apiRouter);
web.use(errorMiddleware);
