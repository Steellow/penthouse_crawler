const storage = require("node-persist");

const STORAGE_KEY_BANNED_AREAS = "banned_areas";
const STORAGE_KEY_CHECKED_LINKS = "checked_links";

const banArea = async (area) => {
	if (!area) {
		return;
	}

	await storage.init();

	const bannedAreas = (await storage.getItem(STORAGE_KEY_BANNED_AREAS)) || [];

	if (bannedAreas.includes(area)) {
		console.log(`${area} already banned, not doing anything 🤖`);
		return;
	}

	// All areas are saved as lowercase to simplify stuff
	storage.setItem(STORAGE_KEY_BANNED_AREAS, [
		...bannedAreas,
		area.toLowerCase(),
	]);

	console.log(`${area} banned! ❌`);
};

const getBannedAreas = async () => {
	await storage.init();
	return (await storage.getItem(STORAGE_KEY_BANNED_AREAS)) || [];
};

/**
 * Returns only those links which are not checked yet
 * Also adds them to storage, so they won't be checked again
 */
const filterNewLinks = async (scrapedLinks) => {
	await storage.init();

	const checkedLinks =
		(await storage.getItem(STORAGE_KEY_CHECKED_LINKS)) || [];

	const newLinks = scrapedLinks.filter(
		(link) => !checkedLinks.includes(link)
	);

	storage.setItem(STORAGE_KEY_CHECKED_LINKS, [...checkedLinks, ...newLinks]);

	console.log(newLinks.length + " new apartments found! 🥳");
	return newLinks;
};

module.exports = { getBannedAreas, filterNewLinks, banArea };
