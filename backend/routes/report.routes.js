const router = require('express').Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/report.controller');

router.use(auth);

router.get('/summary', ctrl.getSummary);
router.get('/export/excel', ctrl.exportExcel);
module.exports = router;
