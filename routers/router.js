const express = require('express');
const router = express.Router();

const controller = require('../controllers/controller');

router.get('/settings', controller.getSettings);
router.get('/builds', controller.getBuilds);
router.get('/builds/:buildId', controller.getBuildId);
router.get('/builds/:buildId/logs', controller.getLogs);

router.post('/builds/:commitHash', controller.postAddInstQueue);
router.post('/settings', controller.postSettings);

module.exports = router;