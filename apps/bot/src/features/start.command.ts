import type { Bot } from "grammy";
import { buildOpenAppKeyboard } from "../keyboards/open-app.keyboard";

export function registerStartCommand(bot: Bot, miniAppUrl: string): void {
  bot.command("start", async (ctx) => {
    await ctx.reply(
      [
        "🎰 TON Spin",
        "",
        "Open the mini app, spin the vertical reel, and collect the prize that lands in the center.",
        "Auto Spin is available inside the app."
      ].join("\n"),
      {
        reply_markup: buildOpenAppKeyboard(miniAppUrl)
      }
    );
  });

  bot.command("spin", async (ctx) => {
    await ctx.reply("Open TON Spin below.", {
      reply_markup: buildOpenAppKeyboard(miniAppUrl)
    });
  });
}
