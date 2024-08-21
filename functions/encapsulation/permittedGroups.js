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

async function handleGroupPermission({ ctx, groupID, handlerType }) {
  if (!permittedGroups.includes(groupID)) {
    // no access
    try {
      // Attempt to send a message before leaving the group
      await ctx.reply(
        "❌ Since I am a private bot, this group doesn't have access for me...",
      );
      await ctx.reply("Leaving group...");
    } catch (error) {
      // Handle error if bot has already left or cannot send messages
      console.error("Failed to send message:", error);
    }

    // Leave the group
    setTimeout(async () => {
      try {
        await ctx.leaveChat();
      } catch (error) {
        console.error("Failed to leave chat:", error);
      }
    }, 1500);
  } else {
    // handle when has access!
    if (handlerType === "onJoin") {
      ctx.reply("✅ Access verified!");
    } else if (handlerType === "onMessage") {
      return;
    }
  }
}

module.exports = { permittedGroups, handleGroupPermission };
