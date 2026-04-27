/**
 * Constraints Module — Implements hard constraints RD-01 to RD-06
 * for the CSP schedule generation engine.
 */

/**
 * RD-01: No solapamiento de docente
 * Un docente no puede estar asignado a dos cursos al mismo tiempo.
 */
function checkRD01(assignment, existingAssignments) {
  return !existingAssignments.some(a =>
    a.teacherId.toString() === assignment.teacherId.toString() &&
    a.day === assignment.day &&
    a.startTime === assignment.startTime
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
    a.startTime === assignment.startTime
  );
}

/**
 * RD-03: No solapamiento de estudiante (simplified)
 * No two sessions of the same course should be at the same time slot.
 * Full student-level validation requires enrollment data.
 */
function checkRD03(assignment, existingAssignments) {
  // Ensure same course sessions don't overlap in time
  return !existingAssignments.some(a =>
    a.courseId.toString() === assignment.courseId.toString() &&
    a.day === assignment.day &&
    a.startTime === assignment.startTime
  );
}

/**
 * Additional: Ensure same course sessions are on different days
 * for better distribution
 */
function checkDayDistribution(assignment, existingAssignments) {
  const sameCourseAssignments = existingAssignments.filter(
    a => a.courseId.toString() === assignment.courseId.toString()
  );
  
  // Prefer different days for same course sessions
  return !sameCourseAssignments.some(a => a.day === assignment.day);
}

/**
 * RD-06: Tipo de infraestructura
 * El tipo de aula debe coincidir con el tipo de curso.
 */
function checkRD06(course, classroom) {
  if (!course || !classroom) return true;
  return course.type === classroom.type;
}

/**
 * Check teacher max courses limit (SA-02: max 3 courses per teacher)
 */
function checkTeacherLoad(assignment, existingAssignments) {
  const teacherCourses = new Set(
    existingAssignments
      .filter(a => a.teacherId.toString() === assignment.teacherId.toString())
      .map(a => a.courseId.toString())
  );
  teacherCourses.add(assignment.courseId.toString());
  return teacherCourses.size <= 3;
}

/**
 * Check all constraints for a proposed assignment
 */
function checkConstraints(assignment, existingAssignments) {
  return (
    checkRD01(assignment, existingAssignments) &&
    checkRD02(assignment, existingAssignments) &&
    checkRD03(assignment, existingAssignments) &&
    checkDayDistribution(assignment, existingAssignments) &&
    checkTeacherLoad(assignment, existingAssignments)
  );
}

module.exports = {
  checkRD01,
  checkRD02,
  checkRD03,
  checkRD06,
  checkDayDistribution,
  checkTeacherLoad,
  checkConstraints
};
