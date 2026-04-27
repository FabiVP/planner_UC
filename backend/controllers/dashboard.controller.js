const Course = require('../models/Course');
const Teacher = require('../models/Teacher');
const Classroom = require('../models/Classroom');
const Student = require('../models/Student');
const Generation = require('../models/Generation');
const Enrollment = require('../models/Enrollment');

exports.getStats = async (req, res, next) => {
  try {
    const [
      totalCourses,
      activeCourses,
      totalTeachers,
      teachersWithRestrictions,
      totalClassrooms,
      availableClassrooms,
      maintenanceClassrooms,
      totalStudents,
      totalGenerations,
      successfulGenerations,
      recentGenerations
    ] = await Promise.all([
      Course.countDocuments(),
      Course.countDocuments({ active: true }),
      Teacher.countDocuments({ active: true }),
      Teacher.countDocuments({ active: true, 'availability.0': { $exists: true } }),
      Classroom.countDocuments(),
      Classroom.countDocuments({ available: true }),
      Classroom.countDocuments({ available: false }),
      Student.countDocuments({ active: true }),
      Generation.countDocuments(),
      Generation.countDocuments({ status: 'completada' }),
      Generation.find().sort({ createdAt: -1 }).limit(5).populate('createdBy', 'name')
    ]);

    // Count new courses this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const newCoursesThisWeek = await Course.countDocuments({ createdAt: { $gte: oneWeekAgo } });

    // Count this month's generations
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const generationsThisMonth = await Generation.countDocuments({ createdAt: { $gte: oneMonthAgo } });
    const successfulThisWeek = await Generation.countDocuments({ 
      createdAt: { $gte: oneWeekAgo }, 
      status: 'completada' 
    });

    // Alerts
    const alerts = [];
    const teachersNoAvailability = await Teacher.countDocuments({ active: true, availability: { $size: 0 } });
    if (teachersNoAvailability > 0) {
      alerts.push({ type: 'warning', icon: 'teacher', message: `${teachersNoAvailability} docentes tienen conflictos de disponibilidad` });
    }
    if (maintenanceClassrooms > 0) {
      alerts.push({ type: 'warning', icon: 'classroom', message: `${maintenanceClassrooms} aulas no disponibles en el rango de horarios` });
    }
    const coursesNoPrereqs = await Course.countDocuments({ active: true, prerequisites: { $size: 0 }, semester: { $gt: 1 } });
    if (coursesNoPrereqs > 0) {
      alerts.push({ type: 'info', icon: 'course', message: `${coursesNoPrereqs} asignaturas sin preferencias de horario` });
    }
    if (successfulGenerations > 0) {
      alerts.push({ type: 'success', icon: 'check', message: 'Generación completada exitosamente' });
    }

    res.json({
      stats: {
        courses: { total: totalCourses, active: activeCourses, newThisWeek: newCoursesThisWeek },
        teachers: { total: totalTeachers, withRestrictions: teachersWithRestrictions },
        classrooms: { total: totalClassrooms, available: availableClassrooms, maintenance: maintenanceClassrooms },
        students: { total: totalStudents },
        generations: { 
          total: totalGenerations, 
          successful: successfulGenerations, 
          thisMonth: generationsThisMonth,
          successfulThisWeek 
        }
      },
      recentGenerations,
      alerts
    });
  } catch (error) {
    next(error);
  }
};
