import { Router } from "express";
import { telegramAuthMiddleware } from "../middleware/telegram-auth";
import { healthRoute } from "./health.route";
import { sessionRoute } from "./session.route";
import { spinRoute } from "./spin.route";

export const rootRouter = Router();

rootRouter.use("/health", healthRoute);
rootRouter.use("/api/session", telegramAuthMiddleware, sessionRoute);
rootRouter.use("/api/spin", telegramAuthMiddleware, spinRoute);
