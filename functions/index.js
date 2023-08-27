// import time formatter tool date-fns
const { formatDistanceToNowStrict } = require("date-fns");

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
  getReason,
  getTaggedPersonData
} = require("./encapsulation/telegraf-logic");

// Reusable message strings
const helloMessage = `Hello there! This is an afk bot, use /afk to see what it does.`;

// commands
const startCommands = ["start", "help"];

startCommands.forEach((command) => {
  bot.command(command, (ctx) => {
    ctx.reply(helloMessage, getReplyOptions(ctx.message));
  });
});

// /afk
bot.command("afk", async (ctx) => {
  const userID = `${getUserID(ctx)}`;
  const nameTag = fullNameWithTag(ctx);
  const reasonRes = getReason(ctx);
  const reason = reasonRes ? reasonRes : null;

  // check if document with same id exists
  const { document } = await documentRead("users", userID);

  if (document && document.afkAt) {
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

// remove if was afk and messaged
bot.on("message", async (ctx) => {
  const userID = `${getUserID(ctx)}`;
  const nameTag = fullNameWithTag(ctx);

  const { document } = await documentRead("users", userID);

  // if the user was afk
  if (document && document.afkAt) {
    // get how much time the user was afk
    const afkInterval = formatDistanceToNowStrict(document.afkAt.toDate(), {
      roundingMethod: "round"
    });

    const resetData = {
      afkAt: null,
      reason: null
    };
    documentUpdate(userID, resetData);
    ctx.reply(
      `${nameTag} is no longer afk!\nThey were afk for ${afkInterval}.`,
      getReplyOptions(ctx.message)
    );
  }

  // if someone else tags afk person
  if (ctx.message.reply_to_message) {
    const { taggedUserID, taggedUserNameTag } = getTaggedPersonData(ctx);

    // fetch tagged person's data
    const { document: taggedUserDocument } = await documentRead(
      "users",
      taggedUserID
    );

    // see if the tagged person was afk
    if (taggedUserDocument && taggedUserDocument.afkAt) {
      const afkInterval = formatDistanceToNowStrict(
        taggedUserDocument.afkAt.toDate(),
        { roundingMethod: "round", addSuffix: true }
      );

      taggedUserDocument.reason
        ? ctx.reply(
            `${taggedUserNameTag} is afk.\n Last seen ${afkInterval}.\n<strong>Reason:</strong> ${taggedUserDocument.reason}`,
            getReplyOptions(ctx.message)
          )
        : ctx.reply(
            `${taggedUserNameTag} is afk.\n Last seen ${afkInterval}.`,
            getReplyOptions(ctx.message)
          );
    }
  }
});

// deployment
bot.launch();
