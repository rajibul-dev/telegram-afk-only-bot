const botToken = "6076138177:AAEJBj7-sHaVQg_KcXIp_64YA1pRjHtzBtE";
const { Telegraf } = require("telegraf");

const bot = new Telegraf(botToken);

const {
  getUserID,
  getUserName,
  getReplyOptions,
  fullNameWithTag
} = require("./encapsulation/telegraf-logic");

bot.start((ctx) => {
  const id = getUserID(ctx);
  const userName = getUserName(ctx);
  const nameWithTag = fullNameWithTag(ctx);

  ctx.reply(
    `Hey there, it's working!\nYour id: ${id}\nYour name is ${nameWithTag}`,
    getReplyOptions(ctx.message)
  );
});

bot.launch();
