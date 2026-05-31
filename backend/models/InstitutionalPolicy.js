const mongoose = require('mongoose');

/**
 * InstitutionalPolicy — Reglas y restricciones institucionales.
 * 
 * Tiene la MÁXIMA prioridad en la generación de horarios.
 * Jeraquía:  Institucional > Disponibilidad docente > Preferencia docente > Preferencia estudiante
 * 
 * Sólo debe existir un documento activo a la vez (singleton por semestre).
 */
const institutionalPolicySchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Política Institucional',
    trim: true
  },
  semester: {
    type: String,
    required: true,
    trim: true,
    default: '2026-1'
  },
  active: {
    type: Boolean,
    default: true
  },

  // ── Horarios permitidos por la institución ──
  allowedSchedule: {
    startTime: { type: String, default: '07:00' },
    endTime: { type: String, default: '22:00' },
    // Días hábiles
    activeDays: {
      type: [String],
      default: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo']
    },
    // ── Bloques horarios bloqueados (ej: almuerzo) ──
    blockedTimeSlots: [{
      start: { type: String, required: true },
      end: { type: String, required: true },
      reason: { type: String, default: 'Bloqueado' }
    }]
  },

  // ── Turnos institucionales ──
  shifts: {
    manana: { start: { type: String, default: '07:00' }, end: { type: String, default: '13:00' } },
    tarde: { start: { type: String, default: '13:00' }, end: { type: String, default: '19:00' } },
    noche: { start: { type: String, default: '19:00' }, end: { type: String, default: '22:00' } }
  },

  // ── Límites de carga docente ──
  teacherLimits: {
    maxWeeklyHoursFullTime: { type: Number, default: 40 },
    maxWeeklyHoursPartTime: { type: Number, default: 20 },
    maxCoursesFullTime: { type: Number, default: 4 },
    maxCoursesPartTime: { type: Number, default: 2 },
    // Mínimo de horas de descanso entre clases del mismo docente
    minBreakBetweenClasses: { type: Number, default: 0 },
    // Máximo de horas continuas de clase
    maxContinuousHours: { type: Number, default: 4 }
  },

  // ── Preferencias de tiempo parcial (gestionadas por el admin) ──
  partTimePreferences: {
    // Turnos permitidos para docentes por horas
    allowedShifts: {
      type: [String],
      enum: ['manana', 'tarde', 'noche'],
      default: ['manana', 'tarde']
    },
    // Permitir que docentes PH den clases en múltiples turnos
    allowMultiShift: { type: Boolean, default: false },
    // Los PH pueden dictar solo ciertos tipos de curso
    allowedCourseTypes: {
      type: [String],
      enum: ['teorico', 'laboratorio'],
      default: ['teorico', 'laboratorio']
    },
    // Priorizar horarios de PH después de asignar TC
    prioritizeAfterFullTime: { type: Boolean, default: true },
    // Máximo de días a la semana que puede trabajar un PH
    maxDaysPerWeek: { type: Number, default: 5, min: 1, max: 7 }
  },

  // ── Restricciones de aulas ──
  classroomRules: {
    // Porcentaje máximo de ocupación permitido del aforo
    maxCapacityUsagePercent: { type: Number, default: 100, min: 50, max: 100 },
    // Los laboratorios solo pueden usarse por cursos tipo laboratorio
    strictTypeMatch: { type: Boolean, default: true },
    // Permitir aulas virtuales
    allowVirtualClassrooms: { type: Boolean, default: true }
  },

  // ── Distribución de cursos ──
  courseDistribution: {
    // Preferir distribuir sesiones en días no consecutivos
    preferNonConsecutiveDays: { type: Boolean, default: true },
    // Máximo sesiones del mismo curso por día
    maxSessionsPerCoursePerDay: { type: Number, default: 1 },
    // Evitar clases antes de esta hora
    avoidBefore: { type: String, default: '' },
    // Evitar clases después de esta hora
    avoidAfter: { type: String, default: '' }
  },

  // ── Reglas de matrícula ──
  enrollmentRules: {
    minCreditsPerSemester: { type: Number, default: 12, min: 0, max: 50 },
    maxCreditsPerSemester: { type: Number, default: 25, min: 1, max: 50 },
    minStudentsPerSection: { type: Number, default: 15, min: 1, max: 50 }
  },

  // ── Prioridades del motor CSP ──
  priorityWeights: {
    // Pesos para scoring (deben sumar 1.0)
    institutional: { type: Number, default: 0.30 },
    validity: { type: Number, default: 0.25 },
    preferences: { type: Number, default: 0.25 },
    optimization: { type: Number, default: 0.20 }
  },

  // ── Reglas adicionales ──
  additionalRules: [{
    name: { type: String, trim: true },
    description: { type: String, trim: true },
    type: { type: String, enum: ['hard', 'soft'], default: 'soft' },
    active: { type: Boolean, default: true }
  }],

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Ensure only one active policy per semester
institutionalPolicySchema.index({ semester: 1, active: 1 });

module.exports = mongoose.model('InstitutionalPolicy', institutionalPolicySchema);
