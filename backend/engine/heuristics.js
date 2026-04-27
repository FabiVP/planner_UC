/**
 * Heuristics Module for CSP Solver
 * 
 * Implements:
 * - MRV (Minimum Remaining Values) for variable ordering
 * - LCV (Least Constraining Value) for domain ordering
 * - Forward Checking for constraint propagation
 */

/**
 * MRV Heuristic: Select the unassigned variable with the fewest remaining values.
 * This reduces the branching factor and helps detect failures early.
 */
function selectVariableMRV(unassigned, assignments) {
  if (unassigned.length === 0) return null;

  let bestVariable = unassigned[0];
  let minDomainSize = Infinity;

  for (const variable of unassigned) {
    // Calculate remaining valid domain values
    const remainingValues = countRemainingValues(variable, assignments);
    
    if (remainingValues < minDomainSize) {
      minDomainSize = remainingValues;
      bestVariable = variable;
    }
    
    // If domain is empty, return immediately (fail fast)
    if (remainingValues === 0) {
      return variable;
    }
  }

  return bestVariable;
}

/**
 * Count remaining valid values for a variable given current assignments.
 */
function countRemainingValues(variable, assignments) {
  let count = 0;
  for (const value of variable.domain) {
    if (isConsistent(variable, value, assignments)) {
      count++;
    }
  }
  return count;
}

/**
 * Check if a value is consistent with current assignments (simple check).
 */
function isConsistent(variable, value, assignments) {
  // Check teacher conflict (RD-01)
  const teacherConflict = assignments.some(a =>
    a.teacherId.toString() === value.teacherId.toString() &&
    a.day === value.day &&
    a.startTime === value.startTime
  );
  if (teacherConflict) return false;

  // Check classroom conflict (RD-02)
  const classroomConflict = assignments.some(a =>
    a.classroomId.toString() === value.classroomId.toString() &&
    a.day === value.day &&
    a.startTime === value.startTime
  );
  if (classroomConflict) return false;

  return true;
}

/**
 * Order domain values using LCV (Least Constraining Value) heuristic.
 * Prefer values that rule out the fewest options for remaining variables.
 * Simplified: filter out inconsistent values and return valid ones.
 */
function orderDomainValues(variable, assignments) {
  return variable.domain.filter(value => isConsistent(variable, value, assignments));
}

/**
 * Forward Checking: After assigning a value, prune domains of unassigned variables.
 * Returns false if any domain becomes empty (indicating failure).
 */
function forwardCheck(assignedVariable, value, unassigned, assignments) {
  for (const variable of unassigned) {
    if (variable.id === assignedVariable.id) continue;

    variable.domain = variable.domain.filter(v => {
      // Remove values that conflict with the new assignment
      if (v.teacherId.toString() === value.teacherId.toString() &&
          v.day === value.day &&
          v.startTime === value.startTime) {
        return false;
      }
      if (v.classroomId.toString() === value.classroomId.toString() &&
          v.day === value.day &&
          v.startTime === value.startTime) {
        return false;
      }
      return true;
    });

    if (variable.domain.length === 0) {
      return false; // Domain wipeout
    }
  }
  return true;
}

module.exports = {
  selectVariableMRV,
  orderDomainValues,
  forwardCheck,
  countRemainingValues,
  isConsistent
};
