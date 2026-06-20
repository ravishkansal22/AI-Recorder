const express = require('express');
const router = express.Router();
const recorderController = require('../controllers/recorderController');

router.post('/start', recorderController.start);
router.post('/stop', recorderController.stop);
router.get('/status', recorderController.status);

module.exports = router;