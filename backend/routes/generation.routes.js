const router = require('express').Router();
const ctrl = require('../controllers/generation.controller');
const auth = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');

router.get('/', auth, ctrl.getAll);
router.get('/:id', auth, ctrl.getById);
router.post('/generate', auth, ctrl.generate);
router.post('/:id/restore', auth, ctrl.restore);
router.delete('/:id', auth, ctrl.remove);

// ✅ RUTA PÚBLICA PARA PRUEBAS (sin autenticación)
router.post('/test/generate', ctrl.generatePublic);
module.exports = router;
