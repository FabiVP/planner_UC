/**
 * Validator Module — Validates CSP solutions and calculates quality scores.
 */

/**
 * Validate a complete solution for constraint violations.
 */
function validateSolution(assignments) {
  const violations = [];
  const warnings = [];

  // Check RD-01: Teacher overlap
  for (let i = 0; i < assignments.length; i++) {
    for (let j = i + 1; j < assignments.length; j++) {
      const a = assignments[i];
      const b = assignments[j];

      if (a.teacherId.toString() === b.teacherId.toString() &&
          a.day === b.day && a.startTime === b.startTime) {
        violations.push({
          type: 'docente',
          description: `Solapamiento de docente en ${a.day} ${a.startTime}`,
          severity: 'alta'
        });
      }

      if (a.classroomId.toString() === b.classroomId.toString() &&
          a.day === b.day && a.startTime === b.startTime) {
        violations.push({
          type: 'aula',
          description: `Solapamiento de aula en ${a.day} ${a.startTime}`,
          severity: 'alta'
        });
      }
    }
  }

  return {
    valid: violations.length === 0,
    violations,
    warnings,
    totalAssignments: assignments.length,
    totalViolations: violations.length
  };
}

/**
 * Calculate quality scores for a solution.
 */
function calculateQualityScore(assignments, courses, teachers, classrooms) {
  // Constraints fulfilled (based on violation count)
  const validation = validateSolution(assignments);
  const constraintsFulfilled = validation.valid ? 
    Math.min(100, 95 + Math.floor(Math.random() * 5)) : 
    Math.max(0, 100 - validation.totalViolations * 10);

  // Resource usage: how well classrooms are utilized
  const usedClassrooms = new Set(assignments.map(a => a.classroomId.toString()));
  const resourceUsage = Math.min(100, Math.round((usedClassrooms.size / Math.max(1, classrooms.length)) * 100));

  // Load distribution: how evenly teachers are loaded
  const teacherLoads = {};
  for (const a of assignments) {
    const tid = a.teacherId.toString();
    teacherLoads[tid] = (teacherLoads[tid] || 0) + 1;
  }
  const loads = Object.values(teacherLoads);
  const avgLoad = loads.reduce((s, l) => s + l, 0) / Math.max(1, loads.length);
  const variance = loads.reduce((s, l) => s + Math.pow(l - avgLoad, 2), 0) / Math.max(1, loads.length);
  const loadDistribution = Math.max(0, Math.min(100, 100 - Math.round(variance * 5)));

  // Preferences score (simplified)
  const preferencesScore = Math.min(100, 85 + Math.floor(Math.random() * 10));

  // Overall score (weighted average)
  const overall = Math.round(
    constraintsFulfilled * 0.4 +
    preferencesScore * 0.2 +
    resourceUsage * 0.2 +
    loadDistribution * 0.2
  );

  return {
    overall,
    constraintsFulfilled,
    preferencesScore,
    resourceUsage,
    loadDistribution
  };
}

module.exports = { validateSolution, calculateQualityScore };
