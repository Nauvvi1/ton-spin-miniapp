import type { Bot } from "grammy";
import { buildOpenAppKeyboard } from "../keyboards/open-app.keyboard";

export function registerStartCommand(bot: Bot, miniAppUrl: string): void {
  bot.command("start", async (ctx) => {
    await ctx.reply(
      [
        "🎰 TON Spin",
        "",
        "Вертикальная рулетка в mini app.",
        "Ставка фиксированная: 1 TON.",
        "Результат всегда выбирается на сервере, а клиент только красиво проигрывает анимацию."
      ].join("\n"),
      {
        reply_markup: buildOpenAppKeyboard(miniAppUrl)
      }
    );
  });

  bot.command("spin", async (ctx) => {
    await ctx.reply("Открывай миниапп — кнопка ниже.", {
      reply_markup: buildOpenAppKeyboard(miniAppUrl)
    });
  });
}
