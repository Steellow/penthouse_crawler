const puppeteer = require("puppeteer");

const URL =
    "https://asunnot.oikotie.fi/vuokra-asunnot?pagination=1&locations=%5B%5B64,6,%22Helsinki%22%5D,%5B39,6,%22Espoo%22%5D%5D&price%5Bmax%5D=1001&size%5Bmin%5D=35&size%5Bmax%5D=60&cardType=101";

const USER_AGENT =
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:105.0) Gecko/20100101 Firefox/105.0";

const RESULTS_LINK_SELECTOR = ".cards .cards__card card ng-include a";

const getPage = async (browser) => {
    const page = await browser.newPage();
    await page.setUserAgent(USER_AGENT);

    return page;
};

/**
 * @returns Array of links to each apartment from the 1st result page
 */
async function getLinkList() {
    const browser = await puppeteer.launch();
    const page = await getPage(browser);

    await page.goto(URL, { timeout: 10000, waitUntil: "domcontentloaded" });
    await page.waitForSelector(".cards");

    const results = await page.$$eval(RESULTS_LINK_SELECTOR, (el) =>
        el.map((e) => e.href)
    );

    browser.close();

    return results;
}

// For testing
getLinkList();
