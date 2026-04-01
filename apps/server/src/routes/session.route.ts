import { Router } from "express";
import { getSessionController } from "../modules/session/session.controller";

export const sessionRoute = Router();

sessionRoute.get("/", getSessionController);
