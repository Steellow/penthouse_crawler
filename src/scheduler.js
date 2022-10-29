const { CronJob } = require("cron");
const { getSearchResultLinks, filterApartment } = require("./scraper");
const storage = require("./storage");

const checkNewApartments = async (ctx) => {
	console.log("Checking for new apartments 🏡");

	const links = await getSearchResultLinks();
	const newLinks = await storage.filterNewLinks(links);

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

const checkNewApartmentsEveryHourCronJob = new CronJob(
	"16 * * * *",
	checkNewApartments
);

module.exports = { checkNewApartments, checkNewApartmentsEveryHourCronJob };
