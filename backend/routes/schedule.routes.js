const router = require('express').Router();
const ctrl = require('../controllers/schedule.controller');
const auth = require('../middleware/auth');

router.get('/', auth, ctrl.getAll);
router.get('/:id', auth, ctrl.getById);
router.get('/generation/:generationId', auth, ctrl.getByGeneration);

module.exports = router;
