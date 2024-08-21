/**
 * @param {import('telegraf').Telegraf} bot
 */

const myGroups = [
  // Experimental Group 1
  "-1001539655354",

  // Experimental Group 3
  "-1001792775854",

  // My WIAN
  "-1001907768833",

  // Way to Wisdom
  "-1001506949302",
];

// TODO: get the premium access groups
const permittedGroups = [...myGroups];

function handleGroupPermission({ ctx, groupID, handlerType }) {
  // Check if the group is permitted
  if (!permittedGroups.includes(groupID)) {
    // Leave the group if it's not permitted
    ctx.reply(
      "❌ Since I am a private bot, this group doesn't have access for me...",
    );
    ctx.reply("Leaving group...");
    setTimeout(async () => {
      await ctx.leaveChat();
    }, 1000);
  } else {
    if (handlerType === "onJoin") {
      ctx.reply("✅ Access verified!");
    } else if (handlerType === "onMessage") {
      return;
    }
  }
}

module.exports = { permittedGroups, handleGroupPermission };
