/**
 * Scoring Module — Sistema de evaluación para horarios generados.
 * 
 * JERARQUÍA DE PRIORIDAD (MÁXIMA a menor):
 *   1. INSTITUCIONAL (políticas de la universidad)
 *   2. DISPONIBILIDAD docente/aula (restricciones duras)
 *   3. PREFERENCIAS del docente
 *   4. PREFERENCIAS del estudiante
 * 
 * Regla clave: Si una preferencia del docente CONFLICTA con
 * una regla institucional, la institucional SIEMPRE gana.
 * 
 * Evalúa cada solución del CSP con puntajes ponderados:
 *   - Validez del horario (25%): restricciones duras cumplidas
 *   - Restricciones institucionales (25%): capacidad, tipo aula, prereqs
 *   - Preferencias satisfechas (30%): disponibilidad, turno preferido
 *   - Optimización general (20%): uso de recursos, distribución carga
 * 
 * Scoring individual por asignación:
 *   +10  Docente en turno preferido
 *   +8   Estudiante en turno preferido
 *   +5   Sin huecos entre clases
 *   +3   Clases agrupadas en menos días
 *   -5   Horario no deseado
 *   -3   Huecos largos (>2h)
 *   -2   Aula con capacidad ociosa (>50% vacía)
 */

const WEIGHTS = {
  validity: 0.25,
  institutional: 0.25,
  preferences: 0.30,
  optimization: 0.20
};

const SCORES = {
  TEACHER_PREFERRED_SHIFT: 10,
  STUDENT_PREFERRED_SHIFT: 8,
  NO_GAPS: 5,
  FEWER_DAYS: 3,
  UNWANTED_SLOT: -5,
  LONG_GAP: -3,
  WASTED_CAPACITY: -2
};

/**
 * Determinar el turno de una franja horaria
 * Usa policy.shifts si está disponible, o valores por defecto.
 */
function getShift(startTime, policy = null) {
  const shifts = policy?.shifts || {
    manana: { start: '07:00', end: '13:00' },
    tarde: { start: '14:00', end: '19:00' },
    noche: { start: '19:00', end: '22:00' }
  };

  for (const [name, range] of Object.entries(shifts)) {
    if (startTime >= range.start && startTime < range.end) {
      return name;
    }
  }
  // Fallback: noche
  return 'noche';
}

/**
 * Calcular puntaje de validez (restricciones duras)
 */
function calculateValidityScore(assignments) {
  let violations = 0;
  const total = assignments.length;

  for (let i = 0; i < assignments.length; i++) {
    for (let j = i + 1; j < assignments.length; j++) {
      const a = assignments[i];
      const b = assignments[j];

      // Teacher overlap
      if (a.teacherId?.toString() === b.teacherId?.toString() &&
          a.day === b.day && a.startTime === b.startTime) {
        violations++;
      }
      // Classroom overlap
      if (a.classroomId?.toString() === b.classroomId?.toString() &&
          a.day === b.day && a.startTime === b.startTime) {
        violations++;
      }
    }
  }

  if (total === 0) return 100;
  return Math.max(0, Math.round(100 - (violations / total) * 100));
}

/**
 * Calcular puntaje de restricciones institucionales
 */
function calculateInstitutionalScore(assignments, courses, classrooms) {
  let score = 100;
  let checks = 0;
  let passed = 0;

  for (const assignment of assignments) {
    const course = courses.find(c =>
      (c._id || c).toString() === (assignment.courseId?._id || assignment.courseId)?.toString()
    );
    const classroom = classrooms.find(c =>
      (c._id || c).toString() === (assignment.classroomId?._id || assignment.classroomId)?.toString()
    );

    if (course && classroom) {
      // Type match check
      checks++;
      if (course.type === classroom.type) passed++;

      // Capacity check
      checks++;
      const maxStudents = course.maxStudents || 40;
      if (classroom.capacity >= maxStudents) passed++;
    }
  }

  if (checks === 0) return 100;
  return Math.round((passed / checks) * 100);
}

/**
 * Calcular puntaje de preferencias satisfechas
 * JERARQUÍA: Las preferencias institucionales (policy) tienen prioridad
 * sobre las preferencias del docente. Si hay conflicto, gana la universidad.
 */
function calculatePreferencesScore(assignments, teachers, preferences, policy = null) {
  if (!preferences || preferences.length === 0) {
    return { score: 85, details: [] };
  }

  let totalPoints = 0;
  let maxPoints = 0;
  const details = [];

  // ── Cargar reglas institucionales ──
  const institutionalShiftTimes = policy?.shifts || {};
  const institutionalBlocked = policy?.allowedSchedule?.blockedTimeSlots || [];

  for (const assignment of assignments) {
    const teacherId = (assignment.teacherId?._id || assignment.teacherId)?.toString();
    const teacher = teachers.find(t => (t._id || t).toString() === teacherId);
    const shift = getShift(assignment.startTime, policy);

    // Teacher preferred shift
    if (teacher) {
      maxPoints += SCORES.TEACHER_PREFERRED_SHIFT;
      const teacherPref = preferences.find(p =>
        p.userId?.toString() === teacher.userId?.toString() && p.role === 'docente'
      );

      // ── Verificar si hay conflicto con reglas institucionales ──
      let institutionalConflict = false;

      // Verificar que el turno esté dentro de los permitidos por la institución
      if (institutionalShiftTimes[shift]) {
        const instStart = institutionalShiftTimes[shift].start;
        const instEnd = institutionalShiftTimes[shift].end;
        if (assignment.startTime < instStart) {
          institutionalConflict = true;
        }
      }

      // Verificar bloqueos institucionales
      for (const block of institutionalBlocked) {
        if (assignment.startTime >= block.start && assignment.startTime < block.end) {
          institutionalConflict = true;
          break;
        }
      }

      // Usar preferredShift del Teacher model como fuente principal,
      // y del Preference model como respaldo si el docente configuró allí.
      const teacherShift = teacher.preferredShift || teacherPref?.preferredShift;

      if (teacherShift || teacherPref) {
        if (institutionalConflict) {
          // Conflicto institucional → la preferencia del docente NO se penaliza
          // porque la asignación fue forzada por reglas de la universidad
          totalPoints += 0; // neutral
          details.push({
            type: 'teacher_shift_overridden',
            description: `Docente ${teacher.name}: preferencia anulada por regla institucional en turno ${shift}`,
            impact: 'Bajo'
          });
        } else if (!teacherShift || teacherShift === 'indiferente' || teacherShift === shift) {
          totalPoints += SCORES.TEACHER_PREFERRED_SHIFT;
        } else {
          totalPoints += SCORES.UNWANTED_SLOT;
          details.push({
            type: 'teacher_shift',
            description: `Docente ${teacher.name} asignado en turno ${shift}, prefiere ${teacherShift}`,
            impact: 'Medio'
          });
        }

        // Check block availability (only if no institutional conflict)
        if (!institutionalConflict && teacherPref) {
          const dayMap = { lunes: 'lun', martes: 'mar', miercoles: 'mie', jueves: 'jue', viernes: 'vie', sabado: 'sab', domingo: 'dom' };
          const dayKey = dayMap[assignment.day];
          if (dayKey && teacherPref.availability?.[shift]?.[dayKey] === false) {
            totalPoints += SCORES.UNWANTED_SLOT;
            details.push({
              type: 'teacher_availability',
              description: `Docente ${teacher.name} no disponible ${assignment.day} ${shift}`,
              impact: 'Alto'
            });
          }
        }
      } else {
        totalPoints += SCORES.TEACHER_PREFERRED_SHIFT; // No pref = ok
      }
    }
  }

  // Check for gaps in schedule per teacher
  const teacherSchedules = {};
  for (const a of assignments) {
    const tid = (a.teacherId?._id || a.teacherId)?.toString();
    if (!teacherSchedules[tid]) teacherSchedules[tid] = {};
    if (!teacherSchedules[tid][a.day]) teacherSchedules[tid][a.day] = [];
    teacherSchedules[tid][a.day].push(a.startTime);
  }

  for (const [tid, days] of Object.entries(teacherSchedules)) {
    for (const [day, times] of Object.entries(days)) {
      const sorted = times.sort();
      for (let i = 1; i < sorted.length; i++) {
        const prevMin = timeToMinutes(sorted[i - 1]);
        const currMin = timeToMinutes(sorted[i]);
        const gap = (currMin - prevMin) / 60;
        if (gap >= 2) {
          totalPoints += SCORES.LONG_GAP;
          details.push({
            type: 'gap',
            description: `Docente con hueco de ${gap.toFixed(1)} horas el ${day}`,
            impact: 'Bajo'
          });
        }
      }
    }
  }

  function timeToMinutes(t) {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + (m || 0);
  }

  const score = maxPoints > 0
    ? Math.max(0, Math.min(100, Math.round(((totalPoints + maxPoints) / (maxPoints * 2)) * 100)))
    : 85;

  return { score, details };
}

/**
 * Calcular puntaje de optimización general
 */
function calculateOptimizationScore(assignments, courses, teachers, classrooms) {
  // Resource usage
  const usedClassrooms = new Set(assignments.map(a =>
    (a.classroomId?._id || a.classroomId)?.toString()
  ));
  const resourceUsage = classrooms.length > 0
    ? Math.round((usedClassrooms.size / classrooms.length) * 100)
    : 100;

  // Load distribution (variance-based)
  const teacherLoads = {};
  for (const a of assignments) {
    const tid = (a.teacherId?._id || a.teacherId)?.toString();
    teacherLoads[tid] = (teacherLoads[tid] || 0) + 1;
  }
  const loads = Object.values(teacherLoads);
  const avgLoad = loads.length > 0 ? loads.reduce((s, l) => s + l, 0) / loads.length : 0;
  const variance = loads.length > 0
    ? loads.reduce((s, l) => s + Math.pow(l - avgLoad, 2), 0) / loads.length
    : 0;
  const loadDistribution = Math.max(0, Math.min(100, 100 - Math.round(variance * 5)));

  // Days used (fewer = better for students)
  const daysUsed = new Set(assignments.map(a => a.day));
  const daysScore = Math.max(0, 100 - (daysUsed.size - 3) * 10); // Ideal: 3-4 days

  const score = Math.round((resourceUsage * 0.35 + loadDistribution * 0.35 + daysScore * 0.30));

  return {
    score: Math.min(100, score),
    resourceUsage,
    loadDistribution,
    daysUsed: daysUsed.size
  };
}

/**
 * Calcular puntaje total de una solución.
 * Acepta un policy opcional para pesos dinámicos.
 */
function evaluateSolution(assignments, courses, teachers, classrooms, preferences = [], policy = null) {
  const validity = calculateValidityScore(assignments);
  const institutional = calculateInstitutionalScore(assignments, courses, classrooms);
  const prefResult = calculatePreferencesScore(assignments, teachers, preferences, policy);
  const optimization = calculateOptimizationScore(assignments, courses, teachers, classrooms);

  // Dynamic weights from policy, or use defaults
  const w = policy?.priorityWeights || WEIGHTS;
  const weights = {
    validity: w.validity ?? WEIGHTS.validity,
    institutional: w.institutional ?? WEIGHTS.institutional,
    preferences: w.preferences ?? WEIGHTS.preferences,
    optimization: w.optimization ?? WEIGHTS.optimization
  };

  const overall = Math.round(
    validity * weights.validity +
    institutional * weights.institutional +
    prefResult.score * weights.preferences +
    optimization.score * weights.optimization
  );

  const pctValidity = Math.round(weights.validity * 100);
  const pctInstitutional = Math.round(weights.institutional * 100);
  const pctPreferences = Math.round(weights.preferences * 100);
  const pctOptimization = Math.round(weights.optimization * 100);

  return {
    overall: Math.min(100, overall),
    validity,
    institutional,
    preferencesScore: prefResult.score,
    preferencesDetails: prefResult.details,
    optimization: optimization.score,
    resourceUsage: optimization.resourceUsage,
    loadDistribution: optimization.loadDistribution,
    daysUsed: optimization.daysUsed,
    breakdown: {
      validezHorario: { score: validity, weight: `${pctValidity}%`, maxScore: pctValidity },
      restriccionesInstitucionales: { score: institutional, weight: `${pctInstitutional}%`, maxScore: pctInstitutional },
      preferenciasSatisfechas: { score: prefResult.score, weight: `${pctPreferences}%`, maxScore: pctPreferences },
      optimizacionGeneral: { score: optimization.score, weight: `${pctOptimization}%`, maxScore: pctOptimization }
    }
  };
}

/**
 * Comparar dos soluciones y generar tabla comparativa
 */
function compareSolutions(solutionA, solutionB) {
  return {
    validezHorario: {
      actual: solutionA.validity,
      alternativa: solutionB.validity,
      diff: solutionB.validity - solutionA.validity
    },
    restriccionesInstitucionales: {
      actual: solutionA.institutional,
      alternativa: solutionB.institutional,
      diff: solutionB.institutional - solutionA.institutional
    },
    preferenciasSatisfechas: {
      actual: solutionA.preferencesScore,
      alternativa: solutionB.preferencesScore,
      diff: solutionB.preferencesScore - solutionA.preferencesScore
    },
    optimizacionGeneral: {
      actual: solutionA.optimization,
      alternativa: solutionB.optimization,
      diff: solutionB.optimization - solutionA.optimization
    },
    overall: {
      actual: solutionA.overall,
      alternativa: solutionB.overall,
      diff: solutionB.overall - solutionA.overall
    }
  };
}

/**
 * Detectar condiciones no satisfechas
 */
function detectUnsatisfiedConditions(scoreResult, preferences = []) {
  const conditions = [];

  // Check for gaps
  if (scoreResult.preferencesDetails) {
    const gapIssues = scoreResult.preferencesDetails.filter(d => d.type === 'gap');
    if (gapIssues.length > 0) {
      conditions.push({
        condition: 'Evitar huecos entre clases',
        impact: 'Medio',
        details: `Se generaron ${gapIssues.length} huecos de más de 1 hora.`,
        icon: 'gap'
      });
    }
  }

  // Check day distribution
  if (scoreResult.daysUsed > 4) {
    conditions.push({
      condition: 'Preferir días con menos carga académica',
      impact: 'Bajo',
      details: `Se requieren ${scoreResult.daysUsed} días con clases.`,
      icon: 'days'
    });
  }

  // Check if preferences score is low
  if (scoreResult.preferencesScore < 70) {
    conditions.push({
      condition: 'Preferencias personales',
      impact: 'Medio',
      details: 'No fue posible cumplir todas las preferencias de horario.',
      icon: 'preferences'
    });
  }

  // Check grouping
  if (scoreResult.preferencesDetails) {
    const groupIssues = scoreResult.preferencesDetails.filter(d => d.type === 'grouping');
    if (groupIssues.length > 0) {
      conditions.push({
        condition: 'Agrupar clases de la misma materia en días consecutivos',
        impact: 'Bajo',
        details: 'No fue posible agrupar todas las clases.',
        icon: 'grouping'
      });
    }
  }

  return conditions;
}

module.exports = {
  evaluateSolution,
  compareSolutions,
  detectUnsatisfiedConditions,
  calculateValidityScore,
  calculateInstitutionalScore,
  calculatePreferencesScore,
  calculateOptimizationScore,
  getShift,
  WEIGHTS,
  SCORES
};
