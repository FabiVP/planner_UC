const router = require('express').Router();
const auth = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');
const ctrl = require('../controllers/campus.controller');

router.use(auth);

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', roleGuard('coordinador'), ctrl.create);
router.put('/:id', roleGuard('coordinador'), ctrl.update);
router.delete('/:id', roleGuard('coordinador'), ctrl.remove);

module.exports = router;
