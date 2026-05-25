const router = require('express').Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/profile.controller');

router.use(auth);

router.get('/', ctrl.getProfile);
router.put('/', ctrl.updateProfile);
router.put('/password', ctrl.changePassword);

module.exports = router;
