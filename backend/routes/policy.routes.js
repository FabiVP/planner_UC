const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');
const ctrl = require('../controllers/policy.controller');

router.use(auth);

router.get('/active', ctrl.getActive);
router.get('/', ctrl.getAll);
router.post('/', roleGuard('coordinador', 'admin'), ctrl.create);
router.put('/:id', roleGuard('coordinador', 'admin'), ctrl.update);
router.delete('/:id', roleGuard('coordinador', 'admin'), ctrl.delete);

module.exports = router;