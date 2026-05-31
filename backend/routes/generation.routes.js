const router = require('express').Router();
const ctrl = require('../controllers/generation.controller');
const auth = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');
const rateLimit = require('express-rate-limit');

// Rate limiter for the public test endpoint (no auth)
const publicTestLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,               // max 5 requests per minute
  message: { error: 'Demasiadas solicitudes. Intente de nuevo en un minuto.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.get('/', auth, ctrl.getAll);
router.get('/:id', auth, ctrl.getById);
router.post('/generate', auth, ctrl.generate);
router.post('/:id/restore', auth, ctrl.restore);
router.delete('/:id', auth, ctrl.remove);

// ✅ RUTA PÚBLICA PARA PRUEBAS (sin autenticación, con rate limiting)
router.post('/test/generate', publicTestLimiter, ctrl.generatePublic);
module.exports = router;
