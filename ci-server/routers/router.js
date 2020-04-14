const express = require('express');
const router = express.Router();

router.get('/notify-agent');
router.get('/notify-build-result');

module.exports = router;