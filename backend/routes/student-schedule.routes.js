const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/student-schedule.controller');

router.use(auth);

router.get('/eligible-courses', ctrl.getEligibleCourses);
router.post('/validate', ctrl.validateSelection);
router.post('/generate', ctrl.generateStudentSchedule);
router.post('/course-availability', ctrl.getCourseAvailability);
router.get('/my-schedule', ctrl.getMySchedule);

module.exports = router;
