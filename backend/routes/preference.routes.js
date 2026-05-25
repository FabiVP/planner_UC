const router = require('express').Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/preference.controller');

// Todas las rutas requieren autenticación
router.use(auth);

router.get('/', ctrl.getMyPreferences);
router.put('/', ctrl.updateMyPreferences);
router.get('/availability/teachers', ctrl.getTeacherAvailability);
router.get('/availability/students', ctrl.getStudentAvailability);

module.exports = router;
