const express = require("express");

const router = express.Router();

const {
    launch,
    getEvents,
    generatePlaywrightCode,
    generateSeleniumCode
} = require("../controllers/recorderController");

router.post(
    "/launch",
    launch
);

router.get(
    "/events",
    getEvents
);

router.get(
    "/code/playwright",
    generatePlaywrightCode
);

router.get(
    "/code/selenium",
    generateSeleniumCode
);

module.exports = router;