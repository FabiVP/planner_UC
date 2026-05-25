const router = require('express').Router();
const protect = require('../middleware/auth');
const ctrl = require('../controllers/career-generation.controller');

// Career-based generation (admin)
router.post('/generations/career', protect, ctrl.generateByCareer);

// Section management
router.get('/sections', protect, ctrl.getSections);
router.get('/sections/student-available', protect, ctrl.getStudentSections);
router.post('/sections/enroll', protect, ctrl.enrollInSections);
router.post('/sections/suggest', protect, ctrl.suggestSchedule);
router.get('/sections/pending-review', protect, ctrl.getPendingReview);
router.post('/sections/merge', protect, ctrl.mergeSections);

module.exports = router;
