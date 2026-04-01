import dotenv from "dotenv";

dotenv.config();

export const env = {
  botToken: process.env.BOT_TOKEN ?? "",
  miniAppUrl: process.env.MINI_APP_URL ?? process.env.APP_BASE_URL ?? "http://localhost:3000"
};

if (!env.botToken) {
  throw new Error("BOT_TOKEN is required");
}
