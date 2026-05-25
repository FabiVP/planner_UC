const Course = require('../models/Course');
const Student = require('../models/Student');
const Classroom = require('../models/Classroom');
const Teacher = require('../models/Teacher');
const Career = require('../models/Career');
const Enrollment = require('../models/Enrollment');

/**
 * GET /api/projections/:careerId
 * Proyección académica para una carrera específica.
 * Estima cuántos alumnos pasarán al siguiente semestre,
 * calcula secciones necesarias, aulas requeridas y horas docentes.
 */
exports.getProjection = async (req, res, next) => {
  try {
    const { careerId } = req.params;
    const { passRate = 75, growthRate = 5 } = req.query;

    const career = await Career.findById(careerId);
    if (!career) return res.status(404).json({ message: 'Carrera no encontrada.' });

    // Get all active courses for this career, sorted by semester
    const courses = await Course.find({ career: careerId, active: true })
      .sort({ semester: 1, name: 1 });

    // Count current students by semester
    const students = await Student.find({ active: true });
    const studentsBySemester = {};
    for (const s of students) {
      const sem = s.currentSemester || 1;
      studentsBySemester[sem] = (studentsBySemester[sem] || 0) + 1;
    }

    // Get available classrooms
    const classrooms = await Classroom.find({ available: true });
    const totalClassroomCapacity = classrooms.reduce((sum, c) => sum + c.capacity, 0);
    const classroomsByType = {
      teorico: classrooms.filter(c => c.type === 'teorico'),
      laboratorio: classrooms.filter(c => c.type === 'laboratorio'),
      aula_virtual: classrooms.filter(c => c.type === 'aula_virtual')
    };

    // Get active teachers
    const teachers = await Teacher.find({ active: true });

    const rate = Math.min(100, Math.max(0, Number(passRate))) / 100;
    const growth = Number(growthRate) / 100;

    // Build projection per semester
    const projection = [];
    const maxSemester = Math.max(...courses.map(c => c.semester), 1);

    for (let sem = 1; sem <= maxSemester; sem++) {
      const semCourses = courses.filter(c => c.semester === sem);
      if (semCourses.length === 0) continue;

      // Estimate students for this semester
      let currentStudents = studentsBySemester[sem] || 0;
      let projectedStudents;

      if (sem === 1) {
        // Semester 1: current + growth for new intake
        projectedStudents = Math.max(currentStudents, 30);
        projectedStudents = Math.ceil(projectedStudents * (1 + growth));
      } else {
        // Subsequent semesters: students from previous semester × pass rate
        const prevStudents = studentsBySemester[sem - 1] || currentStudents || 30;
        projectedStudents = Math.ceil(prevStudents * rate);
      }

      // Calculate sections needed per course
      const coursesProjection = semCourses.map(course => {
        const maxPerSection = course.maxStudents || 40;
        const sectionsNeeded = Math.max(1, Math.ceil(projectedStudents / maxPerSection));
        const totalSessions = sectionsNeeded * (course.sessionsPerWeek || 2);
        const totalHours = totalSessions * (course.hoursPerSession || 1);

        // Required classroom type
        const requiredType = course.type || 'teorico';
        const availableOfType = classroomsByType[requiredType]?.length || 0;

        // Teachers needed (1 per section)
        const teachersNeeded = sectionsNeeded;

        return {
          courseId: course._id,
          code: course.code,
          name: course.name,
          type: course.type,
          credits: course.credits,
          maxStudents: maxPerSection,
          sessionsPerWeek: course.sessionsPerWeek || 2,
          hoursPerSession: course.hoursPerSession || 1,
          projectedStudents,
          sectionsNeeded,
          totalSessions,
          totalHours,
          requiredClassroomType: requiredType,
          classroomsAvailable: availableOfType,
          classroomSufficient: availableOfType >= sectionsNeeded,
          teachersNeeded
        };
      });

      // Semester totals
      const totalSections = coursesProjection.reduce((s, c) => s + c.sectionsNeeded, 0);
      const totalHours = coursesProjection.reduce((s, c) => s + c.totalHours, 0);
      const totalTeachersNeeded = coursesProjection.reduce((s, c) => s + c.teachersNeeded, 0);
      const classroomDeficit = coursesProjection.filter(c => !c.classroomSufficient).length;

      projection.push({
        semester: sem,
        currentStudents,
        projectedStudents,
        totalCourses: semCourses.length,
        totalSections,
        totalHours,
        totalTeachersNeeded,
        classroomDeficit,
        courses: coursesProjection
      });
    }

    // Global summary
    const totalProjectedStudents = projection.reduce((s, p) => s + p.projectedStudents, 0);
    const totalSectionsNeeded = projection.reduce((s, p) => s + p.totalSections, 0);
    const totalHoursNeeded = projection.reduce((s, p) => s + p.totalHours, 0);
    const totalTeachersRequired = projection.reduce((s, p) => s + p.totalTeachersNeeded, 0);
    const semestersWithClassroomDeficit = projection.filter(p => p.classroomDeficit > 0).length;

    res.json({
      career: career.toObject(),
      parameters: { passRate: rate * 100, growthRate: growth * 100 },
      summary: {
        totalProjectedStudents,
        totalSectionsNeeded,
        totalHoursNeeded,
        totalTeachersRequired,
        totalTeachersAvailable: teachers.length,
        teacherDeficit: Math.max(0, totalTeachersRequired - teachers.length),
        totalClassrooms: classrooms.length,
        totalClassroomCapacity,
        semestersWithClassroomDeficit
      },
      infrastructure: {
        classrooms: {
          teorico: classroomsByType.teorico.length,
          laboratorio: classroomsByType.laboratorio.length,
          aula_virtual: classroomsByType.aula_virtual.length
        },
        teachers: {
          total: teachers.length,
          fullTime: teachers.filter(t => t.contractType === 'tiempo_completo').length,
          partTime: teachers.filter(t => t.contractType === 'por_horas').length,
          weeklyHoursCapacity: teachers.reduce((s, t) => s + (t.maxWeeklyHours || 40), 0)
        }
      },
      projection
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/projections/summary/all
 * Proyección rápida de todas las carreras activas.
 */
exports.getSummaryAll = async (req, res, next) => {
  try {
    const careers = await Career.find({ active: true });
    const students = await Student.find({ active: true });
    const teachers = await Teacher.find({ active: true });
    const classrooms = await Classroom.find({ available: true });

    const passRate = 0.75;

    const summaries = await Promise.all(careers.map(async (career) => {
      const courses = await Course.find({ career: career._id, active: true });
      const careerStudents = students.filter(s =>
        s.career === career.name || s.career === career.code
      );

      let totalProjectedStudents = 0;
      let totalSections = 0;
      let totalHours = 0;

      const maxSem = Math.max(...courses.map(c => c.semester), 1);
      for (let sem = 1; sem <= maxSem; sem++) {
        const semCourses = courses.filter(c => c.semester === sem);
        const projStudents = sem === 1
          ? Math.max(careerStudents.filter(s => s.currentSemester === 1).length, 30)
          : Math.ceil(Math.max(careerStudents.filter(s => s.currentSemester === sem - 1).length, 20) * passRate);

        totalProjectedStudents += projStudents;

        for (const course of semCourses) {
          const sections = Math.max(1, Math.ceil(projStudents / (course.maxStudents || 40)));
          totalSections += sections;
          totalHours += sections * (course.sessionsPerWeek || 2) * (course.hoursPerSession || 1);
        }
      }

      return {
        _id: career._id,
        code: career.code,
        name: career.name,
        totalCourses: courses.length,
        totalProjectedStudents,
        totalSections,
        totalHours
      };
    }));

    res.json({
      totalCareers: summaries.length,
      totalTeachers: teachers.length,
      totalClassrooms: classrooms.length,
      summaries
    });
  } catch (error) {
    next(error);
  }
};
