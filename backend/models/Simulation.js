const mongoose = require('mongoose');

/**
 * Simulation — Horarios simulados guardados por estudiantes/docentes.
 * 
 * Permite guardar múltiples simulaciones para comparar antes de la matrícula:
 *   - horario ideal
 *   - plan alternativo
 *   - opción secundaria
 *   - si no alcanzo vacantes
 */
const simulationAssignmentSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  courseName: String,
  courseCode: String,
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
  teacherName: String,
  classroomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom' },
  classroomCode: String,
  sectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Section' },
  sectionCode: String,
  day: {
    type: String,
    enum: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'],
    required: true
  },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true }
}, { _id: false });

const simulationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    enum: ['estudiante', 'docente'],
    required: true
  },
  name: {
    type: String,
    required: [true, 'El nombre de la simulación es obligatorio'],
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 300
  },
  label: {
    type: String,
    enum: ['ideal', 'alternativo', 'secundario', 'sin_vacantes', 'personalizado'],
    default: 'personalizado'
  },
  semester: {
    type: String,
    required: true
  },
  assignments: [simulationAssignmentSchema],
  // Stats snapshot
  stats: {
    totalCourses: { type: Number, default: 0 },
    totalCredits: { type: Number, default: 0 },
    totalSessions: { type: Number, default: 0 },
    totalGaps: { type: Number, default: 0 },
    daysWithClasses: { type: Number, default: 0 },
    shiftMatchPercent: { type: Number, default: 0 },
    averageDailyHours: { type: Number, default: 0 },
    earliestClass: String,
    latestClass: String,
    score: { type: Number, default: 0 }
  },
  // Comparison metadata
  comparedWith: [{
    simulationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Simulation' },
    result: String // 'mejor', 'peor', 'similar'
  }],
  starred: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

simulationSchema.index({ userId: 1, semester: 1 });
simulationSchema.index({ userId: 1, starred: -1, createdAt: -1 });

module.exports = mongoose.model('Simulation', simulationSchema);
