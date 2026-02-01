const express = require('express');
const router = express.Router();
const fastingController = require('../controllers/fasting.controller');
const auth = require('../middleware/auth.middleware');

router.post('/start', auth, fastingController.startFast);
router.post('/end', auth, fastingController.endFast);
router.get('/status', auth, fastingController.getStatus);
router.get('/history', auth, fastingController.getHistory);

module.exports = router;
