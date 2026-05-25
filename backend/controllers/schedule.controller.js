const Schedule = require('../models/Schedule');
const Teacher = require('../models/Teacher');
const Generation = require('../models/Generation');

exports.getAll = async (req, res, next) => {
  try {
    const schedules = await Schedule.find()
      .populate('generationId', 'name semester status qualityScore')
      .populate('assignments.courseId', 'code name credits type')
      .populate('assignments.teacherId', 'name')
      .populate('assignments.classroomId', 'code name type capacity')
      .sort({ createdAt: -1 });
    res.json({ count: schedules.length, schedules });
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const schedule = await Schedule.findById(req.params.id)
      .populate('generationId', 'name semester status qualityScore constraintsFulfilled preferencesScore resourceUsage')
      .populate('assignments.courseId', 'code name credits type semester')
      .populate('assignments.teacherId', 'name email')
      .populate('assignments.classroomId', 'code name type capacity building');
    if (!schedule) return res.status(404).json({ message: 'Horario no encontrado.' });
    res.json(schedule);
  } catch (error) {
    next(error);
  }
};

exports.getByGeneration = async (req, res, next) => {
  try {
    const schedule = await Schedule.findOne({ generationId: req.params.generationId })
      .populate('assignments.courseId', 'code name credits type semester')
      .populate('assignments.teacherId', 'name')
      .populate('assignments.classroomId', 'code name type capacity');
    if (!schedule) return res.status(404).json({ message: 'Horario no encontrado para esta generación.' });
    res.json(schedule);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/schedule/my-teaching
 * Devuelve SOLO las asignaciones del docente logueado
 * del horario institucional más reciente.
 */
exports.getMyTeaching = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Find teacher by userId
    const teacher = await Teacher.findOne({ userId });
    if (!teacher) {
      return res.status(404).json({ message: 'Perfil de docente no encontrado.' });
    }

    // Get latest completed generation
    const latestGen = await Generation.findOne({ status: 'completada' })
      .sort({ createdAt: -1 });

    if (!latestGen || !latestGen.scheduleId) {
      return res.json({
        teacher: { name: teacher.name },
        assignments: [],
        message: 'No hay horario institucional generado aún.'
      });
    }

    // Load schedule
    const schedule = await Schedule.findById(latestGen.scheduleId)
      .populate('assignments.courseId', 'code name credits type semester')
      .populate('assignments.teacherId', 'name email')
      .populate('assignments.classroomId', 'code name type capacity building');

    if (!schedule) {
      return res.json({
        teacher: { name: teacher.name },
        assignments: [],
        message: 'Horario no encontrado.'
      });
    }

    // Filter assignments for this teacher
    const myAssignments = schedule.assignments.filter(a =>
      a.teacherId?._id?.toString() === teacher._id.toString()
    );

    // Calculate stats
    const uniqueCourses = new Set(myAssignments.map(a =>
      a.courseId?._id?.toString()
    ));
    const daysUsed = new Set(myAssignments.map(a => a.day));
    const totalHours = myAssignments.length; // Each assignment = 1 hour slot

    res.json({
      teacher: {
        name: teacher.name,
        email: teacher.email,
        contractType: teacher.contractType,
        maxCourses: teacher.maxCourses,
        maxWeeklyHours: teacher.maxWeeklyHours
      },
      generationName: latestGen.name,
      semester: schedule.semester,
      assignments: myAssignments,
      stats: {
        totalCourses: uniqueCourses.size,
        totalSessions: myAssignments.length,
        totalHours,
        daysUsed: daysUsed.size,
        loadPercent: teacher.maxWeeklyHours
          ? Math.round((totalHours / teacher.maxWeeklyHours) * 100)
          : 0
      }
    });
  } catch (error) {
    next(error);
  }
};

