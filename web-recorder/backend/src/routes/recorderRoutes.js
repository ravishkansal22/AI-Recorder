const express = require('express');
const router = express.Router();
const recorderController = require('../controllers/recorderController');

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