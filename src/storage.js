const storage = require("node-persist");
const util = require("./util");

const STORAGE_KEY_BANNED_AREAS = "BANNED_AREAS";
const STORAGE_KEY_CHECKED_LINKS = "CHECKED_LINKS";
const STORAGE_KEY_CHAT_ID = "CHAT_ID";

/**
 * Saves chat id to storage, if it's not saved already
 */
const saveChatId = async (ctx) => {
	await storage.init();

	const savedChatId = await storage.getItem(STORAGE_KEY_CHAT_ID);
	if (!savedChatId) {
		const chatId = util.getChatId(ctx);

		console.log("Chat id not in storage, saving value " + chatId);
		storage.setItem(STORAGE_KEY_CHAT_ID, chatId);
	}
};

const getChatId = async () => {
	await storage.init();
	return await storage.getItem(STORAGE_KEY_CHAT_ID);
};

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

const getCheckedLinks = async () => {
	await storage.init();
	return (await storage.getItem(STORAGE_KEY_CHECKED_LINKS)) || [];
};

/**
 * Adds specified link to CHECKED_LINKS
 */
const saveLink = async (link) => {
	await storage.init();

	const checkedLinks = await getCheckedLinks();
	storage.setItem(STORAGE_KEY_CHECKED_LINKS, [...checkedLinks, link]);
	console.log(`${link} saved to storage`);
};

module.exports = {
	getBannedAreas,
	banArea,
	saveChatId,
	getChatId,
	getCheckedLinks,
	saveLink,
};
