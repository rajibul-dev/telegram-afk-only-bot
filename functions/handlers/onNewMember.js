/**
 * @param {import('telegraf').Telegraf} bot
 */

const { handleGroupPermission } = require("../encapsulation/permittedGroups");

module.exports = (bot) => {
  bot.on("new_chat_members", async (ctx) => {
    const newMembers = ctx.message.new_chat_members;

    newMembers.forEach(async (member) => {
      // check if this bot joined
      if (member.is_bot && member.id === ctx.botInfo.id) {
        const groupID = String(ctx.chat.id);

        // check permission
        handleGroupPermission({ ctx, groupID, handlerType: "onJoin" });
      }
    });
  });
};
