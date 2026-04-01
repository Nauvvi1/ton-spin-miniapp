import { InlineKeyboard } from "grammy";

export function buildOpenAppKeyboard(miniAppUrl: string): InlineKeyboard {
  return new InlineKeyboard().webApp("Open TON Spin", miniAppUrl);
}
