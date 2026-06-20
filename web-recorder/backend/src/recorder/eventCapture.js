const { getPage } = require("../services/browserService");

async function getRecordedEvents() {

    const page = getPage();

    if (!page) return [];

    const events = await page.evaluate(() => {

        const data = [...window.__events];

        window.__events = [];

        return data;
    });

    return events;
}

module.exports = {
    getRecordedEvents
};