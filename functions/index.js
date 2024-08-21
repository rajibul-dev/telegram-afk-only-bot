const fs = require("fs");
const path = require("path");

// .env import
const dotenv = require("dotenv");
dotenv.config();

// main firebase functions import
const functions = require("firebase-functions");

// Telegraf essential initlization
const botToken =
  process.env.DEV_MODE === "true"
    ? process.env.DEV_BOT_TOKEN
    : process.env.BOT_TOKEN;

const { Telegraf } = require("telegraf");

const bot = new Telegraf(botToken);

function loadHandlers(dirPath) {
  const handlersPath = path.join(__dirname, dirPath);
  fs.readdirSync(handlersPath).forEach((file) => {
    const handler = require(path.join(handlersPath, file));
    handler(bot);
  });
}

loadHandlers("handlers/commands");
require("./handlers/onNewMember")(bot);
require("./handlers/onMessage")(bot);

// deployment
exports.afkBotTelegram = functions.https.onRequest(
  async (request, response) => {
    functions.logger.log("Incoming message", request.body);
    return await bot.handleUpdate(request.body, response).then((rv) => {
      // if it's not a request from the telegram, rv will be undefined, but we should respond with 200
      return !rv && response.sendStatus(200);
    });
  },
);

if (process.env.DEV_MODE === "true") {
  bot.launch();
}
