/* eslint-disable no-undef */
const puppeteer = require("puppeteer");
const storage = require("./storage");

const URL_SEARCH_RESULTS =
	"https://asunnot.oikotie.fi/vuokra-asunnot?pagination=1&locations=%5B%5B64,6,%22Helsinki%22%5D,%5B39,6,%22Espoo%22%5D%5D&price%5Bmax%5D=1000&cardType=101";

const USER_AGENT =
	"Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:105.0) Gecko/20100101 Firefox/105.0";

const APARTMENT_INFO_TITLE_FLOOR = "Kerros";
const APARTMENT_INFO_TITLE_CITY_AREA = "Kaupunginosa";

//

const openPage = async (browser, url) => {
	const page = await browser.newPage();
	await page.setUserAgent(USER_AGENT);
	await page.goto(url, {
		timeout: 10000,
		waitUntil: "domcontentloaded",
	});

	return page;
};

const launchPuppeteer = async () => {
	const env = process.env.NODE_ENV || "development";
	const args =
		env === "production"
			? ["--no-sandbox", "--disable-setuid-sandbox"]
			: [];
	return await puppeteer.launch({
		args,
	});
};

const getSearchResultLinks = async () => {
	console.log("Fetching search result links 🔗");

	const browser = await puppeteer.launch({
		args: ["--no-sandbox", "--disable-setuid-sandbox"],
	});

	const page = await openPage(browser, URL_SEARCH_RESULTS);
	await page.waitForSelector(".cards");

	// console.log doesn't work inside page.evaluate(), since it runs the code inside the browser!!
	// Variables also need to be passed as arguments, which I'm not doing since it just makes it more complicated
	// Another option is to use `page.$$eval` but it's not as fast
	const results = await page.evaluate(() =>
		Array.from(
			document.querySelectorAll(".cards .cards__card card ng-include a"),
			(e) => e.href
		)
	);

	browser.close();
	return results;
};

/**
 * Returns true if:
 * Apartment is on the top floor
 * Apartment is NOT in banned section
 */
const filterApartment = async (url) => {
	console.log("Checking " + url);

	const browser = await puppeteer.launch({
		args: ["--no-sandbox", "--disable-setuid-sandbox"],
	});

	const page = await openPage(browser, url);
	await page.waitForSelector(".info-table");

	// console.log doesn't work inside page.evaluate(), since it runs the code inside the browser!!
	// Variables also need to be passed as arguments, which I'm not doing since it just makes it more complicated
	// Another option is to use `page.$$eval` but it's not as fast
	const apartmentInfo = await page.evaluate(() =>
		Array.from(
			document.querySelectorAll(".info-table .info-table__row"),
			(e) => {
				const title = e.querySelector(".info-table__title").textContent;
				const value = e.querySelector(".info-table__value").textContent;
				return { title, value };
			}
		)
	);

	browser.close();

	const validApartment =
		isTopFloorApartment(apartmentInfo) &&
		!(await isBannedArea(apartmentInfo));
	await storage.saveLink(url);

	return validApartment;
};

const isTopFloorApartment = (apartmentInfo) => {
	const floorValue = apartmentInfo.find(
		(info) => info.title === APARTMENT_INFO_TITLE_FLOOR
	)?.value;

	// If floor value is not found,
	// just return true since we don't
	// want to miss potential apartments
	if (floorValue === null || floorValue === undefined) {
		return true;
	}

	const [floor, max] = floorValue.split(" / ");
	return floor === max;
};

const isBannedArea = async (apartmentInfo) => {
	const bannedAreas = await storage.getBannedAreas();
	const cityArea = apartmentInfo.find(
		(info) => info.title === APARTMENT_INFO_TITLE_CITY_AREA
	)?.value;

	const banned = bannedAreas.includes(cityArea.toLowerCase());
	if (banned) {
		console.log("Top floor apartment found but is in banned area 🤖");
	}

	return banned;
};

module.exports = { getSearchResultLinks, filterApartment };
