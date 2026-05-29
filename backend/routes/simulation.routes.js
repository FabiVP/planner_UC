const router = require('express').Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/simulation.controller');

// All simulation routes require authentication
router.use(auth);

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.put('/:id/star', ctrl.toggleStar);
router.delete('/:id', ctrl.remove);
router.post('/compare', ctrl.compare);

module.exports = router;
