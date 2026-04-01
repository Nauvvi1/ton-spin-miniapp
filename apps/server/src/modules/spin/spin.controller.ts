import type { Request, Response } from "express";
import { spinService } from "./spin.service";

export function createSpinController(req: Request, res: Response): void {
  try {
    const spin = spinService.createSpin(req.telegramUser.telegramId);
    res.json(spin);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Spin failed";
    res.status(400).json({ message });
  }
}
