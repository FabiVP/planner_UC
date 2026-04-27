const mongoose = require('mongoose');

const conflictSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['docente', 'aula', 'estudiante', 'prerequisito', 'creditos', 'infraestructura'],
    required: true
  },
  description: String,
  severity: {
    type: String,
    enum: ['alta', 'media', 'baja'],
    default: 'media'
  }
}, { _id: false });

const generationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre de la generación es obligatorio'],
    trim: true
  },
  semester: {
    type: String,
    required: [true, 'El semestre es obligatorio']
  },
  status: {
    type: String,
    enum: ['programada', 'ejecutando', 'completada', 'fallida'],
    default: 'programada'
  },
  scheduledDate: {
    type: Date
  },
  executedAt: Date,
  completedAt: Date,
  executionTimeMs: Number,
  qualityScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  constraintsFulfilled: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  preferencesScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  resourceUsage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  loadDistribution: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  conflicts: [conflictSchema],
  scheduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Schedule'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

generationSchema.index({ semester: 1, status: 1 });

module.exports = mongoose.model('Generation', generationSchema);
