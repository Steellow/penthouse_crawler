const { Telegraf } = require("telegraf");
const { getSearchResultLinks, filterApartment } = require("./scraper");
const { filterNewLinks, banArea } = require("./storage");

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) =>
	ctx.reply(
		"Hello! I'm a bot who finds top floor rentable apartments from Oikotie. Features:\n\n• Notifies you when new top floor apartment is found\n• Checks for new apartments every hour\n• Check for new apartments immediately with /now\n• Ban city areas with `/ban cityArea`. You won't get notifications about apartments in banned areas."
	)
);

const checkNewApartments = async (ctx) => {
	console.log("Checking for new apartments 🏡");

	const links = await getSearchResultLinks();
	const newLinks = await filterNewLinks(links);

	for (let i = 0; i < newLinks.length; i++) {
		const link = newLinks[i];
		const sendMsg = await filterApartment(link);
		if (sendMsg) {
			console.log("Top floor apartment found, sending message! 🔔");
			ctx.reply(link);
		}
	}

	console.log("All new apartments checked 🤙");
};

// Handling EVERYTHING inside on('text').
// Just easier this way, otherwise you need
// to remember which bot commands are higher
// priority than others.
bot.on("text", async (ctx) => {
	const input = ctx.update.message.text.split(" ");

	const command = input[0];
	const args = input.slice(1);

	switch (command) {
		case "/now":
			await checkNewApartments(ctx);
			break;

		case "/ban":
			if (!args || args.length === 0) {
				ctx.reply(
					"Please specify which area to ban, e.g. `/ban Kamppi`"
				);
			}

			await banArea(args.join(" "));
			break;

		default:
			break;
	}
});

bot.launch();
console.log("Bot is now running! 🤖");

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
