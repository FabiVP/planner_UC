const router = require('express').Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/notification.controller');

// Todas las rutas requieren autenticación
router.use(auth);

router.get('/', ctrl.getAll);
router.put('/read-all', ctrl.markAllAsRead);
router.put('/:id/read', ctrl.markAsRead);
router.delete('/:id', ctrl.deleteOne);

module.exports = router;
