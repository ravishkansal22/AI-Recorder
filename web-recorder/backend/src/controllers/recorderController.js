const {
    launchBrowser
} = require("../services/browserService");

const {
    addEvents,
    getEvents: getStoredEvents,
    clearEvents
} = require("../services/recordingService");

const {
    fetchEvents
} = require("../recorder/eventCapture");

const {
    generatePlaywright
} = require("../generators/playwrightGenerator");

async function launch(req, res) {

    try {

        const { url } = req.body;

        if (!url) {

            return res.status(400).json({
                error: "URL is required"
            });

        }

        await launchBrowser(url);

        clearEvents();

        res.json({
            success: true,
            message: "Browser launched"
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }
}

async function getEvents(req, res) {

    try {

        const newEvents = await fetchEvents();

        addEvents(newEvents);

        res.json(getStoredEvents());

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }
}

function generatePlaywrightCode(req, res) {

    try {

        const code = generatePlaywright(
            getStoredEvents()
        );

        res.json({
            framework: "playwright",
            code
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }
}

function generateSeleniumCode(req, res) {

    try {

        const events = getStoredEvents();

        let code = `
from selenium import webdriver
from selenium.webdriver.common.by import By

driver = webdriver.Chrome()

`;

        events.forEach(event => {

            if (event.type === "click") {

                code += `
driver.find_element(By.CSS_SELECTOR, "${event.selector}").click()
`;

            }

            if (event.type === "input") {

                code += `
driver.find_element(By.CSS_SELECTOR, "${event.selector}").send_keys("${event.value}")
`;

            }

        });

        res.json({
            framework: "selenium",
            code
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }
}

module.exports = {
    launch,
    getEvents,
    generatePlaywrightCode,
    generateSeleniumCode
};