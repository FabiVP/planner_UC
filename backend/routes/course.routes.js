const router = require('express').Router();
const { body } = require('express-validator');
const ctrl = require('../controllers/course.controller');
const auth = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');

const validateCourse = [
  body('code').trim().notEmpty().withMessage('El código del curso es requerido'),
  body('name').trim().notEmpty().withMessage('El nombre del curso es requerido'),
  body('credits').isInt({ min: 1, max: 10 }).withMessage('Los créditos deben ser entre 1 y 10'),
  body('type').isIn(['teorico', 'laboratorio']).withMessage('Tipo debe ser teorico o laboratorio'),
];

router.get('/', auth, ctrl.getAll);
router.get('/:id', auth, ctrl.getById);
router.post('/', auth, roleGuard('coordinador'), validateCourse, ctrl.create);
router.put('/:id', auth, roleGuard('coordinador'), validateCourse, ctrl.update);
router.delete('/:id', auth, roleGuard('coordinador'), ctrl.delete);

module.exports = router;
