/**
 * Motor CSP (Constraint Satisfaction Problem) para generación de horarios académicos.
 * 
 * Implementa:
 * - Backtracking con ordenamiento dinámico de variables
 * - Heurística MRV (Minimum Remaining Values)
 * - Forward Checking para propagación de restricciones
 * - Timeout de 30 segundos
 * - Generación de MÚLTIPLES soluciones para comparación por scoring
 * - Integración COMPLETA con checkAllConstraints (RD-01 a RD-11)
 * - Carga de InstitutionalPolicy para restricciones institucionales
 * 
 * Restricciones implementadas:
 * - RD-01: No solapamiento de docente
 * - RD-02: No solapamiento de aula
 * - RD-03: No solapamiento de estudiante (mismo semestre/carrera)
 * - RD-04: Capacidad del aula >= alumnos del curso (aforo)
 * - RD-05: Tipo de aula = tipo de curso
 * - RD-06: Disponibilidad del docente (horaria + días libres)
 * - RD-07: Disponibilidad del aula (horario por franjas)
 * - RD-08: Carga máxima docente (cursos + horas semanales TC/PH)
 * - RD-09: Horario dentro de ventana institucional
 * - RD-10: Máximo de horas continuas por docente
 * - RD-11: Distribución de sesiones en días diferentes
 */

const { checkAllConstraints, checkRD05, checkRD04 } = require('./constraints');
const { selectVariableMRV, orderDomainValues } = require('./heuristics');
const { validateSolution } = require('./validator');
const { evaluateSolution, detectUnsatisfiedConditions } = require('./scoring');

const DAYS = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
const TIME_SLOTS = [
  { start: '07:00', end: '08:00' },
  { start: '08:00', end: '09:00' },
  { start: '09:00', end: '10:00' },
  { start: '10:00', end: '11:00' },
  { start: '11:00', end: '12:00' },
  { start: '12:00', end: '13:00' },
  { start: '13:00', end: '14:00' },
  { start: '14:00', end: '15:00' },
  { start: '15:00', end: '16:00' },
  { start: '16:00', end: '17:00' },
  { start: '17:00', end: '18:00' },
  { start: '18:00', end: '19:00' },
  { start: '19:00', end: '20:00' },
  { start: '20:00', end: '21:00' },
  { start: '21:00', end: '22:00' },
];

/**
 * Generate all possible assignment slots (day × timeSlot)
 */
function generateSlots() {
  const slots = [];
  for (const day of DAYS) {
    for (const time of TIME_SLOTS) {
      slots.push({ day, startTime: time.start, endTime: time.end });
    }
  }
  return slots;
}

/**
 * Build variables: one for each session of each course
 * A course with sessionsPerWeek=2 generates 2 variables
 */
function buildVariables(courses) {
  const variables = [];
  for (const course of courses) {
    const sessions = course.sessionsPerWeek || 2;
    for (let s = 0; s < sessions; s++) {
      variables.push({
        id: `${course._id}_s${s}`,
        courseId: course._realCourseId || course._id,
        course,
        sessionIndex: s,
        type: course.type || 'teorico',
        _realCourseId: course._realCourseId || null,
        _sectionCode: course._sectionCode || null,
        _forcedTeacherId: course._forcedTeacherId || null,
        domain: [] // will be filled with possible (teacher, classroom, slot) tuples
      });
    }
  }
  return variables;
}

/**
 * Build domain for each variable: all valid (teacher, classroom, slot) combinations
 * Pre-filters by:
 *   - RD-05: classroom type must match course type
 *   - RD-04: classroom capacity >= course maxStudents
 *   - RD-06: teacher availability (horaria + días libres)
 *   - RD-09: slot within institutional schedule
 */
function buildDomains(variables, teachers, classrooms, policy) {
  let slots = generateSlots();

  // Pre-filter slots by institutional schedule (RD-09)
  if (policy?.allowedSchedule) {
    const { startTime, endTime, activeDays, blockedTimeSlots } = policy.allowedSchedule;
    slots = slots.filter(slot => {
      if (activeDays && activeDays.length > 0 && !activeDays.includes(slot.day)) return false;
      if (startTime && slot.startTime < startTime) return false;
      if (endTime && slot.endTime > endTime) return false;
      // RD-12: Filter blocked time slots (e.g., lunch break 13:00-14:00)
      if (blockedTimeSlots && blockedTimeSlots.length > 0) {
        for (const blocked of blockedTimeSlots) {
          if (slot.startTime < blocked.end && slot.endTime > blocked.start) {
            return false; // Slot overlaps with a blocked period
          }
        }
      }
      return true;
    });
  }

  for (const variable of variables) {
    const domain = [];
    
    // Find eligible teachers (those who can teach this course)
    const forcedTeacherId = variable.course?._forcedTeacherId;
    const eligibleTeachers = teachers.filter(t => {
      // Section mode: forced teacher assignment
      if (forcedTeacherId) {
        return t._id.toString() === forcedTeacherId;
      }
      if (t.specializations && t.specializations.length > 0) {
        // Use real course ID if available (section mode)
        const realCourseId = variable.course?._realCourseId
          ? variable.course._realCourseId.toString()
          : (variable.courseId._id ? variable.courseId._id.toString() : variable.courseId.toString());
        return t.specializations.some(s => {
          const specId = s._id ? s._id.toString() : s.toString();
          return specId === realCourseId;
        });
      }
      return true; // If no specializations defined, teacher can teach anything
    });

    // Find eligible classrooms: RD-05 (type match) + RD-04 (capacity)
    const eligibleClassrooms = classrooms.filter(c => {
      if (!checkRD05(variable.course, c, policy)) return false;
      if (!checkRD04(variable.course, c)) return false;
      return true;
    });

    for (const teacher of eligibleTeachers) {
      for (const classroom of eligibleClassrooms) {
        for (const slot of slots) {
          // Check teacher availability (including free days)
          if (isTeacherAvailable(teacher, slot)) {
            // Check classroom availability schedule
            if (isClassroomAvailable(classroom, slot)) {
              domain.push({
                teacherId: teacher._id,
                teacher,
                classroomId: classroom._id,
                classroom,
                ...slot
              });
            }
          }
        }
      }
    }

    // Shuffle domain for fairness (RS-01: equidad)
    shuffleArray(domain);
    variable.domain = domain;
  }
}

/**
 * Check if teacher is available at the given slot.
 * Validates both availability windows AND free days.
 */
function isTeacherAvailable(teacher, slot) {
  // Check free days first (RD-06 part: días libres)
  if (teacher.freeDays && teacher.freeDays.length > 0) {
    if (teacher.freeDays.includes(slot.day)) return false;
  }

  // Check availability windows
  if (!teacher.availability || teacher.availability.length === 0) {
    return true; // No restrictions means always available
  }
  return teacher.availability.some(a => 
    a.day === slot.day && a.startTime <= slot.startTime && a.endTime >= slot.endTime
  );
}

/**
 * Check if classroom is available at the given slot.
 * Validates the availabilitySchedule if defined.
 */
function isClassroomAvailable(classroom, slot) {
  if (!classroom.available) return false;
  if (!classroom.availabilitySchedule || classroom.availabilitySchedule.length === 0) {
    return true; // No schedule = always available when available=true
  }
  return classroom.availabilitySchedule.some(s =>
    s.day === slot.day && s.startTime <= slot.startTime && s.endTime >= slot.endTime
  );
}

/**
 * Fisher-Yates shuffle for array randomization
 */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Main CSP Solver with Backtracking + MRV + Forward Checking
 * Now uses checkAllConstraints for full validation.
 */
function solve(variables, assignments, courses, policy, startTime, timeout = 30000) {
  // Timeout check
  if (Date.now() - startTime > timeout) {
    return null; // Timeout
  }

  // All variables assigned — solution found
  if (assignments.length === variables.length) {
    return assignments.slice();
  }

  // MRV: Select variable with fewest remaining values
  const unassigned = variables.filter(v => !assignments.find(a => a.id === v.id));
  const variable = selectVariableMRV(unassigned, assignments);

  if (!variable || variable.domain.length === 0) {
    return null; // Dead end
  }

  // Order domain values using heuristic
  const orderedDomain = orderDomainValues(variable, assignments);

  for (const value of orderedDomain) {
    const assignment = {
      id: variable.id,
      courseId: variable.courseId,
      course: variable.course,
      sessionIndex: variable.sessionIndex,
      teacherId: value.teacherId,
      classroomId: value.classroomId,
      day: value.day,
      startTime: value.startTime,
      endTime: value.endTime,
      hoursPerSession: variable.course.hoursPerSession || 1,
      classroomCode: value.classroom?.code || '',
      teacherName: value.teacher?.name || '',
      classroomName: value.classroom?.name || '',
      _realCourseId: variable._realCourseId || null,
      _sectionCode: variable._sectionCode || null
    };

    // ── Full constraint check using checkAllConstraints ──
    const result = checkAllConstraints(assignment, assignments, {
      course: variable.course,
      teacher: value.teacher,
      classroom: value.classroom,
      courses,
      policy
    });

    if (result.valid) {
      assignments.push(assignment);

      const solution = solve(variables, assignments, courses, policy, startTime, timeout);
      if (solution) return solution;

      assignments.pop(); // Backtrack
    }
  }

  return null; // No valid assignment found for this variable
}

/**
 * Run CSP multiple times with different random shuffles to generate alternatives.
 * Returns the best solution + up to N alternatives sorted by scoring.
 * 
 * @param {Array} courses - Active courses
 * @param {Array} teachers - Active teachers
 * @param {Array} classrooms - Available classrooms
 * @param {Array} preferences - User preferences
 * @param {number} numSolutions - Target number of solutions
 * @param {Object|null} policy - InstitutionalPolicy document (optional)
 */
function runCSPMultiple(courses, teachers, classrooms, preferences = [], numSolutions = 4, policy = null) {
  const solutions = [];
  const startTime = Date.now();
  const maxTimePerAttempt = 8000; // 8 seconds per attempt
  const maxTotalTime = 30000;     // 30 seconds total

  for (let attempt = 0; attempt < numSolutions * 2; attempt++) {
    if (Date.now() - startTime > maxTotalTime) break;
    if (solutions.length >= numSolutions) break;

    try {
      const variables = buildVariables(courses);
      buildDomains(variables, teachers, classrooms, policy);

      // Check for empty domains
      const emptyDomainVars = variables.filter(v => v.domain.length === 0);
      if (emptyDomainVars.length > 0) {
        // Only report on first attempt
        if (attempt === 0) {
          return {
            success: false,
            conflicts: emptyDomainVars.map(v => ({
              type: 'infraestructura',
              description: `No hay combinación válida (docente+aula+franja) para "${v.course.name}" (sesión ${v.sessionIndex + 1}).`,
              severity: 'alta'
            }))
          };
        }
        continue;
      }

      const solution = solve(variables, [], courses, policy, Date.now(), maxTimePerAttempt);

      if (solution) {
        const assignments = solution.map(a => ({
          courseId: a.courseId,
          teacherId: a.teacherId,
          classroomId: a.classroomId,
          day: a.day,
          startTime: a.startTime,
          endTime: a.endTime,
          hoursPerSession: a.hoursPerSession || 1
        }));

        // Check if this solution is sufficiently different from existing ones
        const isDuplicate = solutions.some(existing => {
          let same = 0;
          for (const a of assignments) {
            if (existing.assignments.some(e => 
              e.courseId?.toString() === a.courseId?.toString() &&
              e.day === a.day && e.startTime === a.startTime
            )) {
              same++;
            }
          }
          return same / assignments.length > 0.85; // More than 85% same = duplicate
        });

        if (!isDuplicate) {
          // Evaluate with scoring module (pass policy for dynamic weights)
          const score = evaluateSolution(assignments, courses, teachers, classrooms, preferences, policy);
          solutions.push({ assignments, score });
        }
      }
    } catch (error) {
      console.error(`CSP attempt ${attempt} failed:`, error.message);
    }
  }

  if (solutions.length === 0) {
    return {
      success: false,
      conflicts: [{
        type: 'docente',
        description: 'No se encontró solución factible con las restricciones actuales. Considere agregar más docentes, aulas o flexibilizar horarios.',
        severity: 'alta'
      }]
    };
  }

  // Sort by overall score (best first)
  solutions.sort((a, b) => b.score.overall - a.score.overall);

  const best = solutions[0];
  const alternatives = solutions.slice(1);
  const validation = validateSolution(best.assignments);
  const unsatisfiedConditions = detectUnsatisfiedConditions(best.score, preferences);

  return {
    success: true,
    assignments: best.assignments,
    qualityScore: best.score.overall,
    constraintsFulfilled: best.score.validity,
    preferencesScore: best.score.preferencesScore,
    resourceUsage: best.score.resourceUsage,
    loadDistribution: best.score.loadDistribution,
    optimization: best.score.optimization,
    scoringBreakdown: best.score.breakdown,
    conflicts: validation.warnings || [],
    unsatisfiedConditions,
    alternatives: alternatives.map((alt, idx) => ({
      assignments: alt.assignments,
      qualityScore: alt.score.overall,
      constraintsFulfilled: alt.score.validity,
      preferencesScore: alt.score.preferencesScore,
      resourceUsage: alt.score.resourceUsage,
      optimization: alt.score.optimization,
      label: `Alternativa ${idx + 1}`
    }))
  };
}

/**
 * Main entry point for CSP execution (backwards compatible)
 */
function runCSP(courses, teachers, classrooms, preferences, policy = null) {
  return runCSPMultiple(courses, teachers, classrooms, preferences, 1, policy);
}

module.exports = { runCSP, runCSPMultiple, generateSlots, DAYS, TIME_SLOTS };
