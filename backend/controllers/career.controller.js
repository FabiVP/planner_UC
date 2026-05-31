const Career = require('../models/Career');
const Course = require('../models/Course');
const Teacher = require('../models/Teacher');

/**
 * GET /api/careers
 * Listar todas las carreras con conteo de cursos
 */
exports.getAll = async (req, res, next) => {
  try {
    const careers = await Career.find().sort({ name: 1 });

    // Enrich with course counts
    const enriched = await Promise.all(careers.map(async (career) => {
      const courseCount = await Course.countDocuments({ career: career._id, active: true });
      return { ...career.toObject(), courseCount };
    }));

    res.json({ count: enriched.length, careers: enriched });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/careers/:id
 * Obtener carrera con sus cursos
 */
exports.getById = async (req, res, next) => {
  try {
    const career = await Career.findById(req.params.id);
    if (!career) return res.status(404).json({ message: 'Carrera no encontrada.' });

    const courses = await Course.find({ career: career._id, active: true })
      .sort({ semester: 1, name: 1 });

    res.json({ career, courses });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/careers
 * Crear nueva carrera
 */
exports.create = async (req, res, next) => {
  try {
    const career = await Career.create(req.body);
    res.status(201).json({ message: 'Carrera creada exitosamente.', career });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Ya existe una carrera con ese código.' });
    }
    next(error);
  }
};

/**
 * PUT /api/careers/:id
 * Actualizar carrera
 */
exports.update = async (req, res, next) => {
  try {
    const career = await Career.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!career) return res.status(404).json({ message: 'Carrera no encontrada.' });
    res.json({ message: 'Carrera actualizada.', career });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/careers/:id
 * Eliminar carrera
 */
exports.remove = async (req, res, next) => {
  try {
    const career = await Career.findByIdAndDelete(req.params.id);
    if (!career) return res.status(404).json({ message: 'Carrera no encontrada.' });
    res.json({ message: 'Carrera eliminada.' });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/careers/:id/demand
 * Calcular demanda de docentes por carrera:
 * - Para cada curso activo de la carrera, cuántas sesiones semanales necesita
 * - Cuántos docentes especializados existen para ese curso
 * - Si hay déficit o superávit de docentes
 * - Cuántas secciones (grupos) se necesitan según maxStudents y demanda estimada
 */
exports.getDemand = async (req, res, next) => {
  try {
    const career = await Career.findById(req.params.id);
    if (!career) return res.status(404).json({ message: 'Carrera no encontrada.' });

    const courses = await Course.find({ career: career._id, active: true })
      .sort({ semester: 1, name: 1 });

    const allTeachers = await Teacher.find({ active: true }).populate('specializations');

    const demand = courses.map(course => {
      // Find teachers who can teach this course
      const qualifiedTeachers = allTeachers.filter(t =>
        t.specializations && t.specializations.some(s => {
          const specId = s._id ? s._id.toString() : s.toString();
          return specId === course._id.toString();
        })
      );

      // Estimate sections needed (based on average 30 students per section)
      const estimatedStudents = 30;
      const sectionsNeeded = Math.max(1, Math.ceil(estimatedStudents / (course.maxStudents || 40)));

      // Total sessions = sections × sessionsPerWeek
      const totalSessionsNeeded = sectionsNeeded * (course.sessionsPerWeek || 2);

      // Max sessions a teacher can give per week (assuming 5 days × 3 sessions = 15 max, but capped by maxCourses)
      const teachersNeeded = Math.max(1, sectionsNeeded);

      const deficit = teachersNeeded - qualifiedTeachers.length;

      return {
        courseId: course._id,
        courseCode: course.code,
        courseName: course.name,
        semester: course.semester,
        credits: course.credits,
        type: course.type,
        sessionsPerWeek: course.sessionsPerWeek || 2,
        hoursPerSession: course.hoursPerSession || 1,
        maxStudents: course.maxStudents || 40,
        sectionsNeeded,
        totalSessionsNeeded,
        teachersNeeded,
        qualifiedTeachersCount: qualifiedTeachers.length,
        qualifiedTeachers: qualifiedTeachers.map(t => ({
          _id: t._id,
          name: t.name,
          maxCourses: t.maxCourses,
          preferredShift: t.preferredShift
        })),
        deficit,
        status: deficit > 0 ? 'deficit' : deficit === 0 ? 'exacto' : 'cubierto'
      };
    });

    // Summary per semester
    const bySemester = {};
    for (const d of demand) {
      if (!bySemester[d.semester]) {
        bySemester[d.semester] = { courses: 0, totalTeachersNeeded: 0, totalTeachersAvailable: 0, totalSessions: 0 };
      }
      bySemester[d.semester].courses++;
      bySemester[d.semester].totalTeachersNeeded += d.teachersNeeded;
      bySemester[d.semester].totalTeachersAvailable += d.qualifiedTeachersCount;
      bySemester[d.semester].totalSessions += d.totalSessionsNeeded;
    }

    const totalTeachersNeeded = demand.reduce((sum, d) => sum + d.teachersNeeded, 0);
    const totalDeficit = demand.filter(d => d.deficit > 0).reduce((sum, d) => sum + d.deficit, 0);
    const coursesWithDeficit = demand.filter(d => d.deficit > 0).length;
    const coursesCovered = demand.filter(d => d.deficit <= 0).length;

    res.json({
      career: career.toObject(),
      totalCourses: courses.length,
      totalTeachersNeeded,
      totalDeficit,
      coursesWithDeficit,
      coursesCovered,
      bySemester,
      demand
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/careers/summary/all
 * Resumen de demanda de todas las carreras
 */
exports.getSummaryAll = async (req, res, next) => {
  try {
    const careers = await Career.find({ active: true }).sort({ name: 1 });
    const allTeachers = await Teacher.find({ active: true }).populate('specializations');

    const summary = await Promise.all(careers.map(async (career) => {
      const courses = await Course.find({ career: career._id, active: true });

      let totalTeachersNeeded = 0;
      let totalDeficit = 0;
      let coursesWithDeficit = 0;

      for (const course of courses) {
        const qualifiedTeachers = allTeachers.filter(t =>
          t.specializations && t.specializations.some(s => {
            const specId = s._id ? s._id.toString() : s.toString();
            return specId === course._id.toString();
          })
        );
        const sectionsNeeded = Math.max(1, Math.ceil(30 / (course.maxStudents || 40)));
        const teachersNeeded = Math.max(1, sectionsNeeded);
        totalTeachersNeeded += teachersNeeded;
        const deficit = teachersNeeded - qualifiedTeachers.length;
        if (deficit > 0) {
          totalDeficit += deficit;
          coursesWithDeficit++;
        }
      }

      return {
        _id: career._id,
        code: career.code,
        name: career.name,
        faculty: career.faculty,
        totalCourses: courses.length,
        totalTeachersNeeded,
        totalDeficit,
        coursesWithDeficit,
        status: totalDeficit > 0 ? 'deficit' : 'cubierto'
      };
    }));

    res.json({
      totalCareers: summary.length,
      totalUniqueTeachers: allTeachers.length,
      summary
    });
  } catch (error) {
    next(error);
  }
};
