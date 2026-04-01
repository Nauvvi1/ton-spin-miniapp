import dotenv from "dotenv";

dotenv.config();

function toNumber(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export const env = {
  port: toNumber(process.env.API_PORT, 3000),
  botToken: process.env.BOT_TOKEN ?? "",
  allowDevAuth: (process.env.ALLOW_DEV_AUTH ?? "true") === "true",
  allowedOrigin: process.env.ALLOWED_ORIGIN ?? "http://localhost:5173",
  appBaseUrl: process.env.APP_BASE_URL ?? "http://localhost:3000",
  sessionStartBalance: toNumber(process.env.SESSION_START_BALANCE, 12),
  devTelegramId: process.env.DEV_TELEGRAM_ID ?? "777000",
  devTelegramUsername: process.env.DEV_TELEGRAM_USERNAME ?? "dev_ton_user",
  devTelegramFirstName: process.env.DEV_TELEGRAM_FIRST_NAME ?? "Dev"
};
