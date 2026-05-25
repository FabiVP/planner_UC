const router = require('express').Router();
const ctrl = require('../controllers/career.controller');
const auth = require('../middleware/auth');

// Summary of all careers (must be before /:id routes)
router.get('/summary/all', auth, ctrl.getSummaryAll);

// CRUD
router.get('/', auth, ctrl.getAll);
router.get('/:id', auth, ctrl.getById);
router.post('/', auth, ctrl.create);
router.put('/:id', auth, ctrl.update);
router.delete('/:id', auth, ctrl.remove);

// Demand analysis per career
router.get('/:id/demand', auth, ctrl.getDemand);

module.exports = router;
