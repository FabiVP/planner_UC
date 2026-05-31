const Schedule = require('../models/Schedule');
const Generation = require('../models/Generation');
const Course = require('../models/Course');
const Student = require('../models/Student');
const Career = require('../models/Career');
const Teacher = require('../models/Teacher');
const Preference = require('../models/Preference');
const { getShift } = require('../engine/scoring');

/**
 * Helper: find or auto-create a Student profile for the logged-in user
 */
async function findOrCreateStudent(userId, user, populateCareer = true) {
  let query = Student.findOne({ userId });
  if (populateCareer) query = query.populate('career', 'code name totalSemesters totalCredits');
  let student = await query;

  if (!student) {
    query = Student.findOne({ email: user.email });
    if (populateCareer) query = query.populate('career', 'code name totalSemesters totalCredits');
    student = await query;
    if (student) {
      student.userId = userId;
      await student.save();
    } else {
      const count = await Student.countDocuments();
      student = await Student.create({
        userId,
        name: user.name,
        email: user.email,
        studentCode: `AUTO-${String(count + 1).padStart(5, '0')}`,
        currentSemester: 1
      });
    }
  }
  return student;
}

/**
 * GET /api/student-schedule/eligible-courses
 * Devuelve los cursos que el estudiante puede tomar,
 * FILTRADOS POR SU CARRERA, incluyendo validaciones de prerrequisitos,
 * cursos desaprobados, y avance académico.
 */
exports.getEligibleCourses = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const student = await findOrCreateStudent(userId, req.user);

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
 * Valida prerrequisitos, correquisitos, créditos (12-22), dificultad y sobrecarga.
 */
exports.validateSelection = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { courseIds } = req.body;
    if (!courseIds?.length) return res.status(400).json({ message: 'Selecciona al menos un curso.' });

    const student = await findOrCreateStudent(userId, req.user);

    const approvedCourseIds = (student.approvedCourses || [])
      .filter(ac => ac.grade >= 11)
      .map(ac => ac.courseId?._id?.toString() || ac.courseId?.toString());

    const failedCourseIds = (student.approvedCourses || [])
      .filter(ac => ac.grade != null && ac.grade < 11)
      .map(ac => ac.courseId?._id?.toString() || ac.courseId?.toString());

    const selectedCourses = await Course.find({ _id: { $in: courseIds } })
      .populate('prerequisites', 'code name')
      .populate('corequisites', 'code name')
      .populate('career', 'code name');

    const selectedCourseIdSet = new Set(courseIds.map(id => id.toString()));

    const validations = [];
    let totalCredits = 0;
    let totalDifficulty = 0;
    const errors = [];
    const warnings = [];

    for (const course of selectedCourses) {
      const courseId = course._id.toString();
      const validation = {
        courseId, code: course.code, name: course.name,
        credits: course.credits, difficulty: course.difficulty || 3,
        status: 'ok', issues: []
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

      // Corequisites check: must be in selection or already approved
      if (course.corequisites?.length) {
        const unmetCoreqs = course.corequisites.filter(c => {
          const cId = c._id.toString();
          return !approvedCourseIds.includes(cId) && !selectedCourseIdSet.has(cId);
        });
        if (unmetCoreqs.length > 0) {
          validation.status = 'warning';
          validation.issues.push({
            type: 'corequisite',
            message: `Correquisito(s) no incluido(s): ${unmetCoreqs.map(c => c.code).join(', ')}. Debes llevarlos simultáneamente.`
          });
          warnings.push(`${course.code}: Correquisito faltante ${unmetCoreqs.map(c => c.code).join(', ')}`);
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
      totalDifficulty += (course.difficulty || 3);
      validations.push(validation);
    }

    // ── Credit limits from institutional policy ──
    const InstitutionalPolicy = require('../models/InstitutionalPolicy');
    const policy = await InstitutionalPolicy.findOne({ active: true }).sort({ updatedAt: -1 });
    const minCredits = policy?.enrollmentRules?.minCreditsPerSemester ?? 12;
    const maxCredits = policy?.enrollmentRules?.maxCreditsPerSemester ?? 25;
    // Reducción de créditos si tiene cursos desaprobados (regla institucional)
    const effectiveMaxCredits = failedCourseIds.length > 2 ? 18 : maxCredits;

    if (totalCredits < minCredits) {
      warnings.push(`Total de créditos (${totalCredits}) es menor al mínimo recomendado (${minCredits})`);
    }
    if (totalCredits > effectiveMaxCredits) {
      errors.push(`Total de créditos (${totalCredits}) excede el máximo permitido (${effectiveMaxCredits}${failedCourseIds.length > 2 ? ' — reducido por cursos desaprobados' : ''})`);
    } else if (totalCredits > maxCredits) {
      warnings.push(`Total de créditos (${totalCredits}) excede el máximo recomendado (${maxCredits})`);
    }

    // ── Overload / difficulty analysis ──
    const avgDifficulty = selectedCourses.length > 0 ? totalDifficulty / selectedCourses.length : 0;
    const hardCourses = selectedCourses.filter(c => (c.difficulty || 3) >= 4);
    const easyCourses = selectedCourses.filter(c => (c.difficulty || 3) <= 2);

    let overloadLevel = 'normal';
    if (avgDifficulty >= 4 && totalCredits >= 20) overloadLevel = 'alta';
    else if (avgDifficulty >= 3.5 || totalCredits >= 21) overloadLevel = 'media';

    if (overloadLevel === 'alta') {
      warnings.push(`Sobrecarga académica ALTA detectada: ${hardCourses.length} curso(s) difícil(es) con ${totalCredits} créditos`);
    } else if (overloadLevel === 'media') {
      warnings.push(`Carga académica MEDIA-ALTA: considera equilibrar cursos difíciles y ligeros`);
    }

    const difficultyAnalysis = {
      average: Math.round(avgDifficulty * 10) / 10,
      overloadLevel,
      hardCourses: hardCourses.map(c => ({ code: c.code, name: c.name, difficulty: c.difficulty })),
      easyCourses: easyCourses.map(c => ({ code: c.code, name: c.name, difficulty: c.difficulty })),
      recommendation: overloadLevel === 'alta'
        ? 'Recomendación: Reduce la cantidad de cursos difíciles o baja la carga crediticia.'
        : overloadLevel === 'media'
        ? 'Recomendación: Intenta balancear con cursos más ligeros.'
        : 'La carga académica está equilibrada.',
      balance: hardCourses.length > 0 && easyCourses.length > 0 ? 'equilibrado' : (hardCourses.length > 2 ? 'desequilibrado' : 'aceptable')
    };

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

    // GPA info
    const gpa = student.gpa || 0;

    res.json({
      valid: isValid, totalCredits, minCredits, maxCredits: effectiveMaxCredits,
      gpa, validations, errors, warnings,
      difficultyAnalysis,
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

    const student = await findOrCreateStudent(userId, req.user);

    const preference = await Preference.findOne({ userId, role: 'estudiante' });
    const preferredShift = preference?.preferredShift || student.preferredShift || 'indiferente';
    const semester = student.currentSemester || 1;

    const approvedCourseIds = (student.approvedCourses || [])
      .filter(ac => ac.grade >= 11)
      .map(ac => ac.courseId?._id?.toString() || ac.courseId?.toString());

    const failedCourseIds = (student.approvedCourses || [])
      .filter(ac => ac.grade !== undefined && ac.grade !== null && ac.grade < 11)
      .map(ac => ac.courseId?._id?.toString() || ac.courseId?.toString());

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

    // Build unavailable slots from student preference
    const unavailableSlots = new Set();
    const dayAbbrev = { lunes: 'lun', martes: 'mar', miercoles: 'mie', jueves: 'jue', viernes: 'vie', sabado: 'sab', domingo: 'dom' };
    if (preference?.availability) {
      for (const a of matchingAssignments) {
        const shift = getShift(a.startTime);
        const dayKey = dayAbbrev[a.day];
        const avail = preference.availability[shift];
        if (avail && avail[dayKey] === false) {
          unavailableSlots.add(`${a.day}|${a.startTime}`);
        }
      }
    }
    if (preference?.detailedAvailability?.length > 0) {
      for (const a of matchingAssignments) {
        const blocked = preference.detailedAvailability.some(d =>
          d.day === a.day &&
          d.status === 'no_disponible' &&
          a.startTime >= d.startTime &&
          a.startTime < d.endTime
        );
        if (blocked) unavailableSlots.add(`${a.day}|${a.startTime}`);
      }
    }

    // ── Build schedule helper ──
    const buildSchedule = (assignments, shiftPref, unavailable = new Set(), shuffleAdj = false) => {
      // Group assignments by course ID
      const courseMap = {};
      for (const a of assignments) {
        const cId = a.courseId?._id?.toString() || a.courseId?.toString();
        if (!courseMap[cId]) courseMap[cId] = [];
        courseMap[cId].push(a);
      }

      const courseIds = Object.keys(courseMap);

      // Sort each course's own slots by shift preference
      for (const cId of courseIds) {
        const slots = courseMap[cId];
        if (shiftPref !== 'indiferente') {
          slots.sort((a, b) => {
            const matchA = getShift(a.startTime) === shiftPref ? 0 : 1;
            const matchB = getShift(b.startTime) === shiftPref ? 0 : 1;
            return matchA - matchB;
          });
        }
      }

      // ── Maximum bipartite matching (Kuhn's algorithm) ──
      // Each course needs exactly 1 slot, no two courses share a slot.
      // Build adjacency: available slots first, then unavailable (fallback)
      const adj = {};
      const slotToCourse = {};
      for (const cId of courseIds) {
        const available = [];
        const fallback = [];
        for (const a of courseMap[cId]) {
          const key = `${a.day}|${a.startTime}`;
          if (unavailable.has(key)) fallback.push(key);
          else available.push(key);
        }
        // Shuffle within each group if requested (produces different matchings)
        if (shuffleAdj) {
          for (let i = available.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [available[i], available[j]] = [available[j], available[i]];
          }
          for (let i = fallback.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [fallback[i], fallback[j]] = [fallback[j], fallback[i]];
          }
        }
        adj[cId] = [...available, ...fallback];
      }

      function dfsAugment(cId, visited) {
        for (const slot of adj[cId]) {
          if (visited.has(slot)) continue;
          visited.add(slot);
          const prev = slotToCourse[slot];
          if (prev === undefined || dfsAugment(prev, visited)) {
            slotToCourse[slot] = cId;
            return true;
          }
        }
        return false;
      }

      // Process most constrained first for better performance
      courseIds.sort((a, b) => adj[a].length - adj[b].length);
      for (const cId of courseIds) {
        dfsAugment(cId, new Set());
      }

      // Build result from matching
      const selected = [];
      const selectedCIds = new Set();
      for (const [slotKey, cId] of Object.entries(slotToCourse)) {
        const [day, startTime] = slotKey.split('|');
        const a = courseMap[cId].find(a => a.day === day && a.startTime === startTime);
        if (a) {
          selected.push(a);
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

      // Detect observations: courses assigned to unavailable (fallback) slots
      const observations = [];
      for (const [slotKey, cId] of Object.entries(slotToCourse)) {
        if (unavailable.has(slotKey)) {
          const course = coursesToTake.find(c => c._id.toString() === cId);
          const [day, startTime] = slotKey.split('|');
          if (course) {
            observations.push({
              courseCode: course.code,
              courseName: course.name,
              message: `Asignado a ${day} ${startTime} — fuera de su disponibilidad`
            });
          }
        }
      }

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
          totalGaps,
          observationsCount: observations.length
        },
        uncoveredCourses: uncovered,
        observations,
        score: Math.round(
          (totalCourses / Math.max(coursesToTake.length, 1)) * 40 +
          shiftMatchPercent * 0.3 +
          (1 - totalGaps / Math.max(totalSessions, 1)) * 30
        )
      };
    };

    // ── Generate primary + alternatives ──
    const primaryResult = buildSchedule(matchingAssignments, preferredShift, unavailableSlots);

    // Alternative 1: opposite shift preference
    const altShifts = ['manana', 'tarde', 'noche'].filter(s => s !== preferredShift);
    const alternatives = [];

    for (const altShift of altShifts) {
      const altResult = buildSchedule(matchingAssignments, altShift, unavailableSlots, true);
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
    const shuffleResult = buildSchedule(shuffled, preferredShift, unavailableSlots);
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
      observations: primaryResult.observations,
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
 * Query params: ?courseIds=JSON_ARRAY
 */
exports.getMySchedule = async (req, res, next) => {
  if (req.query.courseIds) {
    try {
      req.body = { courseIds: JSON.parse(req.query.courseIds) };
    } catch { /* ignore malformed */ }
  }
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

