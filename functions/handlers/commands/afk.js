// Firebase logic encapsulated function
const { documentWrite, serverTimestamp } = require("../../firebase/dbWrite");
const { documentAdd, documentUpdate } = documentWrite("users");
const { documentRead } = require("../../firebase/dbRead");
const {
  getUserID,
  getReplyOptions,
  fullNameWithTag,
  getReason,
  getUsername,
  getFirstName,
} = require("../../encapsulation/telegraf-logic");

module.exports = (bot) => {
  bot.command("afk", async (ctx) => {
    const userID = `${getUserID(ctx)}`;
    const nameTag = fullNameWithTag(ctx);
    const username = getUsername(ctx) || getFirstName(ctx);
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
            getReplyOptions(ctx.message),
          )
        : ctx.reply(
            `${nameTag} is now away.\nUpdated afk <em>time</em>!`,
            getReplyOptions(ctx.message),
          );
      return;
    }

    const data = {
      afkAt: serverTimestamp(),
      reason,
      username: username,
    };

    documentAdd(userID, data);

    reason
      ? ctx.reply(
          `${nameTag} is now away!\n<strong>Reason:</strong> ${reason}`,
          getReplyOptions(ctx.message),
        )
      : ctx.reply(`${nameTag} is now away!`, getReplyOptions(ctx.message));
  });
};
