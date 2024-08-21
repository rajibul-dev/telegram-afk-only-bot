/**
 * @param {import('telegraf').Telegraf} bot
 * @param {import('telegraf').Context} ctx
 */

const { Markup } = require("telegraf");
const { getUserID } = require("./telegraf-logic");
const { getInvoice } = require("./invoice");

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

const productDescription = `You can enable access for this group by purchasing access from below button.

Note: this is primarily a form of donation and support, paying for getting a mere AFK Bot for 3 months is not justifiable, you can easily get free ones.
However, if your intention is to support me, thank you very much! It will help me create neat bots for all of you (that are mostly free)!`;

async function handleGroupPermission({ ctx, groupID, handlerType }) {
  if (!permittedGroups.includes(groupID)) {
    // no access
    try {
      // Attempt to send a message before leaving the group
      await ctx.reply(
        "❌ Since I am a private bot, this group doesn't have access for me...",
      );

      // invoice
      const invoice = ctx.replyWithInvoice(
        getInvoice({
          id: groupID,
          title: "3 Months AFK Bot Access",
          description: productDescription,
          currency: "XTR",
          amount: 50,
        }),
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
