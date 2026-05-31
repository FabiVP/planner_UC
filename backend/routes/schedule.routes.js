const router = require('express').Router();
const ctrl = require('../controllers/schedule.controller');
const auth = require('../middleware/auth');

router.get('/', auth, ctrl.getAll);
router.get('/my-teaching', auth, ctrl.getMyTeaching);
router.get('/generation/:generationId', auth, ctrl.getByGeneration);
router.get('/:id', auth, ctrl.getById);

module.exports = router;
