// Firebase logic encapsulated function
// write
const { documentWrite, serverTimestamp } = require("./firebase/dbWrite");
const { documentAdd, documentUpdate, documentDelete, error } =
  documentWrite("users");

// read
const documentRead = require("./firebase/dbRead");

// Telegraf essential initlization
const botToken = "6076138177:AAEJBj7-sHaVQg_KcXIp_64YA1pRjHtzBtE";
const { Telegraf } = require("telegraf");

const bot = new Telegraf(botToken);

// Telegraf logic encapsulated function
const {
  getUserID,
  getUserName,
  getReplyOptions,
  fullNameWithTag,
  getCommandArguments,
  getReason
} = require("./encapsulation/telegraf-logic");

// Reusable message strings
const helloMessage = `Hello there! This is an afk bot, use /afk to see what it does.`;

// commands
bot.start((ctx) => {
  ctx.reply(helloMessage, getReplyOptions(ctx.message));
});

bot.command("afk", async (ctx) => {
  const userID = `${getUserID(ctx)}`;
  const nameTag = fullNameWithTag(ctx);
  const reasonRes = getReason(ctx);
  const reason = reasonRes ? reasonRes : null;

  // check if document with same id exists
  const { document } = await documentRead("users", userID);

  if (document) {
    documentUpdate(userID, { afkAt: serverTimestamp(), reason });
    reason
      ? ctx.reply(
          `${nameTag} is now afk.\nUpdated afk <em>time</em> and <em>reason</em>!\n<strong>Reason:</strong> ${reason}`,
          getReplyOptions(ctx.message)
        )
      : ctx.reply(
          `${nameTag} is now afk.\nUpdated afk <em>time</em>!`,
          getReplyOptions(ctx.message)
        );
    return;
  }

  const data = {
    afkAt: serverTimestamp(),
    reason
  };

  documentAdd(userID, data);

  reason
    ? ctx.reply(
        `${nameTag} is now afk!\n<strong>Reason:</strong> ${reason}`,
        getReplyOptions(ctx.message)
      )
    : ctx.reply(`${nameTag} is now afk!`, getReplyOptions(ctx.message));
});

// deployment
bot.launch();
