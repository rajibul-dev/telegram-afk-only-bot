/**
 * @param {import('telegraf').Telegraf} bot
 * @param {import('telegraf').Context} ctx
 */

const { isAfter } = require("date-fns");
const { documentRead } = require("../firebase/dbRead");
const { getInvoice } = require("./invoice");
const { getUserID } = require("./telegraf-logic");

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

const permittedGroups = [...myGroups];

const productDescription = (groupName) =>
  `You can enable access for this bot in "${groupName}" for 3 months by purchasing access from the button below.`;
const furtherExplanation = `Note: this is primarily a form of donation and support, paying for getting a mere AFK Bot, and even just for 3 months only, is not a justifiable deal. However, if your intention is to support me, thank you very much, it would mean a lot to me, and help me tremendously! And it will help me create neat bots for all of you (that are mostly free)!`;
const pmExplanation = `If the payment didn't work from the group's invoice, it will work here!`;

async function handleGroupPermission({ ctx, groupID, handlerType }) {
  const userID = getUserID(ctx);
  const groupName = ctx.message.chat.title;

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

      // send invoice in group
      const invoice = getInvoice({
        id: groupID,
        title: "3-Month Access for this Group",
        description: productDescription(groupName),
        currency: "XTR",
        amount: 150,
      });
      await ctx.replyWithInvoice(invoice);

      // send explanation in group
      await ctx.reply(furtherExplanation);

      // send invoice in pm
      const pmInvoice = {
        ...invoice,
        chat_id: userID,
        title: "3-Month Access for your Group",
      };
      await ctx.sendInvoice(pmInvoice);
      await ctx.sendMessage(pmExplanation, { chat_id: userID });
      await ctx.sendMessage(furtherExplanation, { chat_id: userID });

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
