import type { Bot } from "grammy";

export function registerHelpCommand(bot: Bot): void {
  bot.command("help", async (ctx) => {
    await ctx.reply(
      [
        "Команды:",
        "/start — приветствие и кнопка открытия mini app",
        "/spin — быстро открыть игру",
        "/help — справка"
      ].join("\n")
    );
  });
}
