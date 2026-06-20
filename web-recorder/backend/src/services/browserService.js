const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

let browser;
let page;

async function launchBrowser(url) {

    browser = await chromium.launch({
        headless: false
    });

    page = await browser.newPage();

    // Load recorder script
    const recorderScript = fs.readFileSync(
        path.join(__dirname, "../recorder/recorderScript.js"),
        "utf8"
    );

    await page.addInitScript(recorderScript);

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