const { getChatId } = require("./storage");

/**
 * Reports any errors directly to the chat
 */
const reportError = async (ctx, err, uncaught = false) =>
	await ctx.telegram.sendMessage(
		await getChatId(),
		`${uncaught ? "UNCAUGHT ERROR: " : ""}${err}`
	);

/**
 * Reports any shutdowns directly to the chat
 * @param type SIGINT or SIGTERM
 */
const reportShutdown = async (ctx, type) =>
	await ctx.telegram.sendMessage(
		await getChatId(),
		`Bot shutting down. Cause: ${type}`
	);

module.exports = { reportError, reportShutdown };
