const router = require('express').Router();
const ctrl = require('../controllers/teacher.controller');
const auth = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');

router.get('/', auth, ctrl.getAll);
router.get('/:id', auth, ctrl.getById);
router.post('/', auth, roleGuard('coordinador'), ctrl.create);
router.put('/:id', auth, roleGuard('coordinador'), ctrl.update);
router.delete('/:id', auth, roleGuard('coordinador'), ctrl.delete);

module.exports = router;
