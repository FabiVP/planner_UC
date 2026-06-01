const mongoose = require('mongoose');

// Schedule of when the classroom is available (not just boolean)
const classroomAvailabilitySchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'],
    required: true
  },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true }
}, { _id: false });

const classroomSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'El código del aula es obligatorio'],
    unique: true,
    uppercase: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'El nombre del aula es obligatorio'],
    trim: true
  },
  capacity: {
    type: Number,
    required: [true, 'La capacidad es obligatoria'],
    min: [5, 'Mínimo 5 personas'],
    max: [500, 'Máximo 500 personas']
  },
  type: {
    type: String,
    enum: ['teorico', 'laboratorio', 'aula_virtual'],
    default: 'teorico'
  },
  // ── Campus/Sede ──
  campus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campus'
  },
  building: {
    type: String,
    default: 'Principal'
  },
  floor: {
    type: Number,
    default: 1
  },
  equipment: [{
    type: String
  }],
  // ── Disponibilidad horaria del aula ──
  // Si está vacío, se asume disponible siempre (mientras available=true)
  availabilitySchedule: [classroomAvailabilitySchema],
  available: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

classroomSchema.index({ type: 1, available: 1 });
classroomSchema.index({ campus: 1, building: 1 });
classroomSchema.index({ capacity: 1 });

module.exports = mongoose.model('Classroom', classroomSchema);
