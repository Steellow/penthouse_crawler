const { TimeoutError } = require("puppeteer");
const { getChatId } = require("./storage");

/**
 * Reports any errors directly to the chat
 */
const reportError = async (ctx, err, uncaught = false) => {
	console.error(err);

	// Timeout errors happen every now and then for some reason
	// I don't really care to fix this, so I'm ignoring them as the scraping usually works
	if (!(err instanceof TimeoutError)) {
		await ctx.telegram.sendMessage(
			await getChatId(),
			`${uncaught ? "UNCAUGHT ERROR: " : ""}${err}`
		);
	}
};

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
