const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'El código del curso es obligatorio'],
    unique: true,
    uppercase: true,
    trim: true
  },
  career: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Career'
  },
  name: {
    type: String,
    required: [true, 'El nombre del curso es obligatorio'],
    trim: true
  },
  credits: {
    type: Number,
    required: [true, 'Los créditos son obligatorios'],
    min: [1, 'Mínimo 1 crédito'],
    max: [6, 'Máximo 6 créditos']
  },
  type: {
    type: String,
    enum: ['teorico', 'laboratorio'],
    default: 'teorico'
  },
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  prerequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  sessionsPerWeek: {
    type: Number,
    default: 2,
    min: 1,
    max: 5
  },
  hoursPerSession: {
    type: Number,
    default: 1,
    min: 1,
    max: 3
  },
  mandatory: {
    type: Boolean,
    default: true
  },
  maxStudents: {
    type: Number,
    default: 40,
    min: 5,
    max: 200
  },
  minStudentsPerSection: {
    type: Number,
    default: 10,
    min: 1,
    max: 50
  },
  // ── Vinculación explícita: docentes asignados a este curso ──
  assignedTeachers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher'
  }],
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

courseSchema.index({ semester: 1 });

module.exports = mongoose.model('Course', courseSchema);
