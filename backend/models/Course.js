const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'El código del curso es obligatorio'],
    unique: true,
    uppercase: true,
    trim: true
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
    max: 10
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
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

courseSchema.index({ code: 1 });
courseSchema.index({ semester: 1 });

module.exports = mongoose.model('Course', courseSchema);
