/**
 * Constraints Module — Restricciones duras y blandas del motor CSP.
 * 
 * Jerarquía de prioridad:
 *   1. INSTITUCIONAL  (políticas de la universidad — MÁXIMA prioridad)
 *   2. DISPONIBILIDAD (docente y aula — restricciones duras)
 *   3. PREFERENCIAS   (docente, luego estudiante — restricciones blandas)
 * 
 * Restricciones implementadas:
 *   RD-01: No solapamiento de docente
 *   RD-02: No solapamiento de aula
 *   RD-03: No solapamiento de estudiante
 *   RD-04: Capacidad de aula >= alumnos del curso (aforo)
 *   RD-05: Tipo de aula = tipo de curso
 *   RD-06: Disponibilidad del docente (horaria + días libres)
 *   RD-07: Disponibilidad del aula (horario de aula)
 *   RD-08: Carga máxima del docente (cursos y horas semanales)
 *   RD-09: Horario dentro de ventana institucional
 *   RD-10: Máximo de horas continuas por docente
 *   RD-11: Distribución de sesiones en días diferentes
 *   RD-12: Bloques horarios bloqueados
 *   RD-13: Preferencias de turno para docentes PH
 *   RD-14: Límite de créditos por semestre (12-25)
 */

/**
 * RD-01: No solapamiento de docente
 * Un docente no puede estar asignado a dos cursos al mismo tiempo.
 */
function checkRD01(assignment, existingAssignments) {
  return !existingAssignments.some(a =>
    a.teacherId.toString() === assignment.teacherId.toString() &&
    a.day === assignment.day &&
    timesOverlap(a.startTime, a.endTime || addHours(a.startTime, 1),
                 assignment.startTime, assignment.endTime || addHours(assignment.startTime, 1))
  );
}

/**
 * RD-02: No solapamiento de aula
 * Un aula no puede ser asignada a dos cursos al mismo tiempo.
 */
function checkRD02(assignment, existingAssignments) {
  return !existingAssignments.some(a =>
    a.classroomId.toString() === assignment.classroomId.toString() &&
    a.day === assignment.day &&
    timesOverlap(a.startTime, a.endTime || addHours(a.startTime, 1),
                 assignment.startTime, assignment.endTime || addHours(assignment.startTime, 1))
  );
}

/**
 * RD-03: No solapamiento de estudiante
 * Cursos del mismo semestre y carrera no deben solaparse.
 */
function checkRD03(assignment, existingAssignments, courses) {
  if (!courses) return true;
  const assignedCourse = courses.find(c =>
    (c._id || c).toString() === assignment.courseId.toString()
  );
  if (!assignedCourse) return true;

  return !existingAssignments.some(a => {
    if (a.courseId.toString() === assignment.courseId.toString()) return false;
    const otherCourse = courses.find(c =>
      (c._id || c).toString() === a.courseId.toString()
    );
    if (!otherCourse) return false;
    // Same semester + same career = potential student overlap
    const sameCareer = assignedCourse.career?.toString() === otherCourse.career?.toString();
    const sameSemester = assignedCourse.semester === otherCourse.semester;
    if (!sameCareer || !sameSemester) return false;
    return a.day === assignment.day &&
      timesOverlap(a.startTime, a.endTime || addHours(a.startTime, 1),
                   assignment.startTime, assignment.endTime || addHours(assignment.startTime, 1));
  });
}

/**
 * RD-04: Capacidad de aula (aforo)
 * El aula debe tener capacidad >= alumnos del curso.
 */
function checkRD04(course, classroom) {
  if (!course || !classroom) return true;
  const maxStudents = course.maxStudents || 40;
  return classroom.capacity >= maxStudents;
}

/**
 * RD-05: Tipo de infraestructura
 * El tipo de aula debe coincidir con el tipo de curso.
 * Aulas virtuales pueden usarse para cursos teóricos si la política lo permite.
 */
function checkRD05(course, classroom, policy) {
  if (!course || !classroom) return true;
  if (course.type === classroom.type) return true;
  // Aula virtual puede servir para teórico si la política lo permite
  if (classroom.type === 'aula_virtual' && course.type === 'teorico') {
    return policy?.classroomRules?.allowVirtualClassrooms !== false;
  }
  return false;
}

/**
 * RD-06: Disponibilidad del docente
 * La asignación debe estar dentro de la disponibilidad del docente
 * y NO en sus días libres.
 */
function checkRD06_TeacherAvailability(assignment, teacher) {
  if (!teacher) return true;
  
  // Check free days
  if (teacher.freeDays && teacher.freeDays.includes(assignment.day)) {
    return false;
  }

  // Check availability windows
  if (teacher.availability && teacher.availability.length > 0) {
    const dayAvail = teacher.availability.filter(a => a.day === assignment.day);
    if (dayAvail.length === 0) return false;
    const assignStart = assignment.startTime;
    const assignEnd = assignment.endTime || addHours(assignStart, 1);
    return dayAvail.some(a => a.startTime <= assignStart && a.endTime >= assignEnd);
  }

  return true; // No availability = no restriction
}

/**
 * RD-07: Disponibilidad del aula
 * Si el aula tiene un schedule de disponibilidad, la asignación debe caer dentro.
 */
function checkRD07_ClassroomAvailability(assignment, classroom) {
  if (!classroom) return true;
  if (!classroom.available) return false;
  if (!classroom.availabilitySchedule || classroom.availabilitySchedule.length === 0) return true;

  const daySlots = classroom.availabilitySchedule.filter(s => s.day === assignment.day);
  if (daySlots.length === 0) return false;
  const assignStart = assignment.startTime;
  const assignEnd = assignment.endTime || addHours(assignStart, 1);
  return daySlots.some(s => s.startTime <= assignStart && s.endTime >= assignEnd);
}

/**
 * RD-08: Carga máxima del docente (cursos y horas semanales)
 * Valida: maxCourses y maxWeeklyHours según contractType.
 */
function checkRD08_TeacherLoad(assignment, existingAssignments, teacher, policy) {
  if (!teacher) return true;

  // --- Check max courses ---
  const maxCourses = teacher.maxCourses ||
    (policy?.teacherLimits?.[teacher.contractType === 'por_horas' ? 'maxCoursesPartTime' : 'maxCoursesFullTime']) ||
    3;

  const teacherCourses = new Set(
    existingAssignments
      .filter(a => a.teacherId.toString() === assignment.teacherId.toString())
      .map(a => a.courseId.toString())
  );
  teacherCourses.add(assignment.courseId.toString());
  if (teacherCourses.size > maxCourses) return false;

  // --- Check max weekly hours ---
  // Usa teachingHours (horas de enseñanza reales) si está definido,
  // de lo contrario cae a maxWeeklyHours o al límite del policy.
  const maxHours = teacher.teachingHours ||
    teacher.maxWeeklyHours ||
    (policy?.teacherLimits?.[teacher.contractType === 'por_horas' ? 'maxWeeklyHoursPartTime' : 'maxWeeklyHoursFullTime']) ||
    40;

  const hoursPerSession = assignment.hoursPerSession || 1;
  const currentHours = existingAssignments
    .filter(a => a.teacherId.toString() === assignment.teacherId.toString())
    .reduce((sum, a) => sum + (a.hoursPerSession || 1), 0);

  if (currentHours + hoursPerSession > maxHours) return false;

  return true;
}

/**
 * RD-09: Horario dentro de ventana institucional
 * La asignación debe estar dentro del horario permitido por la política.
 */
function checkRD09_InstitutionalSchedule(assignment, policy) {
  if (!policy?.allowedSchedule) return true;
  
  const { startTime, endTime, activeDays } = policy.allowedSchedule;
  
  // Check allowed day
  if (activeDays && activeDays.length > 0 && !activeDays.includes(assignment.day)) {
    return false;
  }
  
  // Check time window
  if (startTime && assignment.startTime < startTime) return false;
  const assignEnd = assignment.endTime || addHours(assignment.startTime, 1);
  if (endTime && assignEnd > endTime) return false;
  
  return true;
}

/**
 * RD-10: Máximo de horas continuas por docente
 * Evita que un docente dicte más de N horas seguidas.
 */
function checkRD10_ContinuousHours(assignment, existingAssignments, policy) {
  const maxContinuous = policy?.teacherLimits?.maxContinuousHours || 4;
  
  const sameDayAssignments = existingAssignments
    .filter(a => 
      a.teacherId.toString() === assignment.teacherId.toString() &&
      a.day === assignment.day
    )
    .map(a => ({
      start: timeToMinutes(a.startTime),
      end: timeToMinutes(a.endTime || addHours(a.startTime, a.hoursPerSession || 1))
    }));

  const newStart = timeToMinutes(assignment.startTime);
  const newEnd = timeToMinutes(assignment.endTime || addHours(assignment.startTime, assignment.hoursPerSession || 1));
  sameDayAssignments.push({ start: newStart, end: newEnd });
  sameDayAssignments.sort((a, b) => a.start - b.start);

  // Find consecutive blocks
  let continuousMinutes = 0;
  let blockEnd = -1;
  for (const slot of sameDayAssignments) {
    if (slot.start <= blockEnd) {
      continuousMinutes += slot.end - Math.max(slot.start, blockEnd);
      blockEnd = Math.max(blockEnd, slot.end);
    } else {
      continuousMinutes = slot.end - slot.start;
      blockEnd = slot.end;
    }
    if (continuousMinutes > maxContinuous * 60) return false;
  }
  return true;
}

/**
 * RD-11: Distribución de sesiones en días diferentes
 * Las sesiones del mismo curso deben ser en días distintos.
 */
function checkRD11_DayDistribution(assignment, existingAssignments, policy) {
  const maxPerDay = policy?.courseDistribution?.maxSessionsPerCoursePerDay || 1;
  
  const sameDaySameCourse = existingAssignments.filter(a =>
    a.courseId.toString() === assignment.courseId.toString() &&
    a.day === assignment.day
  );

  return sameDaySameCourse.length < maxPerDay;
}

/**
 * RD-12: Bloques horarios bloqueados (almuerzo, mantenimiento, etc.)
 * Ninguna asignación puede caer dentro de un bloque horario bloqueado
 * definido en la política institucional.
 */
function checkRD12_BlockedTimeSlots(assignment, policy) {
  if (!policy?.allowedSchedule?.blockedTimeSlots) return true;
  const blockedSlots = policy.allowedSchedule.blockedTimeSlots;
  if (!blockedSlots || blockedSlots.length === 0) return true;

  const assignStart = assignment.startTime;
  const assignEnd = assignment.endTime || addHours(assignStart, assignment.hoursPerSession || 1);

  for (const blocked of blockedSlots) {
    if (timesOverlap(assignStart, assignEnd, blocked.start, blocked.end)) {
      return false;
    }
  }
  return true;
}

// ═══════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════

/**
 * Check if two time ranges overlap
 */
function timesOverlap(start1, end1, start2, end2) {
  return start1 < end2 && start2 < end1;
}

/**
 * Add hours to a time string "HH:MM"
 */
function addHours(timeStr, hours = 1) {
  const [h, m] = timeStr.split(':').map(Number);
  const newH = h + hours;
  return `${String(newH).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/**
 * Convert "HH:MM" to minutes since midnight
 */
function timeToMinutes(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + (m || 0);
}

// ═══════════════════════════════════════════
// UNIFIED CHECK
// ═══════════════════════════════════════════

/**
 * Check ALL hard constraints for a proposed assignment.
 * Uses the priority hierarchy:
 *   1. Institutional (RD-09)
 *   2. Hard constraints (RD-01, RD-02, RD-03, RD-04, RD-05)
 *   3. Availability (RD-06, RD-07)
 *   4. Load limits (RD-08, RD-10)
 *   5. Distribution (RD-11)
 * 
 * @param {Object} assignment - The proposed assignment
 * @param {Array} existingAssignments - Already assigned slots
 * @param {Object} options - { course, teacher, classroom, courses, policy }
 * @returns {{ valid: boolean, violations: string[] }}
 */
/**
 * RD-14: Límite de créditos por semestre
 * La suma de créditos de todos los cursos de un mismo semestre/carrera
 * debe estar dentro del rango configurado (mín 12, máx 25).
 */
function checkRD14_CreditLimit(courses, policy) {
  if (!courses || courses.length === 0) return true;
  if (!policy?.enrollmentRules) return true;

  const minCredits = policy.enrollmentRules.minCreditsPerSemester || 12;
  const maxCredits = policy.enrollmentRules.maxCreditsPerSemester || 25;

  // Group courses by semester
  const bySemester = {};
  for (const c of courses) {
    const sem = c.semester || 1;
    if (!bySemester[sem]) bySemester[sem] = [];
    bySemester[sem].push(c);
  }

  for (const [sem, semCourses] of Object.entries(bySemester)) {
    const totalCredits = semCourses.reduce((sum, c) => sum + (c.credits || 0), 0);
    if (totalCredits < minCredits || totalCredits > maxCredits) {
      return false;
    }
  }
  return true;
}

/**
 * RD-13: Preferencias de docentes PH como restricción dura
 * Los docentes por horas tienen sus preferencias de turno como obligatorias.
 * Si un PH prefiere un turno específico (no indiferente), solo se le asigna en ese turno.
 */
function checkRD13_PH_Preferences(assignment, teacher, policy, preferences = []) {
  if (!teacher) return true;
  if (teacher.contractType !== 'por_horas') return true;
  const teacherPref = preferences.find(p => p.userId?.toString() === teacher.userId?.toString());
  const effectiveShift = teacher.preferredShift || teacherPref?.preferredShift;
  if (!effectiveShift || effectiveShift === 'indiferente') return true;

  const shifts = policy?.shifts || {
    manana: { start: '07:00', end: '13:00' },
    tarde: { start: '14:00', end: '19:00' },
    noche: { start: '19:00', end: '22:00' }
  };

  for (const [name, range] of Object.entries(shifts)) {
    if (assignment.startTime >= range.start && assignment.startTime < range.end) {
      return name === effectiveShift;
    }
  }
  return false;
}

function checkAllConstraints(assignment, existingAssignments, options = {}) {
  const { course, teacher, classroom, courses, policy, preferences } = options;
  const violations = [];

  // 1. Institutional schedule
  if (!checkRD09_InstitutionalSchedule(assignment, policy)) {
    violations.push('RD-09: Fuera de horario institucional');
  }
  if (!checkRD12_BlockedTimeSlots(assignment, policy)) {
    violations.push('RD-12: Asignación en bloque horario bloqueado (ej: almuerzo)');
  }

  // 2. Hard constraints
  if (!checkRD01(assignment, existingAssignments)) {
    violations.push('RD-01: Cruce de horario del docente');
  }
  if (!checkRD02(assignment, existingAssignments)) {
    violations.push('RD-02: Cruce de aula');
  }
  if (!checkRD03(assignment, existingAssignments, courses)) {
    violations.push('RD-03: Cruce de horario para estudiantes del mismo semestre/carrera');
  }
  if (!checkRD04(course, classroom)) {
    violations.push('RD-04: Aforo del aula insuficiente');
  }
  if (!checkRD05(course, classroom, policy)) {
    violations.push('RD-05: Tipo de aula no compatible con el curso');
  }

  // 3. Availability
  if (!checkRD06_TeacherAvailability(assignment, teacher)) {
    violations.push('RD-06: Docente no disponible en ese horario');
  }
  if (!checkRD07_ClassroomAvailability(assignment, classroom)) {
    violations.push('RD-07: Aula no disponible en ese horario');
  }

  // 4. Load limits
  if (!checkRD08_TeacherLoad(assignment, existingAssignments, teacher, policy)) {
    violations.push('RD-08: Carga máxima del docente excedida');
  }
  if (!checkRD10_ContinuousHours(assignment, existingAssignments, policy)) {
    violations.push('RD-10: Exceso de horas continuas del docente');
  }

  // 5. PH preferences (hard constraint for part-time teachers)
  if (!checkRD13_PH_Preferences(assignment, teacher, policy, preferences)) {
    violations.push('RD-13: Preferencia de turno del docente PH no respetada');
  }

  // 6. Credit limits (called per-assignment; checkRD14_CreditLimit is memoized internally)
  if (courses && policy?.enrollmentRules && !checkRD14_CreditLimit(courses, policy)) {
    const minC = policy?.enrollmentRules?.minCreditsPerSemester ?? 12;
    const maxC = policy?.enrollmentRules?.maxCreditsPerSemester ?? 25;
    violations.push(`RD-14: Créditos del semestre fuera del rango permitido (${minC}-${maxC})`);
  }

  // 7. Distribution
  if (!checkRD11_DayDistribution(assignment, existingAssignments, policy)) {
    violations.push('RD-11: Exceso de sesiones del mismo curso en el mismo día');
  }

  return {
    valid: violations.length === 0,
    violations
  };
}

module.exports = {
  // Individual checks
  checkRD01,
  checkRD02,
  checkRD03,
  checkRD04,
  checkRD05,
  checkRD06: checkRD06_TeacherAvailability,
  checkRD06_TeacherAvailability,
  checkRD07_ClassroomAvailability,
  checkRD08_TeacherLoad,
  checkRD09_InstitutionalSchedule,
  checkRD10_ContinuousHours,
  checkRD11_DayDistribution,
  checkDayDistribution: checkRD11_DayDistribution,
  checkTeacherLoad: checkRD08_TeacherLoad,
  checkRD12_BlockedTimeSlots,
  checkRD13_PH_Preferences,
  checkRD14_CreditLimit,
  // Unified
  checkAllConstraints,
  // Helpers
  timesOverlap,
  addHours,
  timeToMinutes
};
