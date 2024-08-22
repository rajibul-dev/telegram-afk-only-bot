/**
 * @param {import('telegraf').Telegraf} bot
 * @param {import('telegraf').Context} ctx
 */

const { isAfter } = require("date-fns");
const { documentRead } = require("../firebase/dbRead");
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

const productDescription = `You can enable access for this bot in this group for 3 months by purchasing access from the button below.`;
const furtherExplanation = `Note: this is primarily a form of donation and support, paying for getting a mere AFK Bot, and even just for 3 months only, is not a justifiable deal. However, if your intention is to support me, thank you very much, it would mean a lot to me, and help me tremendously! And it will help me create neat bots for all of you (that are mostly free)!`;

async function handleGroupPermission({ ctx, groupID, handlerType }) {
  const { document } = await documentRead("groupPlans", groupID);

  const notMyGroup = !permittedGroups.includes(groupID);
  const notInDatabase = !document;
  const isExpired = isAfter(new Date(), document?.expiry);

  if (notMyGroup && (notInDatabase || isExpired)) {
    // no access
    try {
      // Attempt to send a message before leaving the group
      await ctx.reply(
        "❌ Since I am a private bot, this group doesn't have access for me...",
      );

      // invoice
      await ctx.replyWithInvoice(
        getInvoice({
          id: groupID,
          title: "3-Month Access for this Group",
          description: productDescription,
          currency: "INR",
          amount: 10,
        }),
      );

      await ctx.reply(furtherExplanation);

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
