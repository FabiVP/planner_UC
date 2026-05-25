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

// Virtual: computed max weekly hours based on contract type
teacherSchema.pre('save', function(next) {
  if (this.isNew && !this.isModified('maxWeeklyHours')) {
    if (this.contractType === 'por_horas') {
      this.maxWeeklyHours = 20;
      if (!this.isModified('maxCourses')) this.maxCourses = 2;
    } else {
      this.maxWeeklyHours = 40;
      if (!this.isModified('maxCourses')) this.maxCourses = 4;
    }
  }
  next();
});

module.exports = mongoose.model('Teacher', teacherSchema);
