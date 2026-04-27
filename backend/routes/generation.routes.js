const router = require('express').Router();
const ctrl = require('../controllers/generation.controller');
const auth = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');

router.get('/', auth, ctrl.getAll);
router.get('/:id', auth, ctrl.getById);
router.post('/generate', auth, roleGuard('coordinador'), ctrl.generate);

module.exports = router;
