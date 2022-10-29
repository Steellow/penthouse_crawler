const getChatId = (ctx) => ctx.update.message.chat.id;

module.exports = { getChatId };
