/**
 * @param {import('telegraf').Telegraf} bot
 */

const { documentWrite } = require("../firebase/dbWrite");
const { documentAdd, documentUpdate } = documentWrite("users");
const { documentRead } = require("../firebase/dbRead");
const { addMonths, isAfter, format } = require("date-fns");

module.exports = (bot) => {
  bot.on("pre_checkout_query", async (ctx) => {
    const payload = ctx.preCheckoutQuery.invoice_payload;
    const groupID = payload.groupID;

    // check if a subscription is already there or not
    const { document } = await documentRead("groupPlans", groupID);
    if (!document) {
      // no document already, proceed to payment phase
      return ctx.answerPreCheckoutQuery(true);
    }
    if (document && isAfter(new Date(), document.expiry)) {
      return ctx.answerPreCheckoutQuery(true);
    }

    return ctx.answerPreCheckoutQuery(
      false,
      `This group already has an active plan. It expires on ${format(
        document.expiry,
        "dd/MM/yyyy",
      )}.`,
    );
  });

  bot.on("successful_payment", async (ctx) => {
    const payload = ctx.preCheckoutQuery.invoice_payload;
    const groupID = payload.groupID;

    // send beautiful payment done message to the user!
    await ctx.reply(
      `<strong>✅ Your payment was successful!</strong>
Your group will have access to me for the next 3 months. You may add back this bot o your group.

Plan expires on <strong>${format(
        addMonths(new Date(), 3),
        "dd/MM/yyyy",
      )}</strong>
There is no autopay system.
`,
      { parse_mode: "HTML" },
    );

    // update relevant things in the database
    const { document } = await documentRead("groupPlans", groupID);
    if (document) {
      // update existing
      const data = {
        expiry: addMonths(new Date(), 3),
      };
      documentUpdate(groupID, data);
    } else {
      // add new
      const data = {
        expiry: addMonths(new Date(), 3),
      };
      documentAdd(groupID, data);
    }
  });
};
