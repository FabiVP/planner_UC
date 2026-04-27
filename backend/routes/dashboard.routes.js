const router = require('express').Router();
const ctrl = require('../controllers/dashboard.controller');
const auth = require('../middleware/auth');

router.get('/stats', auth, ctrl.getStats);

module.exports = router;
