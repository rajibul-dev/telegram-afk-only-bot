/**
 * @param {import('telegraf').Telegraf} bot
 */

// import time formatter tool luxon
const { DateTime, Duration } = require("luxon");
const { formatAfkInterval } = require("../encapsulation/luxon-logic");

// Firebase logic encapsulated function
// write
const { documentWrite } = require("../firebase/dbWrite");
const { documentUpdate } = documentWrite("users");

// read
const {
  documentRead,
  queryCollectionEqualRead,
} = require("../firebase/dbRead");
const {
  getUserID,
  getReplyOptions,
  fullNameWithTag,
  getTaggedPersonData,
  getUsername,
  getFullNameAndNameTagWithID,
  getFirstName,
} = require("../encapsulation/telegraf-logic");
const { handleGroupPermission } = require("../encapsulation/permittedGroups");

module.exports = (bot) => {
  // unset afk if was afk and messaged
  bot.on("message", async (ctx) => {
    // check group permission
    const groupID = String(ctx.chat.id);
    handleGroupPermission({ ctx, groupID, handlerType: "onMessage" });

    const userID = `${getUserID(ctx)}`;
    const nameTag = fullNameWithTag(ctx);
    const username = getUsername(ctx) || getFirstName(ctx);

    const { document } = await documentRead("users", userID);

    // if the user was afk
    if (document && document.afkAt) {
      // get how much time the user was afk and reason for afk
      const afkInterval = Duration.fromMillis(
        DateTime.now().toMillis() - document.afkAt.toMillis(),
      )
        .shiftTo("years", "months", "days", "hours", "minutes", "seconds")
        .toObject();

      const reason = document.reason;
      const afkDurationString = `<strong>${formatAfkInterval(
        afkInterval,
      )}</strong>`;

      // unset afk
      const resetData = {
        afkAt: null,
        reason: null,
        username,
      };
      documentUpdate(userID, resetData);

      // send "no longer afk" message
      reason
        ? ctx.reply(
            `${nameTag} is back!\nThey were afk for ${afkDurationString}.\n\n<strong>Reason:</strong> ${reason}`,
            getReplyOptions(ctx.message),
          )
        : ctx.reply(
            `${nameTag} is back!\nThey were afk for ${afkDurationString}.`,
            getReplyOptions(ctx.message),
          );
    }

    // if someone else replys to afk person
    if (ctx.message.reply_to_message) {
      const { taggedUserID, taggedUserNameTag } = getTaggedPersonData(ctx);

      // fetch tagged person's data
      const { document: taggedUserDocument } = await documentRead(
        "users",
        taggedUserID,
      );

      // see if the tagged person was afk
      if (taggedUserDocument && taggedUserDocument.afkAt) {
        // get afk interval of tagged person
        const afkInterval = Duration.fromMillis(
          DateTime.now().toMillis() - taggedUserDocument.afkAt.toMillis(),
        )
          .shiftTo("years", "months", "days", "hours", "minutes", "seconds")
          .toObject();
        const afkDurationString = `<strong>${formatAfkInterval(
          afkInterval,
        )}</strong>`;

        // send message to the tagger about tagged person's afk status
        taggedUserDocument.reason
          ? ctx.reply(
              `${taggedUserNameTag} is afk.\nLast seen ${afkDurationString} ago.\n<strong>Reason:</strong> ${taggedUserDocument.reason}`,
              getReplyOptions(ctx.message),
            )
          : ctx.reply(
              `${taggedUserNameTag} is afk.\nLast seen ${afkDurationString} ago.`,
              getReplyOptions(ctx.message),
            );
      }
    }

    // if someone else mentions to afk person
    const messageEntities = ctx.message.entities || [];

    const mentionedUsernames = messageEntities
      .filter(
        (entity) => entity.type === "mention" || entity.type === "text_mention",
      )
      .map((entity) =>
        entity.type === "mention"
          ? ctx.message.text.substr(entity.offset + 1, entity.length - 1)
          : ctx.message.text.substr(entity.offset, entity.length),
      );

    // loop over the mentions handle their replies
    mentionedUsernames.forEach(async (uname) => {
      const { document, error } = await queryCollectionEqualRead(
        "users",
        "username",
        uname,
      );
      const { id, afkAt, reason } = document[0];

      // get full name with tag of the mentioned user
      const { nameTag } = await getFullNameAndNameTagWithID(id, ctx);

      // see if mentioned person is afk
      if (afkAt) {
        // get their afk period
        const afkInterval = Duration.fromMillis(
          DateTime.now().toMillis() - afkAt.toMillis(),
        )
          .shiftTo("years", "months", "days", "hours", "minutes", "seconds")
          .toObject();
        const afkDurationString = `<strong>${formatAfkInterval(
          afkInterval,
        )}</strong>`;

        // send the reply which was the whole point
        reason
          ? ctx.reply(
              `${nameTag} is afk.\nLast seen ${afkDurationString} ago.\n<strong>Reason:</strong> ${reason}`,
              getReplyOptions(ctx.message),
            )
          : ctx.reply(
              `${nameTag} is afk.\nLast seen ${afkDurationString} ago.`,
              getReplyOptions(ctx.message),
            );
      }
    });
  });
};
