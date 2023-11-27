function getUserID(ctx) {
  return ctx.message.from.id;
}
function getFirstName(ctx) {
  const user = ctx.message.from;
  return escapeHTML(user.first_name);
}
function getFullName(ctx) {
  const user = ctx.message.from;
  return escapeHTML(
    `${user.first_name}${user.last_name ? " " + user.last_name : ""}`,
  );
}
function getUsername(ctx) {
  return ctx.message.from.username;
}
function getReplyOptions(message) {
  const replyOptions = { parse_mode: "HTML" };
  if (message.message_id) {
    replyOptions.reply_to_message_id = message.message_id;
  }
  return replyOptions;
}
function fullNameWithTag(ctx) {
  const name = getFullName(ctx);
  const id = getUserID(ctx);
  return `<strong><a href='tg://user?id=${id}'>${name}</a></strong>`;
}
function getCommandArguments(ctx) {
  const message = ctx.message.text;
  const [command, ...arguments] = message.split(" ");
  return arguments;
}
function getReason(ctx) {
  const arguemnts = getCommandArguments(ctx);
  return arguemnts.join(" ");
}
function getTaggedPersonData(ctx) {
  const user = ctx.message.reply_to_message?.from;

  const taggedUserID = `${user.id}`;
  const taggedUserFullName = `${user.first_name}${
    user.last_name ? " " + user.last_name : ""
  }`;
  const taggedUserNameTag = `<strong><a href='tg://user?id=${taggedUserID}'>${taggedUserFullName}</a></strong>`;

  return { taggedUserID, taggedUserFullName, taggedUserNameTag, user };
}
async function getFullNameAndNameTagWithID(id, ctx) {
  try {
    const user = await ctx.telegram.getChat(id);

    const fullName = `${user.first_name}${
      user.last_name ? " " + user.last_name : ""
    }`;
    const nameTag = `<strong><a href='tg://user?id=${id}'>${fullName}</a></strong>`;

    return { user, nameTag, fullName };
  } catch (error) {
    console.error(error);
    ctx.reply("An error occurred while fetching user data.");
    return { user: null, nameTag: null, fullName: null };
  }
}

function escapeHTML(html) {
  return html.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

module.exports = {
  getUserID,
  getFullName,
  getReplyOptions,
  fullNameWithTag,
  getCommandArguments,
  getReason,
  getTaggedPersonData,
  getUsername,
  getFullNameAndNameTagWithID,
  getFirstName,
};
