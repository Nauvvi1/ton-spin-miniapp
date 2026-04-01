import dotenv from "dotenv";

dotenv.config();

function toNumber(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toList(value: string | undefined, fallback: string[]): string[] {
  if (!value) return fallback;
  return value
    .split(",")
    .map((item) => item.trim().replace(/\/$/, ""))
    .filter(Boolean);
}

export const env = {
  port: toNumber(process.env.API_PORT, 3001),
  botToken: process.env.BOT_TOKEN ?? "",
  allowDevAuth: (process.env.ALLOW_DEV_AUTH ?? "true") === "true",
  allowedOrigins: toList(process.env.ALLOWED_ORIGIN, ["http://localhost:5173"]),
  appBaseUrl: process.env.APP_BASE_URL ?? "http://localhost:3001",
  sessionStartBalance: toNumber(process.env.SESSION_START_BALANCE, 25),
  devTelegramId: process.env.DEV_TELEGRAM_ID ?? "777000",
  devTelegramUsername: process.env.DEV_TELEGRAM_USERNAME ?? "dev_ton_user",
  devTelegramFirstName: process.env.DEV_TELEGRAM_FIRST_NAME ?? "Player"
};
