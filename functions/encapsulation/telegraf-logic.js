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

module.exports = { getUserID, getUserName, getReplyOptions, fullNameWithTag };
