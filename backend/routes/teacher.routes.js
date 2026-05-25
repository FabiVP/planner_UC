const router = require('express').Router();
const { body } = require('express-validator');
const ctrl = require('../controllers/teacher.controller');
const auth = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');

const validateTeacher = [
  body('name').trim().notEmpty().withMessage('El nombre del docente es requerido'),
  body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
];

// ── Docente self-profile (must be before /:id to avoid route conflicts) ──
router.get('/my-profile', auth, ctrl.getMyProfile);
router.put('/my-profile', auth, ctrl.updateMyProfile);

// ── Admin overview (coordinador only) ──
router.get('/admin/overview', auth, roleGuard('coordinador'), ctrl.getAdminOverview);

// ── Standard CRUD ──
router.get('/', auth, ctrl.getAll);
router.get('/:id', auth, ctrl.getById);
router.post('/', auth, roleGuard('coordinador'), validateTeacher, ctrl.create);
router.put('/:id', auth, roleGuard('coordinador'), validateTeacher, ctrl.update);
router.delete('/:id', auth, roleGuard('coordinador'), ctrl.delete);

module.exports = router;

