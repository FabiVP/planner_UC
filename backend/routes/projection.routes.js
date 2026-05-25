const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/projection.controller');

router.use(auth);

router.get('/summary/all', ctrl.getSummaryAll);
router.get('/:careerId', ctrl.getProjection);

module.exports = router;
