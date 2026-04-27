const router = require('express').Router();
const ctrl = require('../controllers/enrollment.controller');
const auth = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');

router.get('/', auth, ctrl.getAll);
router.post('/', auth, roleGuard('coordinador'), ctrl.create);
router.post('/validate', auth, ctrl.validate);
router.delete('/:id', auth, roleGuard('coordinador'), ctrl.delete);

module.exports = router;
