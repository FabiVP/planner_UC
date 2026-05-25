const Schedule = require('../models/Schedule');
const Generation = require('../models/Generation');
const Course = require('../models/Course');
const Student = require('../models/Student');
const Career = require('../models/Career');
const Teacher = require('../models/Teacher');
const Preference = require('../models/Preference');
const { getShift } = require('../engine/scoring');

/**
 * GET /api/student-schedule/eligible-courses
 * Devuelve los cursos que el estudiante puede tomar,
 * FILTRADOS POR SU CARRERA, incluyendo validaciones de prerrequisitos,
 * cursos desaprobados, y avance académico.
 */
exports.getEligibleCourses = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const student = await Student.findOne({ userId })
      .populate('approvedCourses.courseId')
      .populate('career', 'code name totalSemesters totalCredits');
    if (!student) return res.status(404).json({ message: 'Perfil de estudiante no encontrado.' });

    const semester = student.currentSemester || 1;
    const approvedCourseIds = (student.approvedCourses || [])
      .filter(ac => ac.grade >= 11)
      .map(ac => ac.courseId?._id?.toString() || ac.courseId?.toString());

    const failedCourses = (student.approvedCourses || [])
      .filter(ac => ac.grade !== undefined && ac.grade !== null && ac.grade < 11)
      .map(ac => ac.courseId?._id?.toString() || ac.courseId?.toString());

    // ─── FILTRAR POR CARRERA ───
    const courseFilter = { active: true, semester: { $lte: semester } };
    if (student.career) {
      courseFilter.career = student.career._id || student.career;
    }

    const allCoursesRaw = await Course.find(courseFilter)
      .populate('prerequisites', 'code name semester')
      .populate('career', 'code name')
      .populate('assignedTeachers', 'name')
      .sort({ semester: 1, name: 1 });

    // ─── VINCULACIÓN TRIPARTITA: solo cursos con docente asignado ───
    // Un curso es válido si tiene assignedTeachers O si algún docente lo tiene en specializations
    const activeTeachers = await Teacher.find({ active: true }).select('specializations');
    const teacherSpecCourseIds = new Set(
      activeTeachers.flatMap(t => (t.specializations || []).map(s => s.toString()))
    );

    // ─── FILTRAR POR HORARIO INSTITUCIONAL VIGENTE ───
    const latestGen = await Generation.findOne({ status: 'completada' }).sort({ createdAt: -1 });
    let scheduledCourseIds = new Set();
    if (latestGen?.scheduleId) {
      const schedule = await Schedule.findById(latestGen.scheduleId);
      if (schedule) {
        scheduledCourseIds = new Set(
          schedule.assignments.map(a => a.courseId?.toString())
        );
      }
    }

    // Filtrar: curso debe tener docente asignado Y existir en el horario institucional
    const allCourses = allCoursesRaw.filter(course => {
      const cId = course._id.toString();
      const hasAssignedTeacher = (course.assignedTeachers && course.assignedTeachers.length > 0)
        || teacherSpecCourseIds.has(cId);
      const existsInSchedule = scheduledCourseIds.size === 0 || scheduledCourseIds.has(cId);
      return hasAssignedTeacher && existsInSchedule;
    });

    const categories = {
      failedToRetake: [],
      currentSemester: [],
      previousPending: [],
      blockedByPrereq: [],
    };

    for (const course of allCourses) {
      const courseId = course._id.toString();
      if (approvedCourseIds.includes(courseId)) continue;

      const prereqsMet = !course.prerequisites?.length || course.prerequisites.every(
        prereq => approvedCourseIds.includes(prereq._id.toString())
      );
      const unmetPrereqs = course.prerequisites?.filter(
        prereq => !approvedCourseIds.includes(prereq._id.toString())
      ) || [];

      const courseData = {
        _id: course._id,
        code: course.code,
        name: course.name,
        credits: course.credits,
        type: course.type,
        semester: course.semester,
        sessionsPerWeek: course.sessionsPerWeek,
        hoursPerSession: course.hoursPerSession,
        mandatory: course.mandatory,
        career: course.career ? { code: course.career.code, name: course.career.name } : null,
        prerequisites: course.prerequisites?.map(p => ({ code: p.code, name: p.name })) || [],
        prereqsMet,
        unmetPrereqs: unmetPrereqs.map(p => ({ code: p.code, name: p.name })),
        isFailed: failedCourses.includes(courseId),
        canEnroll: prereqsMet
      };

      if (failedCourses.includes(courseId) && prereqsMet) {
        courseData.priority = 'alta';
        courseData.reason = 'Curso desaprobado — debe repetir';
        categories.failedToRetake.push(courseData);
      } else if (!prereqsMet) {
        courseData.priority = 'bloqueado';
        courseData.reason = `Prerrequisito(s) no cumplido(s): ${unmetPrereqs.map(p => p.code).join(', ')}`;
        categories.blockedByPrereq.push(courseData);
      } else if (course.semester === semester) {
        courseData.priority = 'normal';
        courseData.reason = 'Curso del semestre actual';
        categories.currentSemester.push(courseData);
      } else if (course.semester < semester) {
        courseData.priority = 'media';
        courseData.reason = `Curso pendiente del semestre ${course.semester}`;
        categories.previousPending.push(courseData);
      }
    }

    // Academic progress
    const totalCoursesInCareer = student.career
      ? await Course.countDocuments({ active: true, career: student.career._id || student.career })
      : await Course.countDocuments({ active: true });
    const totalApproved = approvedCourseIds.length;
    const totalCreditsApproved = student.totalCreditsApproved || 0;

    const careerInfo = student.career
      ? { code: student.career.code, name: student.career.name, totalSemesters: student.career.totalSemesters, totalCredits: student.career.totalCredits }
      : null;

    res.json({
      student: {
        name: student.name,
        code: student.studentCode,
        currentSemester: semester,
        career: careerInfo,
        totalCreditsApproved,
        preferredShift: student.preferredShift
      },
      academicProgress: {
        totalCoursesInPlan: totalCoursesInCareer,
        coursesApproved: totalApproved,
        coursesFailed: failedCourses.length,
        progressPercent: totalCoursesInCareer > 0 ? Math.round((totalApproved / totalCoursesInCareer) * 100) : 0,
        totalCreditsApproved
      },
      categories,
      summary: {
        failedToRetake: categories.failedToRetake.length,
        currentSemester: categories.currentSemester.length,
        previousPending: categories.previousPending.length,
        blockedByPrereq: categories.blockedByPrereq.length,
        totalAvailable: categories.failedToRetake.length + categories.currentSemester.length + categories.previousPending.length
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/student-schedule/validate
 * Body: { courseIds: [id1, id2, ...] }
 */
exports.validateSelection = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { courseIds } = req.body;
    if (!courseIds?.length) return res.status(400).json({ message: 'Selecciona al menos un curso.' });

    const student = await Student.findOne({ userId });
    if (!student) return res.status(404).json({ message: 'Perfil de estudiante no encontrado.' });

    const approvedCourseIds = (student.approvedCourses || [])
      .filter(ac => ac.grade >= 11)
      .map(ac => ac.courseId?.toString());

    const selectedCourses = await Course.find({ _id: { $in: courseIds } })
      .populate('prerequisites', 'code name')
      .populate('career', 'code name');

    const validations = [];
    let totalCredits = 0;
    const errors = [];
    const warnings = [];

    for (const course of selectedCourses) {
      const courseId = course._id.toString();
      const validation = {
        courseId, code: course.code, name: course.name,
        credits: course.credits, status: 'ok', issues: []
      };

      // Already approved?
      if (approvedCourseIds.includes(courseId)) {
        validation.status = 'error';
        validation.issues.push({ type: 'already_approved', message: 'Curso ya aprobado' });
        errors.push(`${course.code}: Ya aprobado`);
      }

      // Prerequisites met?
      if (course.prerequisites?.length) {
        const unmet = course.prerequisites.filter(p => !approvedCourseIds.includes(p._id.toString()));
        if (unmet.length > 0) {
          validation.status = 'error';
          validation.issues.push({ type: 'prerequisite', message: `Prerrequisito(s) faltante(s): ${unmet.map(p => p.code).join(', ')}` });
          errors.push(`${course.code}: Falta prerrequisito ${unmet.map(p => p.code).join(', ')}`);
        }
      }

      // Career check
      if (student.career && course.career) {
        const studentCareer = (student.career._id || student.career).toString();
        const courseCareer = (course.career._id || course.career).toString();
        if (studentCareer !== courseCareer) {
          validation.status = 'warning';
          validation.issues.push({ type: 'wrong_career', message: `Curso de otra carrera (${course.career.name || course.career.code || 'otra'})` });
          warnings.push(`${course.code}: Curso de otra carrera`);
        }
      }

      // Semester check
      if (course.semester > student.currentSemester) {
        validation.status = 'warning';
        validation.issues.push({ type: 'future_semester', message: `Curso del semestre ${course.semester}, estás en semestre ${student.currentSemester}` });
        warnings.push(`${course.code}: Semestre adelantado`);
      }

      totalCredits += course.credits;
      validations.push(validation);
    }

    const maxCredits = 22;
    if (totalCredits > maxCredits) {
      warnings.push(`Total de créditos (${totalCredits}) excede el máximo recomendado (${maxCredits})`);
    }

    // Schedule conflicts
    const latestGen = await Generation.findOne({ status: 'completada' }).sort({ createdAt: -1 });
    let conflictsFound = [];
    if (latestGen?.scheduleId) {
      const schedule = await Schedule.findById(latestGen.scheduleId)
        .populate('assignments.courseId', 'code name');
      if (schedule) {
        const selectedSet = new Set(courseIds.map(id => id.toString()));
        const relevant = schedule.assignments.filter(a => selectedSet.has(a.courseId?._id?.toString()));
        for (let i = 0; i < relevant.length; i++) {
          for (let j = i + 1; j < relevant.length; j++) {
            if (relevant[i].day === relevant[j].day && relevant[i].startTime === relevant[j].startTime &&
              relevant[i].courseId?._id?.toString() !== relevant[j].courseId?._id?.toString()) {
              conflictsFound.push({
                course1: relevant[i].courseId?.name || 'Curso A',
                course2: relevant[j].courseId?.name || 'Curso B',
                day: relevant[i].day, time: relevant[i].startTime
              });
            }
          }
        }
      }
    }

    if (conflictsFound.length > 0) warnings.push(`${conflictsFound.length} cruce(s) de horario detectado(s)`);
    const isValid = errors.length === 0;

    res.json({
      valid: isValid, totalCredits, maxCredits, validations, errors, warnings,
      conflicts: conflictsFound,
      message: isValid ? (warnings.length > 0 ? 'Selección válida con advertencias' : 'Selección válida') : 'Selección con errores — corrige antes de continuar'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/student-schedule/generate
 * Body opcional: { courseIds: [...] }
 * Genera el horario ÓPTIMO + hasta 2 alternativas para que el estudiante elija.
 */
exports.generateStudentSchedule = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { courseIds } = req.body || {};

    const student = await Student.findOne({ userId }).populate('career', 'code name');
    if (!student) return res.status(404).json({ message: 'Perfil de estudiante no encontrado.' });

    const preference = await Preference.findOne({ userId, role: 'estudiante' });
    const preferredShift = preference?.preferredShift || student.preferredShift || 'indiferente';
    const semester = student.currentSemester || 1;

    const approvedCourseIds = (student.approvedCourses || [])
      .filter(ac => ac.grade >= 11)
      .map(ac => ac.courseId?.toString());

    const failedCourseIds = (student.approvedCourses || [])
      .filter(ac => ac.grade !== undefined && ac.grade !== null && ac.grade < 11)
      .map(ac => ac.courseId?.toString());

    // Get latest institutional schedule
    const latestGeneration = await Generation.findOne({ status: 'completada' }).sort({ createdAt: -1 });
    if (!latestGeneration?.scheduleId) {
      return res.status(400).json({ message: 'No hay horario institucional disponible. El coordinador debe generar uno primero.' });
    }

    const schedule = await Schedule.findById(latestGeneration.scheduleId)
      .populate('assignments.courseId', 'code name credits type semester prerequisites mandatory maxStudents sessionsPerWeek hoursPerSession career')
      .populate('assignments.teacherId', 'name')
      .populate('assignments.classroomId', 'code name type capacity');

    if (!schedule) return res.status(400).json({ message: 'Horario institucional no encontrado.' });

    // Determine courses — FILTER BY CAREER
    let coursesToTake;
    if (courseIds?.length) {
      coursesToTake = await Course.find({ _id: { $in: courseIds } }).populate('prerequisites');
    } else {
      const courseFilter = { active: true, semester: { $lte: semester } };
      if (student.career) courseFilter.career = student.career._id || student.career;

      const allCourses = await Course.find(courseFilter).populate('prerequisites');
      coursesToTake = allCourses.filter(course => {
        if (approvedCourseIds.includes(course._id.toString())) return false;
        if (course.prerequisites?.length) {
          return course.prerequisites.every(p => approvedCourseIds.includes(p._id.toString()));
        }
        return true;
      });

      coursesToTake.sort((a, b) => {
        const aFailed = failedCourseIds.includes(a._id.toString()) ? 0 : 1;
        const bFailed = failedCourseIds.includes(b._id.toString()) ? 0 : 1;
        if (aFailed !== bFailed) return aFailed - bFailed;
        return b.semester - a.semester;
      });
    }

    const courseIdsToTake = new Set(coursesToTake.map(c => c._id.toString()));

    // Filter institutional schedule for these courses
    const matchingAssignments = schedule.assignments.filter(a => {
      const cId = a.courseId?._id?.toString() || a.courseId?.toString();
      return courseIdsToTake.has(cId);
    });

    // ── Build schedule helper ──
    const buildSchedule = (assignments, shiftPref) => {
      const sorted = [...assignments];
      if (shiftPref !== 'indiferente') {
        sorted.sort((a, b) => {
          const matchA = getShift(a.startTime) === shiftPref ? 0 : 1;
          const matchB = getShift(b.startTime) === shiftPref ? 0 : 1;
          return matchA - matchB;
        });
      }

      const selected = [];
      const selectedCIds = new Set();

      for (const assignment of sorted) {
        const cId = assignment.courseId?._id?.toString() || assignment.courseId?.toString();
        const course = coursesToTake.find(c => c._id.toString() === cId);
        const sessionsNeeded = course?.sessionsPerWeek || 2;
        const currentSessions = selected.filter(a =>
          (a.courseId?._id?.toString() || a.courseId?.toString()) === cId
        ).length;

        if (currentSessions >= sessionsNeeded) continue;

        const hasConflict = selected.some(a =>
          a.day === assignment.day && a.startTime === assignment.startTime
        );

        if (!hasConflict) {
          selected.push(assignment);
          selectedCIds.add(cId);
        }
      }

      const totalCourses = selectedCIds.size;
      const totalSessions = selected.length;
      const totalCredits = coursesToTake
        .filter(c => selectedCIds.has(c._id.toString()))
        .reduce((sum, c) => sum + c.credits, 0);

      const shiftMatch = selected.filter(a =>
        shiftPref === 'indiferente' || getShift(a.startTime) === shiftPref
      ).length;
      const shiftMatchPercent = totalSessions > 0 ? Math.round((shiftMatch / totalSessions) * 100) : 100;

      // Calculate gap penalty (fewer gaps = better)
      const daySlots = {};
      selected.forEach(a => {
        if (!daySlots[a.day]) daySlots[a.day] = [];
        daySlots[a.day].push(parseInt(a.startTime.replace(':', ''), 10));
      });
      let totalGaps = 0;
      Object.values(daySlots).forEach(slots => {
        slots.sort((a, b) => a - b);
        for (let i = 1; i < slots.length; i++) {
          const diff = slots[i] - slots[i - 1];
          if (diff > 100) totalGaps += (diff / 100) - 1; // each gap = 1 hour skip
        }
      });

      const uncovered = coursesToTake
        .filter(c => !selectedCIds.has(c._id.toString()))
        .map(c => ({ code: c.code, name: c.name, semester: c.semester, credits: c.credits }));

      return {
        assignments: selected.map(a => ({
          courseId: a.courseId, teacherId: a.teacherId,
          classroomId: a.classroomId, day: a.day,
          startTime: a.startTime, endTime: a.endTime
        })),
        stats: {
          totalCourses, totalSessions, totalCredits,
          shiftMatchPercent, preferredShift: shiftPref,
          failedCoursesIncluded: [...selectedCIds].filter(id => failedCourseIds.includes(id)).length,
          uncoveredCourses: uncovered.length,
          totalGaps
        },
        uncoveredCourses: uncovered,
        score: Math.round(
          (totalCourses / Math.max(coursesToTake.length, 1)) * 40 +
          shiftMatchPercent * 0.3 +
          (1 - totalGaps / Math.max(totalSessions, 1)) * 30
        )
      };
    };

    // ── Generate primary + alternatives ──
    const primaryResult = buildSchedule(matchingAssignments, preferredShift);

    // Alternative 1: opposite shift preference
    const altShifts = ['manana', 'tarde', 'noche'].filter(s => s !== preferredShift);
    const alternatives = [];

    for (const altShift of altShifts) {
      const altResult = buildSchedule(matchingAssignments, altShift);
      if (altResult.assignments.length > 0) {
        alternatives.push({
          label: `Horario turno ${{ manana: 'Mañana', tarde: 'Tarde', noche: 'Noche' }[altShift]}`,
          shiftPreference: altShift,
          ...altResult
        });
      }
    }

    // Alternative 3: shuffle to find different assignment
    const shuffled = [...matchingAssignments].sort(() => Math.random() - 0.5);
    const shuffleResult = buildSchedule(shuffled, preferredShift);
    if (shuffleResult.assignments.length > 0 && shuffleResult.score !== primaryResult.score) {
      alternatives.push({
        label: 'Horario alternativo',
        shiftPreference: preferredShift,
        ...shuffleResult
      });
    }

    // Sort alternatives by score descending
    alternatives.sort((a, b) => b.score - a.score);

    const careerInfo = student.career ? { code: student.career.code, name: student.career.name } : null;

    res.json({
      student: {
        name: student.name, code: student.studentCode,
        currentSemester: semester, preferredShift,
        career: careerInfo
      },
      schedule: {
        generationName: latestGeneration.name,
        semester: schedule.semester,
        assignments: primaryResult.assignments
      },
      stats: primaryResult.stats,
      uncoveredCourses: primaryResult.uncoveredCourses,
      alternatives: alternatives.slice(0, 2),
      message: primaryResult.uncoveredCourses.length > 0
        ? `Se asignaron ${primaryResult.stats.totalCourses} cursos (${primaryResult.stats.totalCredits} créd). ${primaryResult.uncoveredCourses.length} curso(s) sin horario disponible.`
        : `Horario generado con ${primaryResult.stats.totalCourses} cursos y ${primaryResult.stats.totalCredits} créditos.`
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/student-schedule/my-schedule
 */
exports.getMySchedule = async (req, res, next) => {
  return exports.generateStudentSchedule(req, res, next);
};

/**
 * POST /api/student-schedule/course-availability
 * Body: { courseIds: [id1, id2, ...] }
 * Devuelve las franjas horarias disponibles en el horario institucional
 * para cada curso seleccionado (vista previa antes de generar).
 */
exports.getCourseAvailability = async (req, res, next) => {
  try {
    const { courseIds } = req.body;
    if (!courseIds?.length) return res.status(400).json({ message: 'Selecciona al menos un curso.' });

    const latestGen = await Generation.findOne({ status: 'completada' }).sort({ createdAt: -1 });
    if (!latestGen?.scheduleId) {
      return res.json({ available: false, message: 'No hay horario institucional generado.' });
    }

    const schedule = await Schedule.findById(latestGen.scheduleId)
      .populate('assignments.courseId', 'code name')
      .populate('assignments.teacherId', 'name')
      .populate('assignments.classroomId', 'code name');

    if (!schedule) return res.json({ available: false, message: 'Horario no encontrado.' });

    const courseIdSet = new Set(courseIds.map(id => id.toString()));

    const courseSlots = {};
    for (const a of schedule.assignments) {
      const cId = a.courseId?._id?.toString() || a.courseId?.toString();
      if (!courseIdSet.has(cId)) continue;

      if (!courseSlots[cId]) {
        courseSlots[cId] = {
          courseId: cId,
          code: a.courseId?.code || '',
          name: a.courseId?.name || '',
          slots: []
        };
      }

      courseSlots[cId].slots.push({
        day: a.day,
        startTime: a.startTime,
        endTime: a.endTime,
        teacher: a.teacherId?.name || 'TBD',
        classroom: a.classroomId?.code || 'TBD'
      });
    }

    // Detect conflicts between selected courses
    const allSlots = Object.values(courseSlots).flatMap(cs =>
      cs.slots.map(s => ({ ...s, courseCode: cs.code, courseName: cs.name }))
    );

    const conflicts = [];
    for (let i = 0; i < allSlots.length; i++) {
      for (let j = i + 1; j < allSlots.length; j++) {
        if (allSlots[i].day === allSlots[j].day &&
            allSlots[i].startTime === allSlots[j].startTime &&
            allSlots[i].courseCode !== allSlots[j].courseCode) {
          conflicts.push({
            course1: allSlots[i].courseCode,
            course2: allSlots[j].courseCode,
            day: allSlots[i].day,
            time: allSlots[i].startTime
          });
        }
      }
    }

    res.json({
      available: true,
      courses: Object.values(courseSlots),
      conflicts,
      hasConflicts: conflicts.length > 0
    });
  } catch (error) {
    next(error);
  }
};

