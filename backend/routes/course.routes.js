const router = require('express').Router();
const { body } = require('express-validator');
const ctrl = require('../controllers/course.controller');
const auth = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');
const { cacheMiddleware, invalidateCacheByPrefix } = require('../middleware/cache');

const validateCourse = [
  body('code').trim().notEmpty().withMessage('El código del curso es requerido'),
  body('name').trim().notEmpty().withMessage('El nombre del curso es requerido'),
  body('credits').isInt({ min: 1, max: 10 }).withMessage('Los créditos deben ser entre 1 y 10'),
  body('type').isIn(['teorico', 'laboratorio']).withMessage('Tipo debe ser teorico o laboratorio'),
];

router.get('/', auth, cacheMiddleware('cursos'), ctrl.getAll);
router.get('/:id', auth, ctrl.getById);
router.post('/', auth, roleGuard('coordinador'), validateCourse, (req, res, next) => {
  invalidateCacheByPrefix('cursos');
  next();
}, ctrl.create);
router.put('/:id', auth, roleGuard('coordinador'), validateCourse, (req, res, next) => {
  invalidateCacheByPrefix('cursos');
  next();
}, ctrl.update);
router.delete('/:id', auth, roleGuard('coordinador'), (req, res, next) => {
  invalidateCacheByPrefix('cursos');
  next();
}, ctrl.delete);

module.exports = router;
