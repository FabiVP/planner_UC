const router = require('express').Router();
const ctrl = require('../controllers/career.controller');
const auth = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');

// Summary of all careers (must be before /:id routes)
router.get('/summary/all', auth, ctrl.getSummaryAll);

// CRUD
router.get('/', auth, ctrl.getAll);
router.get('/:id', auth, ctrl.getById);
router.post('/', auth, roleGuard('coordinador', 'admin'), ctrl.create);
router.put('/:id', auth, roleGuard('coordinador', 'admin'), ctrl.update);
router.delete('/:id', auth, roleGuard('coordinador', 'admin'), ctrl.remove);

// Demand analysis per career
router.get('/:id/demand', auth, ctrl.getDemand);

module.exports = router;