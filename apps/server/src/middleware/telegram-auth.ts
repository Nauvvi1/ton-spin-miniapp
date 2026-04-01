import crypto from "node:crypto";
import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env";

export interface TelegramAuthUser {
  telegramId: string;
  username?: string;
  firstName?: string;
  lastName?: string;
}

function buildDevUser(): TelegramAuthUser {
  return {
    telegramId: env.devTelegramId,
    username: env.devTelegramUsername,
    firstName: env.devTelegramFirstName
  };
}

function parseUserFromInitData(initData: string): TelegramAuthUser {
  const params = new URLSearchParams(initData);
  const rawUser = params.get("user");

  if (!rawUser) {
    throw new Error("Telegram init data does not contain user");
  }

  const user = JSON.parse(rawUser) as {
    id: number;
    username?: string;
    first_name?: string;
    last_name?: string;
  };

  return {
    telegramId: String(user.id),
    username: user.username,
    firstName: user.first_name,
    lastName: user.last_name
  };
}

function validateInitData(initData: string): void {
  if (!env.botToken) {
    throw new Error("BOT_TOKEN is required to validate Telegram init data");
  }

  const params = new URLSearchParams(initData);
  const hash = params.get("hash");

  if (!hash) {
    throw new Error("Missing hash in Telegram init data");
  }

  params.delete("hash");

  const authDate = params.get("auth_date");
  if (!authDate) {
    throw new Error("Missing auth_date in Telegram init data");
  }

  const ageInSeconds = Math.floor(Date.now() / 1000) - Number(authDate);
  if (ageInSeconds > 60 * 60 * 24) {
    throw new Error("Telegram init data is too old");
  }

  const dataCheckString = Array.from(params.entries())
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  const secret = crypto.createHmac("sha256", "WebAppData").update(env.botToken).digest();
  const computedHash = crypto.createHmac("sha256", secret).update(dataCheckString).digest("hex");

  const incomingBuffer = Buffer.from(hash, "hex");
  const computedBuffer = Buffer.from(computedHash, "hex");

  if (
    incomingBuffer.length !== computedBuffer.length ||
    !crypto.timingSafeEqual(incomingBuffer, computedBuffer)
  ) {
    throw new Error("Invalid Telegram init data hash");
  }
}

export function telegramAuthMiddleware(req: Request, res: Response, next: NextFunction): void {
  const initData = req.header("x-telegram-init-data");

  if (!initData) {
    if (!env.allowDevAuth) {
      res.status(401).json({ message: "Missing Telegram init data" });
      return;
    }

    req.telegramUser = buildDevUser();
    next();
    return;
  }

  try {
    validateInitData(initData);
    req.telegramUser = parseUserFromInitData(initData);
    next();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid Telegram auth";
    res.status(401).json({ message });
  }
}
