const {
    getPage
} = require("../services/browserService");

async function fetchEvents() {

    const page = getPage();

    if (!page) {
        return [];
    }

    try {

        const events = await page.evaluate(() => {

            if (!window.__events) {
                return [];
            }

            const recorded = [...window.__events];

            window.__events = [];

            return recorded;
        });

        return events;

    } catch (error) {

        console.error(error);

        return [];
    }
}

module.exports = {
    fetchEvents
};