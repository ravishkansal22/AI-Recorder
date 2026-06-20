const { chromium } = require("playwright");

let browser;
let page;

async function launchBrowser(url) {

    browser = await chromium.launch({
        headless: false
    });

    page = await browser.newPage();

    await page.goto(url);

    return page;
}

function getPage() {
    return page;
}

module.exports = {
    launchBrowser,
    getPage
};