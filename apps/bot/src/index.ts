import { Bot, GrammyError, HttpError } from "grammy";
import { env } from "./config/env";
import { registerHelpCommand } from "./features/help.command";
import { registerStartCommand } from "./features/start.command";

const bot = new Bot(env.botToken);

registerStartCommand(bot, env.miniAppUrl);
registerHelpCommand(bot);

bot.catch((error) => {
  const { ctx } = error;
  console.error(`Bot error while handling update ${ctx.update.update_id}`);

  if (error.error instanceof GrammyError) {
    console.error("Telegram API error:", error.error.description);
    return;
  }

  if (error.error instanceof HttpError) {
    console.error("Network error:", error.error);
    return;
  }

  console.error("Unknown error:", error.error);
});

bot.start({
  onStart: (info) => {
    console.log(`[bot] Started as @${info.username}`);
  }
});
