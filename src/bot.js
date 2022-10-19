const { Telegraf } = require("telegraf");
const { getSearchResultLinks, filterApartment } = require("./scraper");
const { filterNewLinks } = require("./storage");

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) =>
	ctx.reply(
		"Hello! I'm a bot who finds top floor rentable apartments from Oikotie. Features:\n\n• Notifies you when new top floor apartment is found\n• Checks for new apartments every hour\n• Check for new apartments immediately with /now\n• Ban city areas with `/ban cityArea`. You won't get notifications about apartments in banned areas."
	)
);

const checkNewApartments = async (ctx) => {
	console.log("Checking for new apartments");

	const links = await getSearchResultLinks();
	const newLinks = await filterNewLinks(links);
	const topFloorApartments = newLinks.filter(
		async (link) => await filterApartment(link)
	);

	console.log(topFloorApartments.length + " valid top floor apartments found, notifying user.");
	topFloorApartments.forEach((link) =>{
		ctx.reply(link);
	});

	console.log("All new apartments checked");
};

// Handling EVERYTHING inside on('text').
// Just easier this way, otherwise you need
// to remember which bot commands are higher
// priority than others.
bot.on("text", async(ctx)=> {
	const msg = ctx.update.message.text;

	switch (msg){
	case "/now":
		await checkNewApartments(ctx);
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
