const botToken = "6076138177:AAEJBj7-sHaVQg_KcXIp_64YA1pRjHtzBtE";
const { Telegraf } = require("telegraf");

const bot = new Telegraf(botToken);

bot.start((ctx) => {
  ctx.reply("Hey there, it's working!");
});

bot.launch();
