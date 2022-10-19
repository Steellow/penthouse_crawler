const storage = require("node-persist");

const STORAGE_KEY_BANNED_AREA = "banned_areas";

const getBannedAreas = async () => {
    await storage.init();
    return storage.getItem(STORAGE_KEY_BANNED_AREA) || [];
};

module.exports = { getBannedAreas };
