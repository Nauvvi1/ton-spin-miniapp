import type { Request, Response } from "express";
import { SPIN_COST } from "../../../../../shared/reel";
import { userStore } from "../user/user.store";

export function getSessionController(req: Request, res: Response): void {
  const telegramUser = req.telegramUser;
  const session = userStore.getOrCreate(telegramUser.telegramId, {
    username: telegramUser.username,
    firstName: telegramUser.firstName
  });

  res.json({
    user: {
      telegramId: session.telegramId,
      username: session.username,
      firstName: session.firstName,
      displayName: session.firstName ?? session.username ?? "Player"
    },
    balance: session.balance,
    spinCost: SPIN_COST
  });
}
