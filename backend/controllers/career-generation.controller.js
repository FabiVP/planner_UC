/**
 * Career-based Schedule Generation Controller
 * Generates schedules for all semesters of a career with multi-section support.
 */
const Course = require('../models/Course');
const Teacher = require('../models/Teacher');
const Classroom = require('../models/Classroom');
const Student = require('../models/Student');
const Section = require('../models/Section');
const Generation = require('../models/Generation');
const Schedule = require('../models/Schedule');
const Career = require('../models/Career');
const InstitutionalPolicy = require('../models/InstitutionalPolicy');
const Enrollment = require('../models/Enrollment');
const Preference = require('../models/Preference');
const { createNotification } = require('./notification.controller');
const { runCSPMultiple } = require('../engine/csp');

/**
 * POST /api/generations/career
 * Body: { careerId, semester }
 */
exports.generateByCareer = async (req, res, next) => {
  try {
    const { careerId, semester = '2026-1' } = req.body;
    if (!careerId) return res.status(400).json({ message: 'Debe seleccionar una carrera.' });

    const career = await Career.findById(careerId);
    if (!career) return res.status(404).json({ message: 'Carrera no encontrada.' });

    console.log(`\n🎓 Generando horarios para: ${career.name} (${semester})`);

    // Load resources
    const [allCourses, teachers, classrooms, policy, teacherPrefs] = await Promise.all([
      Course.find({ career: careerId, active: true }).sort({ semester: 1 }),
      Teacher.find({ active: true }),
      Classroom.find({ available: true }),
      InstitutionalPolicy.findOne({ active: true }).sort({ updatedAt: -1 }),
      Preference.find({ role: 'docente' })
    ]);

    if (!allCourses.length) return res.status(400).json({ message: 'No hay cursos activos para esta carrera.' });
    if (!teachers.length) return res.status(400).json({ message: 'No hay docentes disponibles.' });
    if (!classrooms.length) return res.status(400).json({ message: 'No hay aulas disponibles.' });

    // Apply default lunch block
    if (policy?.allowedSchedule && (!policy.allowedSchedule.blockedTimeSlots?.length)) {
      policy.allowedSchedule.blockedTimeSlots = [{ start: '13:00', end: '14:00', reason: 'Almuerzo' }];
    }

    // Count enrolled students per semester for section calculation
    const enrolledStudents = await Student.aggregate([
      { $match: { career: career._id } },
      { $group: { _id: '$currentSemester', count: { $sum: 1 } } }
    ]);
    const demandBySemester = {};
    enrolledStudents.forEach(e => { demandBySemester[e._id] = e.count; });

    // Calculate sections needed per course
    const sectionPlan = [];
    const warnings = [];

    for (const course of allCourses) {
      const demand = demandBySemester[course.semester] || 0;
      const eligibleTeachers = getEligibleTeachersForCourse(course, teachers);

      if (eligibleTeachers.length === 0) {
        warnings.push({
          courseCode: course.code, courseName: course.name,
          warning: 'Sin docente asignado ni especializado',
          severity: 'error'
        });
        continue;
      }

      // Calculate how many sections are needed
      const maxPerSection = course.maxStudents || 40;
      const minPerSection = course.minStudentsPerSection || 10;
      let numSections = Math.max(1, Math.ceil(demand / maxPerSection));

      // Cap by available teachers
      numSections = Math.min(numSections, eligibleTeachers.length);

      // Check minimum enrollment
      if (demand > 0 && demand < minPerSection && numSections === 1) {
        warnings.push({
          courseCode: course.code, courseName: course.name,
          warning: `Solo ${demand} estudiantes (mínimo ${minPerSection}). Sección abierta bajo observación.`,
          severity: 'warning'
        });
      }

      // Distribute teachers across sections
      for (let i = 0; i < numSections; i++) {
        const teacher = eligibleTeachers[i % eligibleTeachers.length];
        const sectionCode = String.fromCharCode(65 + i); // A, B, C...
        sectionPlan.push({
          course,
          teacher,
          sectionCode,
          expectedStudents: Math.ceil(demand / numSections)
        });
      }
    }

    console.log(`📊 Plan: ${sectionPlan.length} secciones para ${allCourses.length} cursos`);

    // Build "virtual courses" for the CSP — one per section
    const virtualCourses = sectionPlan.map((sp, idx) => ({
      _id: `${sp.course._id}_sec_${sp.sectionCode}`,
      _realCourseId: sp.course._id,
      code: `${sp.course.code}-${sp.sectionCode}`,
      name: sp.course.name,
      credits: sp.course.credits,
      type: sp.course.type,
      semester: sp.course.semester,
      sessionsPerWeek: sp.course.sessionsPerWeek,
      hoursPerSession: sp.course.hoursPerSession,
      maxStudents: sp.course.maxStudents,
      career: sp.course.career,
      _forcedTeacherId: sp.teacher._id.toString(),
      _sectionCode: sp.sectionCode,
      _sectionIndex: idx
    }));

    // Run CSP with section-aware courses and teacher preferences
    const startTime = Date.now();
    const result = runCSPMultiple(virtualCourses, teachers, classrooms, teacherPrefs, 3, policy);
    const executionTime = Date.now() - startTime;

    if (!result.success) {
      return res.status(422).json({
        success: false,
        message: 'No se pudo generar un horario válido.',
        warnings,
        executionTime: executionTime / 1000
      });
    }

    // Build actionable suggestions for low-enrollment sections
    const suggestions = [];
    for (const sp of sectionPlan) {
      if (sp.expectedStudents < (sp.course.minStudentsPerSection || 10)) {
        const otherSections = sectionPlan.filter(o =>
          o.course._id.toString() === sp.course._id.toString() &&
          o.sectionCode !== sp.sectionCode
        );
        const totalCapacity = otherSections.reduce((s, o) => s + (o.course.maxStudents || 40), 0);
        const totalDemand = otherSections.reduce((s, o) => s + o.expectedStudents, 0) + sp.expectedStudents;
        const canAbsorb = totalDemand <= totalCapacity;
        suggestions.push({
          courseCode: sp.course.code,
          courseName: sp.course.name,
          sectionCode: sp.sectionCode,
          expectedStudents: sp.expectedStudents,
          minimumRequired: sp.course.minStudentsPerSection || 10,
          alternativeSections: otherSections.length,
          canMergeIntoExisting: canAbsorb,
          action: canAbsorb
            ? `Fusionar sección ${sp.sectionCode} en otra sección de ${sp.course.code}`
            : 'Mantener pendiente hasta alcanzar mínimo de estudiantes',
          severity: canAbsorb ? 'warning' : 'info'
        });
      }
    }

    // Create Generation record
    const generation = await Generation.create({
      name: `Horario ${career.code} — ${semester}`,
      semester,
      career: career._id,
      status: 'completada',
      executedAt: new Date(),
      completedAt: new Date(),
      executionTimeMs: executionTime,
      qualityScore: result.qualityScore || 0,
      sectionsGenerated: sectionPlan.length,
      sectionWarnings: warnings,
      createdBy: req.user?._id
    });

    // Create Schedule record
    const assignments = result.assignments.map(a => ({
      courseId: a._realCourseId || a.courseId,
      teacherId: a.teacherId,
      classroomId: a.classroomId,
      day: a.day,
      startTime: a.startTime,
      endTime: a.endTime
    }));

    const schedule = await Schedule.create({
      generationId: generation._id,
      semester,
      assignments,
      totalAssignments: assignments.length
    });

    generation.scheduleId = schedule._id;
    await generation.save();

    // Create Section records in DB
    const createdSections = [];
    for (const sp of sectionPlan) {
      const sectionAssignments = result.assignments.filter(a => {
        const cid = a._realCourseId?.toString() || a.courseId?.toString();
        return cid === sp.course._id.toString() &&
               (a._sectionCode === sp.sectionCode || a.teacherId?.toString() === sp.teacher._id.toString());
      });

      const scheduleSlots = sectionAssignments.map(a => ({
        day: a.day, startTime: a.startTime, endTime: a.endTime
      }));

      if (sectionAssignments.length === 0) {
        warnings.push(`No se pudieron asignar horarios para ${sp.course.name} (sección ${sp.sectionCode})`);
        continue;
      }

      const classroom = sectionAssignments[0];
      const section = await Section.create({
        courseId: sp.course._id,
        sectionCode: sp.sectionCode,
        teacherId: sp.teacher._id,
        classroomId: classroom?.classroomId,
        scheduleSlots,
        maxCapacity: sp.course.maxStudents,
        minStudents: sp.course.minStudentsPerSection || 10,
        status: sp.expectedStudents >= (sp.course.minStudentsPerSection || 10) ? 'activa' : 'pendiente',
        generationId: generation._id,
        semester,
        career: career._id,
        courseSemester: sp.course.semester
      });
      createdSections.push(section);
    }

    console.log(`✅ ${createdSections.length} secciones creadas para ${career.code}`);

    res.json({
      success: true,
      generation: {
        _id: generation._id,
        name: generation.name,
        career: { code: career.code, name: career.name },
        semester,
        qualityScore: generation.qualityScore,
        sectionsGenerated: createdSections.length,
        executionTime: executionTime / 1000
      },
      sections: createdSections.length,
      warnings,
      suggestions,
      hasSuggestions: suggestions.length > 0,
      sectionsBySemester: groupSectionsBySemester(createdSections, allCourses)
    });
  } catch (error) {
    console.error('❌ Error generando por carrera:', error);
    next(error);
  }
};

/**
 * GET /api/sections?career=X&semester=Y
 */
exports.getSections = async (req, res, next) => {
  try {
    const { career, semester, courseSemester, status } = req.query;
    const filter = {};
    if (career) filter.career = career;
    if (semester) filter.semester = semester;
    if (courseSemester) filter.courseSemester = +courseSemester;
    if (status) filter.status = status;

    const sections = await Section.find(filter)
      .populate('courseId', 'code name credits type semester sessionsPerWeek')
      .populate('teacherId', 'name email department')
      .populate('classroomId', 'code name capacity type building')
      .populate('career', 'code name')
      .sort({ courseSemester: 1, 'courseId.code': 1, sectionCode: 1 });

    res.json({ count: sections.length, sections });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/sections/student-available
 * Returns sections available for the authenticated student
 */
exports.getStudentSections = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const Student = require('../models/Student');
    const student = await Student.findOne({ userId }).populate('career', 'code name');
    if (!student) return res.status(404).json({ message: 'Perfil de estudiante no encontrado.' });

    const semester = student.currentSemester;
    const approvedIds = (student.approvedCourses || [])
      .filter(ac => ac.grade >= 11)
      .map(ac => ac.courseId?.toString());
    const failedIds = (student.approvedCourses || [])
      .filter(ac => ac.grade < 11 && ac.grade > 0)
      .map(ac => ac.courseId?.toString());

    // Get all active sections for student's career
    const sections = await Section.find({
      career: student.career?._id || student.career,
      status: 'activa'
    })
      .populate('courseId', 'code name credits type semester prerequisites sessionsPerWeek mandatory')
      .populate('teacherId', 'name email')
      .populate('classroomId', 'code name capacity building');

    // Filter: only courses student can take
    const eligible = [];
    const blocked = [];

    for (const section of sections) {
      const course = section.courseId;
      if (!course) continue;
      const cid = course._id.toString();

      // Skip approved courses
      if (approvedIds.includes(cid)) continue;

      // Check prerequisites
      const prereqsMet = !course.prerequisites?.length ||
        course.prerequisites.every(p => approvedIds.includes(p.toString()));

      // Check capacity
      const hasSpace = section.currentEnrolled < section.maxCapacity;

      const sectionData = {
        sectionId: section._id,
        sectionCode: section.sectionCode,
        courseId: course._id,
        courseCode: course.code,
        courseName: course.name,
        credits: course.credits,
        type: course.type,
        courseSemester: course.semester,
        teacher: section.teacherId?.name,
        classroom: `${section.classroomId?.code} (${section.classroomId?.building})`,
        capacity: section.maxCapacity,
        enrolled: section.currentEnrolled,
        available: section.maxCapacity - section.currentEnrolled,
        scheduleSlots: section.scheduleSlots,
        isFailed: failedIds.includes(cid),
        prereqsMet,
        hasSpace,
        canEnroll: prereqsMet && hasSpace
      };

      if (prereqsMet && (course.semester <= semester || failedIds.includes(cid))) {
        eligible.push(sectionData);
      } else if (!prereqsMet) {
        sectionData.reason = 'Prerrequisitos no cumplidos';
        blocked.push(sectionData);
      }
    }

    res.json({
      student: {
        name: student.name,
        code: student.studentCode,
        semester,
        career: student.career
      },
      eligible,
      blocked,
      summary: { eligible: eligible.length, blocked: blocked.length }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/sections/enroll
 * Body: { sectionIds: [...] }
 * Student enrolls in selected sections
 */
exports.enrollInSections = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { sectionIds } = req.body;
    if (!sectionIds?.length) return res.status(400).json({ message: 'Selecciona al menos una sección.' });

    const Student = require('../models/Student');
    const student = await Student.findOne({ userId });
    if (!student) return res.status(404).json({ message: 'Perfil no encontrado.' });

    const sections = await Section.find({ _id: { $in: sectionIds }, status: 'activa' })
      .populate('courseId', 'code name credits prerequisites semester')
      .populate('teacherId', 'name')
      .populate('classroomId', 'code');

    const approvedIds = (student.approvedCourses || [])
      .filter(ac => ac.grade >= 11).map(ac => ac.courseId?.toString());
    const errors = [];
    const conflicts = [];
    let totalCredits = 0;
    const confirmedSlots = [];

    // Validate each section
    for (const section of sections) {
      const course = section.courseId;
      // Check capacity
      if (section.currentEnrolled >= section.maxCapacity) {
        errors.push(`${course.code}-${section.sectionCode}: Sin cupo disponible`);
        continue;
      }
      // Check prerequisites
      if (course.prerequisites?.length) {
        const unmet = course.prerequisites.filter(p => !approvedIds.includes(p.toString()));
        if (unmet.length) {
          errors.push(`${course.code}: Prerrequisitos no cumplidos`);
          continue;
        }
      }
      // Check time conflicts
      for (const slot of section.scheduleSlots) {
        const conflict = confirmedSlots.find(cs =>
          cs.day === slot.day && cs.startTime < slot.endTime && cs.endTime > slot.startTime
        );
        if (conflict) {
          conflicts.push(`${course.code}-${section.sectionCode} cruza con ${conflict.courseCode}-${conflict.sectionCode} el ${slot.day} ${slot.startTime}`);
        }
        confirmedSlots.push({
          ...slot, courseCode: course.code, sectionCode: section.sectionCode
        });
      }
      totalCredits += course.credits;
    }

    if (errors.length || conflicts.length) {
      return res.status(400).json({
        message: 'Errores de validación',
        errors, conflicts, totalCredits
      });
    }

    // Create enrollment
    const selectedSections = sections.map(s => ({
      sectionId: s._id, courseId: s.courseId._id
    }));
    const scheduleSnapshot = [];
    for (const s of sections) {
      for (const slot of s.scheduleSlots) {
        scheduleSnapshot.push({
          sectionId: s._id,
          courseCode: s.courseId.code,
          courseName: s.courseId.name,
          sectionCode: s.sectionCode,
          teacherName: s.teacherId?.name,
          classroomCode: s.classroomId?.code,
          day: slot.day,
          startTime: slot.startTime,
          endTime: slot.endTime
        });
      }
    }

    const enrollment = await Enrollment.findOneAndUpdate(
      { studentId: student._id, semester: req.body.semester || '2026-1' },
      {
        selectedCourses: sections.map(s => s.courseId._id),
        selectedSections,
        totalCredits,
        status: 'confirmada',
        scheduleSnapshot,
        validatedAt: new Date()
      },
      { upsert: true, new: true }
    );

    // Update section enrollment counts (batch)
    await Section.bulkWrite(sections.map(s => ({
      updateOne: {
        filter: { _id: s._id },
        update: {
          $addToSet: { enrolledStudents: student._id },
          $inc: { currentEnrolled: 1 }
        }
      }
    })));

    res.json({
      message: 'Matrícula confirmada',
      enrollment: { _id: enrollment._id, totalCredits, sections: sections.length },
      schedule: scheduleSnapshot
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/sections/suggest
 * Body: { courseIds: [...] }
 * Suggests best schedule combination for the student
 */
exports.suggestSchedule = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { courseIds } = req.body;

    const Student = require('../models/Student');
    const student = await Student.findOne({ userId });
    if (!student) return res.status(404).json({ message: 'Perfil no encontrado.' });

    // Get all active sections for requested courses
    const sections = await Section.find({
      courseId: { $in: courseIds },
      status: 'activa'
    })
      .populate('courseId', 'code name credits type semester')
      .populate('teacherId', 'name')
      .populate('classroomId', 'code building');

    // Group sections by course
    const sectionsByCourse = {};
    for (const s of sections) {
      const cid = s.courseId._id.toString();
      if (!sectionsByCourse[cid]) sectionsByCourse[cid] = [];
      if (s.currentEnrolled < s.maxCapacity) {
        sectionsByCourse[cid].push(s);
      }
    }

    // Greedy: pick one section per course with no time conflicts
    const bestCombo = [];
    const usedSlots = [];
    const pref = student.preferredShift || 'manana';

    for (const courseId of courseIds) {
      const available = sectionsByCourse[courseId] || [];
      // Sort by preference: prefer student's shift, then by availability
      const sorted = available.sort((a, b) => {
        const aScore = scoreSectionForStudent(a, pref);
        const bScore = scoreSectionForStudent(b, pref);
        return bScore - aScore;
      });

      let picked = null;
      for (const sec of sorted) {
        const hasConflict = sec.scheduleSlots.some(slot =>
          usedSlots.some(us => us.day === slot.day && us.startTime < slot.endTime && us.endTime > slot.startTime)
        );
        if (!hasConflict) {
          picked = sec;
          sec.scheduleSlots.forEach(sl => usedSlots.push({ ...sl }));
          break;
        }
      }

      if (picked) {
        bestCombo.push({
          sectionId: picked._id,
          sectionCode: picked.sectionCode,
          courseCode: picked.courseId.code,
          courseName: picked.courseId.name,
          credits: picked.courseId.credits,
          teacher: picked.teacherId?.name,
          classroom: picked.classroomId?.code,
          scheduleSlots: picked.scheduleSlots,
          enrolled: picked.currentEnrolled,
          capacity: picked.maxCapacity
        });
      }
    }

    res.json({
      suggested: bestCombo,
      totalCredits: bestCombo.reduce((s, c) => s + c.credits, 0),
      totalCourses: bestCombo.length,
      requested: courseIds.length,
      fulfilled: bestCombo.length === courseIds.length
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/sections/pending-review
 * Returns sections below minimum enrollment with suggested actions for admin.
 */
exports.getPendingReview = async (req, res, next) => {
  try {
    const { career, semester } = req.query;
    const filter = { status: { $in: ['pendiente', 'activa'] } };
    if (career) filter.career = career;
    if (semester) filter.semester = semester;

    const sections = await Section.find(filter)
      .populate('courseId', 'code name credits type minStudentsPerSection')
      .populate('teacherId', 'name')
      .populate('classroomId', 'code')
      .sort({ courseSemester: 1, 'courseId.code': 1 });

    const review = [];
    for (const section of sections) {
      const minRequired = section.minStudents || section.courseId?.minStudentsPerSection || 10;
      const belowMinimum = section.currentEnrolled < minRequired;
      if (!belowMinimum && section.status === 'activa') continue;

      // Find other sections of same course this semester
      const siblingSections = await Section.find({
        _id: { $ne: section._id },
        courseId: section.courseId._id,
        semester: section.semester,
        status: 'activa'
      }).populate('classroomId', 'code');

      const totalSiblingCapacity = siblingSections.reduce((s, sec) => s + (sec.maxCapacity - sec.currentEnrolled), 0);
      const canAbsorb = section.currentEnrolled <= totalSiblingCapacity;

      review.push({
        sectionId: section._id,
        courseCode: section.courseId?.code,
        courseName: section.courseId?.name,
        sectionCode: section.sectionCode,
        teacher: section.teacherId?.name,
        classroom: section.classroomId?.code,
        currentEnrolled: section.currentEnrolled,
        maxCapacity: section.maxCapacity,
        minRequired,
        status: section.status,
        belowMinimum,
        hasSiblingSections: siblingSections.length > 0,
        availableSlotsInSiblings: totalSiblingCapacity,
        canMerge: canAbsorb && siblingSections.length > 0,
        suggestedAction: !belowMinimum
          ? 'Sección activa y con matrícula suficiente'
          : !siblingSections.length
            ? 'Esperar a que se alcance el mínimo de estudiantes'
            : canAbsorb
              ? `Fusionar ${section.currentEnrolled} estudiante(s) en secciones hermanas (${totalSiblingCapacity} cupos disponibles)`
              : `Mantener sección — la demanda total (${section.currentEnrolled}) excede los cupos disponibles en otras secciones (${totalSiblingCapacity})`,
        siblingSections: siblingSections.map(s => ({
          sectionId: s._id,
          sectionCode: s.sectionCode,
          classroom: s.classroomId?.code,
          enrolled: s.currentEnrolled,
          capacity: s.maxCapacity,
          available: s.maxCapacity - s.currentEnrolled
        }))
      });
    }

    res.json({
      count: review.length,
      pendingCount: review.filter(r => r.belowMinimum).length,
      activeCount: review.filter(r => !r.belowMinimum).length,
      sections: review
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/sections/merge
 * Body: { sourceSectionId, targetSectionId }
 * Merges students from source (under-enrolled) into target section, then closes source.
 */
exports.mergeSections = async (req, res, next) => {
  try {
    const { sourceSectionId, targetSectionId } = req.body;
    if (!sourceSectionId || !targetSectionId) {
      return res.status(400).json({ message: 'Debe especificar sección origen y destino.' });
    }

    const [source, target] = await Promise.all([
      Section.findById(sourceSectionId).populate('courseId', 'code name'),
      Section.findById(targetSectionId).populate('courseId', 'code name')
    ]);

    if (!source) return res.status(404).json({ message: 'Sección origen no encontrada.' });
    if (!target) return res.status(404).json({ message: 'Sección destino no encontrada.' });

    const availableSpots = target.maxCapacity - target.currentEnrolled;
    if (source.currentEnrolled > availableSpots) {
      return res.status(400).json({
        message: `La sección destino solo tiene ${availableSpots} cupos disponibles, pero hay ${source.currentEnrolled} estudiantes para reubicar.`
      });
    }

    // Move students from source to target
    await Section.findByIdAndUpdate(target._id, {
      $addToSet: { enrolledStudents: { $each: source.enrolledStudents } },
      $inc: { currentEnrolled: source.currentEnrolled }
    });

    // Close source section
    await Section.findByIdAndUpdate(source._id, {
      status: 'cerrada',
      $set: { enrolledStudents: [] },
      currentEnrolled: 0
    });

    res.json({
      message: `Sección ${source.sectionCode} fusionada en ${target.sectionCode}. ${source.currentEnrolled} estudiante(s) reubicado(s).`,
      source: { _id: source._id, sectionCode: source.sectionCode, status: 'cerrada' },
      target: { _id: target._id, sectionCode: target.sectionCode, currentEnrolled: target.currentEnrolled + source.currentEnrolled }
    });
  } catch (error) {
    next(error);
  }
};

// ─── Helpers ───

function getEligibleTeachersForCourse(course, teachers) {
  const courseId = course._id.toString();
  return teachers.filter(t => {
    // Check assignedTeachers first
    if (course.assignedTeachers?.length) {
      return course.assignedTeachers.some(at => at.toString() === t._id.toString());
    }
    // Fallback to specializations
    if (t.specializations?.length) {
      return t.specializations.some(s => (s._id || s).toString() === courseId);
    }
    return false;
  });
}

function scoreSectionForStudent(section, preferredShift) {
  let score = 0;
  for (const slot of section.scheduleSlots) {
    const hour = parseInt(slot.startTime.split(':')[0], 10);
    if (preferredShift === 'manana' && hour < 13) score += 10;
    else if (preferredShift === 'tarde' && hour >= 14 && hour < 19) score += 10;
    else if (preferredShift === 'noche' && hour >= 19) score += 10;
  }
  // Prefer sections with more available space
  score += (section.maxCapacity - section.currentEnrolled);
  return score;
}

function groupSectionsBySemester(sections, courses) {
  const grouped = {};
  for (const s of sections) {
    const sem = s.courseSemester || 1;
    if (!grouped[sem]) grouped[sem] = [];
    grouped[sem].push({
      sectionCode: s.sectionCode,
      courseId: s.courseId,
      status: s.status,
      slots: s.scheduleSlots?.length || 0
    });
  }
  return grouped;
}
