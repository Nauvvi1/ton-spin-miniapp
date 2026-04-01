import { Router } from "express";
import { createSpinController } from "../modules/spin/spin.controller";

export const spinRoute = Router();

spinRoute.post("/", createSpinController);
