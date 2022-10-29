const { Telegraf } = require("telegraf");
const storage = require("./storage");
const util = require("./util");

const { reportError, reportShutdown } = require("./reporter");
const {
	checkNewApartments,
	checkNewApartmentsCronJob,
} = require("./scheduler");

const bot = new Telegraf(process.env.BOT_TOKEN);

const isValidUser = async (ctx) => {
	const currentChatId = util.getChatId(ctx);
	const savedChatId = await storage.getChatId();

	return currentChatId === savedChatId;
};

// Handling EVERYTHING inside on('text').
// Just easier this way, otherwise you need
// to remember which bot commands are higher
// priority than others.
bot.on("text", async (ctx) => {
	if (await !isValidUser(ctx)) {
		// In case someone else is trying to use the bot, exit immediately
		return;
	}

	const input = ctx.update.message.text.split(" ");

	const command = input[0];
	const args = input.slice(1);

	switch (command) {
		case "/start":
			await storage.saveChatId(ctx);
			ctx.reply(
				"Hello! I'm a bot who finds top floor rentable apartments from Oikotie. Features:\n\n• Notifies you when new top floor apartment is found\n• Checks for new apartments every hour\n• Check for new apartments immediately with /now\n• Ban city areas with `/ban cityArea`. You won't get notifications about apartments in banned areas."
			);
			break;

		case "/now":
			await checkNewApartments(ctx);
			break;

		case "/ban":
			if (!args || args.length === 0) {
				ctx.reply(
					"Please specify which area to ban, e.g. `/ban Kamppi`"
				);
			}

			await storage.banArea(args.join(" "));
			break;

		default:
			break;
	}
});

bot.catch(async (err, ctx) => {
	console.log(`[ERROR] ${err}`);
	await reportError(ctx, err);
});

bot.launch();
console.log("Bot is now running! 🤖");

checkNewApartmentsCronJob.start();

//

// Enable graceful stop
process.once("SIGINT", () => {
	reportShutdown(bot, "SIGINT");
	return bot.stop("SIGINT");
});

process.once("SIGTERM", () => {
	reportShutdown(bot, "SIGTERM");
	return bot.stop("SIGTERM");
});

// Just in case, it should NEVER go here!!! Causes bot to crash
process.on("uncaughtException", async (err) => {
	console.error("[UNCAUGHT ERROR]", err);
	await reportError(bot, err, true);
	process.exit(1); // mandatory (as per the Node.js docs)
});
