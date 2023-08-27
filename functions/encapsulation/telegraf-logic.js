function getUserID(ctx) {
  return ctx.message.from.id;
}
function getUserName(ctx) {
  const user = ctx.message.from;
  return `${user.first_name}${user.last_name ? " " + user.last_name : ""}`;
}
function getReplyOptions(message) {
  const replyOptions = { parse_mode: "HTML" };
  if (message.message_id) {
    replyOptions.reply_to_message_id = message.message_id;
  }
  return replyOptions;
}
function fullNameWithTag(ctx) {
  const name = getUserName(ctx);
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

module.exports = {
  getUserID,
  getUserName,
  getReplyOptions,
  fullNameWithTag,
  getCommandArguments,
  getReason,
  getTaggedPersonData
};