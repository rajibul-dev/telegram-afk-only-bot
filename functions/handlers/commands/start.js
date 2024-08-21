/**
 * @param {import('telegraf').Telegraf} bot
 */

const { getReplyOptions } = require("../../encapsulation/telegraf-logic");

const helloMessage = `Hello there! This is an afk bot, use /afk to see what it does. The meaning of afk is "away from keyboard", away from phone or PC basically.`;
const startCommands = ["start", "help"];

module.exports = (bot) => {
  startCommands.forEach((command) => {
    bot.command(command, (ctx) => {
      ctx.reply(helloMessage, getReplyOptions(ctx.message));
    });
  });
};
