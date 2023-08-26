// Firebase logic encapsulated function
require("./firebase/config");
const dbWrite = require("./firebase/dbWrite");

const { documentAdd, documentUpdate, error, serverTimestamp } =
  dbWrite("users");

// Telegraf essential initlization
const botToken = "6076138177:AAEJBj7-sHaVQg_KcXIp_64YA1pRjHtzBtE";
const { Telegraf } = require("telegraf");

const bot = new Telegraf(botToken);

// Telegraf logic encapsulated function
const {
  getUserID,
  getUserName,
  getReplyOptions,
  fullNameWithTag
} = require("./encapsulation/telegraf-logic");

// Reusable message strings
const helloMessage = `Hello there! This is an afk bot, use /afk to see what it does.`;

// commands
bot.start((ctx) => {
  ctx.reply(helloMessage, getReplyOptions(ctx.message));
});

bot.command("afk", (ctx) => {
  const userID = getUserID(ctx);
  const nameTag = fullNameWithTag(ctx);

  const data = {
    afkAt: serverTimestamp()
  };

  documentAdd(userID, data);

  ctx.reply(`${nameTag} is now afk!`, getReplyOptions(ctx.message));
});

// deployment
bot.launch();
