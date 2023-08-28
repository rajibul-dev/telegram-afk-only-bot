// .env import
const dotenv = require("dotenv");
dotenv.config();

// main firebase functions import
const functions = require("firebase-functions");

// import time formatter tool date-fns
const { formatDistanceToNowStrict } = require("date-fns");

// Firebase logic encapsulated function
// write
const { documentWrite, serverTimestamp } = require("./firebase/dbWrite");
const { documentAdd, documentUpdate, documentDelete, error } =
  documentWrite("users");

// read
const { documentRead, queryCollectionEqualRead } = require("./firebase/dbRead");

// Telegraf essential initlization
const botToken = process.env.BOT_TOKEN;
const { Telegraf } = require("telegraf");

const bot = new Telegraf(botToken);

// Telegraf logic encapsulated function
const {
  getUserID,
  getFullName,
  getReplyOptions,
  fullNameWithTag,
  getCommandArguments,
  getReason,
  getTaggedPersonData,
  getUsername,
  getFullNameAndNameTagWithID
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
  const username = getUsername(ctx);
  const reasonRes = getReason(ctx);
  const reason = reasonRes ? reasonRes : null;

  // check if document with same id exists
  const { document } = await documentRead("users", userID);

  if (document && document.afkAt) {
    // update afk and reason values
    documentUpdate(userID, { afkAt: serverTimestamp(), reason, username });

    // send "is now afk" message
    reason
      ? ctx.reply(
          `${nameTag} is now away.\nUpdated afk <em>time</em> and <em>reason</em>!\n<strong>Reason:</strong> ${reason}`,
          getReplyOptions(ctx.message)
        )
      : ctx.reply(
          `${nameTag} is now away.\nUpdated afk <em>time</em>!`,
          getReplyOptions(ctx.message)
        );
    return;
  }

  const data = {
    afkAt: serverTimestamp(),
    reason,
    username
  };

  documentAdd(userID, data);

  reason
    ? ctx.reply(
        `${nameTag} is now away!\n<strong>Reason:</strong> ${reason}`,
        getReplyOptions(ctx.message)
      )
    : ctx.reply(`${nameTag} is now away!`, getReplyOptions(ctx.message));
});

// unset afk if was afk and messaged
bot.on("message", async (ctx) => {
  const userID = `${getUserID(ctx)}`;
  const nameTag = fullNameWithTag(ctx);
  const username = getUsername(ctx);

  const { document } = await documentRead("users", userID);

  // if the user was afk
  if (document && document.afkAt) {
    // get how much time the user was afk
    const afkInterval = formatDistanceToNowStrict(document.afkAt.toDate(), {
      roundingMethod: "round"
    });

    // unset afk
    const resetData = {
      afkAt: null,
      reason: null,
      username
    };
    documentUpdate(userID, resetData);

    // send "no longer afk" message
    ctx.reply(
      `${nameTag} is back!\nThey were afk for ${afkInterval}.`,
      getReplyOptions(ctx.message)
    );
  }

  // if someone else replys to afk person
  if (ctx.message.reply_to_message) {
    const { taggedUserID, taggedUserNameTag } = getTaggedPersonData(ctx);

    // fetch tagged person's data
    const { document: taggedUserDocument } = await documentRead(
      "users",
      taggedUserID
    );

    // see if the tagged person was afk
    if (taggedUserDocument && taggedUserDocument.afkAt) {
      // get afk interval of tagged person
      const afkInterval = formatDistanceToNowStrict(
        taggedUserDocument.afkAt.toDate(),
        { roundingMethod: "round", addSuffix: true }
      );

      // send message to the tagger about tagged person's afk status
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

  // if someone else mentions to afk person
  const messageEntities = ctx.message.entities || [];

  const mentionedUsernames = messageEntities
    .filter((entity) => entity.type === "mention")
    .map((entity) =>
      ctx.message.text.substr(entity.offset + 1, entity.length - 1)
    );

  // loop over the mentions handle their replies
  mentionedUsernames.forEach(async (uname) => {
    const { document, error } = await queryCollectionEqualRead(
      "users",
      "username",
      uname
    );
    const { id, afkAt, reason } = document[0];

    // get full name with tag of the mentioned user
    const { nameTag } = await getFullNameAndNameTagWithID(id, ctx);

    // see if mentioned person is afk
    if (afkAt) {
      // get their afk period
      const afkInterval = formatDistanceToNowStrict(afkAt.toDate(), {
        roundingMethod: "round",
        addSuffix: true
      });

      // send the reply which was the whole point
      reason
        ? ctx.reply(
            `${nameTag} is afk.\n Last seen ${afkInterval}.\n<strong>Reason:</strong> ${reason}`,
            getReplyOptions(ctx.message)
          )
        : ctx.reply(
            `${nameTag} is afk.\n Last seen ${afkInterval}.`,
            getReplyOptions(ctx.message)
          );
    }
  });
});

// deployment
// exports.afkBotTelegram = functions.https.onRequest(
//   async (request, response) => {
//     functions.logger.log("Incoming message", request.body);
//     return await bot.handleUpdate(request.body, response).then((rv) => {
//       // if it's not a request from the telegram, rv will be undefined, but we should respond with 200
//       return !rv && response.sendStatus(200);
//     });
//   }
// );

bot.launch();
