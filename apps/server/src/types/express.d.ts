import type { TelegramAuthUser } from "../middleware/telegram-auth";

declare global {
  namespace Express {
    interface Request {
      telegramUser: TelegramAuthUser;
    }
  }
}

export {};
