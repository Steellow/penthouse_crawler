const storage = require("node-persist");

const STORAGE_KEY_BANNED_AREA = "banned_areas";
const STORAGE_KEY_CHECKED_LINKS = "checked_links";

const getBannedAreas = async () => {
	await storage.init();
	return storage.getItem(STORAGE_KEY_BANNED_AREA) || [];
};

/**
 * Returns only those links which are not checked yet
 * Also adds them to storage, so they won't be checked again
 */
const filterNewLinks = async (scrapedLinks) => {
	await storage.init();
    
	const checkedLinks = await storage.getItem(STORAGE_KEY_CHECKED_LINKS) || [];
	const newLinks = scrapedLinks.filter(
		(link) => {
			setTimeout(() => { console.log("Waiting a minute before checking new link, to avoid a ban 🤖"); }, 60000);
			return !checkedLinks.includes(link);
		}
	);

	storage.setItem(STORAGE_KEY_CHECKED_LINKS, [...checkedLinks, ...newLinks]);

	console.log(newLinks.length + " new apartments found!");
	return newLinks;
};

module.exports = { getBannedAreas, filterNewLinks };
