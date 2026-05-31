const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'],
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  }
}, { _id: false });

const teacherSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
    required: [true, 'El nombre del docente es obligatorio'],
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  // ── Tipo de contrato ──
  contractType: {
    type: String,
    enum: ['tiempo_completo', 'por_horas'],
    default: 'tiempo_completo'
  },
  // ── Carga administrativa (solo TC) ──
  administrativeLoad: {
    type: Boolean,
    default: false
  },
  // ── Horas de enseñanza semanales ──
  // Con carga admin: 8 | 12 | 24 | 36
  // Sin carga admin: 36
  // Por horas: según contrato (max 20)
  teachingHours: {
    type: Number,
    default: function() {
      if (this.contractType === 'por_horas') return 20;
      return this.administrativeLoad ? 24 : 36;
    },
    min: 4,
    max: 48
  },
  // ── Desempeño docente: criterio de asignación ──
  performanceLevel: {
    type: String,
    enum: ['alto', 'regular', 'bajo'],
    default: 'regular'
  },
  performanceScore: {
    type: Number,
    default: 80,
    min: 0,
    max: 100
  },
  specializations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  // ── Carga horaria ──
  maxCourses: {
    type: Number,
    default: 3,
    min: 1,
    max: 8
  },
  maxWeeklyHours: {
    type: Number,
    default: 40,
    min: 1,
    max: 48
  },
  // ── Disponibilidad y preferencias ──
  availability: [availabilitySchema],
  freeDays: [{
    type: String,
    enum: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo']
  }],
  preferredShift: {
    type: String,
    enum: ['manana', 'tarde', 'noche', 'indiferente'],
    default: 'indiferente'
  },
  department: {
    type: String,
    trim: true,
    default: 'Ingeniería de Sistemas'
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Computed fields based on contract type and administrative load
// Recalculate on every save (not just isNew) so changes to contractType
// or administrativeLoad are always reflected.
teacherSchema.pre('save', function(next) {
  if (this.contractType === 'por_horas') {
    this.administrativeLoad = false;
    if (!this.isModified('maxWeeklyHours')) this.maxWeeklyHours = 20;
    if (!this.isModified('maxCourses')) this.maxCourses = 2;
    if (!this.isModified('teachingHours')) this.teachingHours = 20;
  } else {
    if (!this.isModified('maxWeeklyHours')) this.maxWeeklyHours = 40;
    if (!this.isModified('maxCourses')) this.maxCourses = 4;
    if (this.administrativeLoad) {
      if (!this.isModified('teachingHours')) this.teachingHours = 24;
    } else {
      if (!this.isModified('teachingHours')) this.teachingHours = 36;
    }
  }
  next();
});

module.exports = mongoose.model('Teacher', teacherSchema);
