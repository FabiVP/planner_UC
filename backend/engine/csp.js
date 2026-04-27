/**
 * Motor CSP (Constraint Satisfaction Problem) para generación de horarios académicos.
 * 
 * Implementa:
 * - Backtracking con ordenamiento dinámico de variables
 * - Heurística MRV (Minimum Remaining Values)
 * - Forward Checking para propagación de restricciones
 * - Timeout de 30 segundos
 * 
 * Restricciones implementadas:
 * - RD-01: No solapamiento de docente
 * - RD-02: No solapamiento de aula
 * - RD-03: No solapamiento de estudiante (simplificado)
 * - RD-06: Tipo de aula = tipo de curso
 */

const { checkConstraints, checkRD06 } = require('./constraints');
const { selectVariableMRV, orderDomainValues } = require('./heuristics');
const { validateSolution, calculateQualityScore } = require('./validator');

const DAYS = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
const TIME_SLOTS = [
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
        courseId: course._id,
        course,
        sessionIndex: s,
        type: course.type || 'teorico',
        domain: [] // will be filled with possible (teacher, classroom, slot) tuples
      });
    }
  }
  return variables;
}

/**
 * Build domain for each variable: all valid (teacher, classroom, slot) combinations
 * Filters by RD-06 (classroom type must match course type)
 */
function buildDomains(variables, teachers, classrooms) {
  const slots = generateSlots();

  for (const variable of variables) {
    const domain = [];
    
    // Find eligible teachers (those who can teach this course)
    const eligibleTeachers = teachers.filter(t => {
      if (t.specializations && t.specializations.length > 0) {
        return t.specializations.some(s => {
          const specId = s._id ? s._id.toString() : s.toString();
          const courseId = variable.courseId._id ? variable.courseId._id.toString() : variable.courseId.toString();
          return specId === courseId;
        });
      }
      return true; // If no specializations defined, teacher can teach anything
    });

    // Find eligible classrooms (RD-06: type must match)
    const eligibleClassrooms = classrooms.filter(c => checkRD06(variable.course, c));

    for (const teacher of eligibleTeachers) {
      for (const classroom of eligibleClassrooms) {
        for (const slot of slots) {
          // Check teacher availability
          if (isTeacherAvailable(teacher, slot)) {
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

    // Shuffle domain for fairness (RS-01: equidad)
    shuffleArray(domain);
    variable.domain = domain;
  }
}

/**
 * Check if teacher is available at the given slot
 */
function isTeacherAvailable(teacher, slot) {
  if (!teacher.availability || teacher.availability.length === 0) {
    return true; // No restrictions means always available
  }
  return teacher.availability.some(a => 
    a.day === slot.day && a.startTime <= slot.startTime && a.endTime >= slot.endTime
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
 */
function solve(variables, assignments, startTime, timeout = 30000) {
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
      classroomCode: value.classroom?.code || '',
      teacherName: value.teacher?.name || '',
      classroomName: value.classroom?.name || ''
    };

    // Check constraints
    if (checkConstraints(assignment, assignments)) {
      assignments.push(assignment);

      const result = solve(variables, assignments, startTime, timeout);
      if (result) return result;

      assignments.pop(); // Backtrack
    }
  }

  return null; // No valid assignment found for this variable
}

/**
 * Main entry point for CSP execution
 */
function runCSP(courses, teachers, classrooms) {
  const startTime = Date.now();
  const conflicts = [];

  try {
    // Build variables and domains
    const variables = buildVariables(courses);
    buildDomains(variables, teachers, classrooms);

    // Check for variables with empty domains
    const emptyDomainVars = variables.filter(v => v.domain.length === 0);
    if (emptyDomainVars.length > 0) {
      for (const v of emptyDomainVars) {
        conflicts.push({
          type: 'infraestructura',
          description: `No hay combinación válida (docente+aula+franja) para "${v.course.name}" (sesión ${v.sessionIndex + 1}).`,
          severity: 'alta'
        });
      }
    }

    // Run solver
    const solution = solve(variables, [], startTime);

    if (solution) {
      // Build assignments
      const assignments = solution.map(a => ({
        courseId: a.courseId,
        teacherId: a.teacherId,
        classroomId: a.classroomId,
        day: a.day,
        startTime: a.startTime,
        endTime: a.endTime
      }));

      // Validate and calculate quality
      const validation = validateSolution(assignments);
      const quality = calculateQualityScore(assignments, courses, teachers, classrooms);

      return {
        success: true,
        assignments,
        qualityScore: quality.overall,
        constraintsFulfilled: quality.constraintsFulfilled,
        preferencesScore: quality.preferencesScore,
        resourceUsage: quality.resourceUsage,
        loadDistribution: quality.loadDistribution,
        conflicts: validation.warnings || []
      };
    } else {
      return {
        success: false,
        conflicts: conflicts.length > 0 ? conflicts : [{
          type: 'docente',
          description: 'No se encontró solución factible con las restricciones actuales. Considere agregar más docentes, aulas o flexibilizar horarios.',
          severity: 'alta'
        }]
      };
    }
  } catch (error) {
    return {
      success: false,
      conflicts: [{
        type: 'docente',
        description: `Error en el motor CSP: ${error.message}`,
        severity: 'alta'
      }]
    };
  }
}

module.exports = { runCSP, generateSlots, DAYS, TIME_SLOTS };
