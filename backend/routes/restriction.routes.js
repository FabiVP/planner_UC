const router = require('express').Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/restriction.controller');

router.use(auth);

router.get('/', ctrl.getAll);

module.exports = router;
