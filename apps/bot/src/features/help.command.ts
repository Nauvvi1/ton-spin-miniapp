import type { Bot } from "grammy";

export function registerHelpCommand(bot: Bot): void {
  bot.command("help", async (ctx) => {
    await ctx.reply(
      [
        "Commands:",
        "/start — welcome message and the app button",
        "/spin — open the game",
        "/help — this help message"
      ].join("\n")
    );
  });
}
