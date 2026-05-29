const Course = require('../models/Course');
const Student = require('../models/Student');
const Classroom = require('../models/Classroom');
const Teacher = require('../models/Teacher');
const Career = require('../models/Career');
const Enrollment = require('../models/Enrollment');

/**
 * Construye un mapa { studentId → Set<courseId> } de cursos aprobados (nota >= 11).
 */
const buildPassedMap = (students) => {
  const map = {};
  for (const s of students) {
    map[s._id.toString()] = new Set(
      (s.approvedCourses || [])
        .filter(ac => ac.grade != null && ac.grade >= 11)
        .map(ac => ac.courseId.toString())
    );
  }
  return map;
};

/**
 * Agrupa estudiantes por currentSemester.
 */
const groupBySemester = (students) => {
  const map = {};
  for (const s of students) {
    const sem = s.currentSemester || 1;
    if (!map[sem]) map[sem] = [];
    map[sem].push(s);
  }
  return map;
};

/**
 * GET /api/projections/:careerId
 * Proyección académica basada en datos históricos de alumnos.
 * 
 * Para semestre 1: aplica tasa de crecimiento sobre alumnos actuales.
 * Para semestres N > 1: cuenta alumnos que aprobaron TODOS los prerrequisitos
 * de los cursos del semestre (histórico). Si no hay prerrequisitos ni datos
 * históricos, usa la tasa de aprobación como fallback.
 */
exports.getProjection = async (req, res, next) => {
  try {
    const { careerId } = req.params;
    const { passRate = 75, growthRate = 5 } = req.query;

    const career = await Career.findById(careerId);
    if (!career) return res.status(404).json({ message: 'Carrera no encontrada.' });

    const courses = await Course.find({ career: careerId, active: true })
      .sort({ semester: 1, name: 1 })
      .populate('prerequisites', 'code name semester');

    const allStudents = await Student.find({ career: careerId, active: true });
    const studentsBySemester = groupBySemester(allStudents);
    const passedMap = buildPassedMap(allStudents);

    const classrooms = await Classroom.find({ available: true });
    const classroomsByType = {
      teorico: classrooms.filter(c => c.type === 'teorico'),
      laboratorio: classrooms.filter(c => c.type === 'laboratorio'),
      aula_virtual: classrooms.filter(c => c.type === 'aula_virtual')
    };

    const teachers = await Teacher.find({ active: true });

    const rate = Math.min(100, Math.max(0, Number(passRate))) / 100;
    const growth = Number(growthRate) / 100;

    const projection = [];
    const maxSemester = Math.max(...courses.map(c => c.semester), 1);
    const projectedBySem = {};

    for (let sem = 1; sem <= maxSemester; sem++) {
      const semCourses = courses.filter(c => c.semester === sem);
      if (semCourses.length === 0) continue;

      const currentStudents = studentsBySemester[sem]?.length || 0;
      let projectedStudents;
      let projectionBasis = 'rate';
      let eligibleStudentCount = 0;
      let prerequisiteCourseCodes = [];

      if (sem === 1) {
        // Semestre 1: alumnos actuales + crecimiento
        projectedStudents = Math.max(currentStudents, 30);
        projectedStudents = Math.ceil(projectedStudents * (1 + growth));
        projectionBasis = 'rate';
      } else {
        // Semestres N > 1: usar datos históricos de approvedCourses
        const prereqIds = new Set();
        const prereqCodes = new Set();
        for (const course of semCourses) {
          if (course.prerequisites && course.prerequisites.length > 0) {
            for (const prereq of course.prerequisites) {
              const pId = prereq._id ? prereq._id.toString() : prereq.toString();
              prereqIds.add(pId);
              prereqCodes.add((prereq.code || '?'));
            }
          }
        }

        prerequisiteCourseCodes = [...prereqCodes];

        if (prereqIds.size > 0 && allStudents.length > 0) {
          // Contar alumnos que aprobaron TODOS los prerrequisitos
          for (const s of allStudents) {
            const passed = passedMap[s._id.toString()] || new Set();
            let allPassed = true;
            for (const pId of prereqIds) {
              if (!passed.has(pId)) {
                allPassed = false;
                break;
              }
            }
            if (allPassed) eligibleStudentCount++;
          }
        }

        if (eligibleStudentCount > 0) {
          projectedStudents = eligibleStudentCount;
          projectionBasis = 'historical';
        } else {
          // Fallback: tasa de aprobación
          const prevProjected = projectedBySem[sem - 1]
            || Math.max(studentsBySemester[sem - 1]?.length || 20, 20);
          projectedStudents = Math.max(1, Math.ceil(prevProjected * rate));
          projectionBasis = 'rate';
        }
      }

      projectedBySem[sem] = projectedStudents;

      const coursesProjection = semCourses.map(course => {
        const maxPerSection = course.maxStudents || 40;
        const sectionsNeeded = Math.max(1, Math.ceil(projectedStudents / maxPerSection));
        const totalSessions = sectionsNeeded * (course.sessionsPerWeek || 2);
        const totalHours = totalSessions * (course.hoursPerSession || 1);
        const requiredType = course.type || 'teorico';
        const studentsPerSection = Math.ceil(projectedStudents / sectionsNeeded);
        // Filtrar aulas cuya capacidad sea suficiente para los alumnos por sección
        const adequateClassrooms = (classroomsByType[requiredType] || [])
          .filter(c => c.capacity >= studentsPerSection);
        const adequateCount = adequateClassrooms.length;
        const totalCount = classroomsByType[requiredType]?.length || 0;
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
          studentsPerSection,
          classroomsAvailable: totalCount,
          classroomsAdequate: adequateCount,
          classroomSufficient: adequateCount >= sectionsNeeded,
          teachersNeeded
        };
      });

      const totalSections = coursesProjection.reduce((s, c) => s + c.sectionsNeeded, 0);
      const totalHours = coursesProjection.reduce((s, c) => s + c.totalHours, 0);
      const totalTeachersNeeded = coursesProjection.reduce((s, c) => s + c.teachersNeeded, 0);
      const classroomDeficit = coursesProjection.filter(c => !c.classroomSufficient).length;

      projection.push({
        semester: sem,
        currentStudents,
        projectedStudents,
        projectionBasis,
        eligibleStudentCount,
        prerequisiteCourseCodes,
        totalCourses: semCourses.length,
        totalSections,
        totalHours,
        totalTeachersNeeded,
        classroomDeficit,
        courses: coursesProjection
      });
    }

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
        totalClassroomCapacity: classrooms.reduce((s, c) => s + c.capacity, 0),
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
    const allStudents = await Student.find({ active: true });
    const teachers = await Teacher.find({ active: true });
    const classrooms = await Classroom.find({ available: true });

    const summaries = await Promise.all(careers.map(async (career) => {
      const courses = await Course.find({ career: career._id, active: true })
        .populate('prerequisites', 'code name semester');
      const careerStudents = allStudents.filter(s =>
        s.career?.toString() === career._id.toString()
      );
      const passedMap = buildPassedMap(careerStudents);

      let totalProjectedStudents = 0;
      let totalSections = 0;
      let totalHours = 0;

      const maxSem = Math.max(...courses.map(c => c.semester), 1);
      const projectedBySem = {};

      for (let sem = 1; sem <= maxSem; sem++) {
        const semCourses = courses.filter(c => c.semester === sem);
        if (semCourses.length === 0) continue;

        let projStudents;

        if (sem === 1) {
          projStudents = Math.max(
            careerStudents.filter(s => s.currentSemester === 1).length,
            30
          );
        } else {
          const prereqIds = new Set();
          for (const course of semCourses) {
            if (course.prerequisites && course.prerequisites.length > 0) {
              for (const prereq of course.prerequisites) {
                prereqIds.add(prereq._id ? prereq._id.toString() : prereq.toString());
              }
            }
          }

          if (prereqIds.size > 0 && careerStudents.length > 0) {
            let eligibleCount = 0;
            for (const s of careerStudents) {
              const passed = passedMap[s._id.toString()] || new Set();
              let allPassed = true;
              for (const pId of prereqIds) {
                if (!passed.has(pId)) { allPassed = false; break; }
              }
              if (allPassed) eligibleCount++;
            }
            projStudents = Math.max(eligibleCount, 1);
          } else {
            const prevProj = projectedBySem[sem - 1]
              || Math.max(careerStudents.filter(s => s.currentSemester === sem - 1).length, 20);
            projStudents = Math.ceil(prevProj * 0.75);
          }
        }

        projectedBySem[sem] = projStudents;
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
