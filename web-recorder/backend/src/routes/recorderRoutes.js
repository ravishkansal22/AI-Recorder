const express = require("express");

const router = express.Router();

const {
    launch,
    startRecording,
    getRecordedEvents,
    getPlaywrightCode
} = require("../controllers/recorderController");

router.post("/launch", launch);

router.post(
    "/start-recording",
    startRecording
);

router.get(
    "/events",
    getRecordedEvents
);

router.get(
    "/playwright-code",
    getPlaywrightCode
);

module.exports = router;