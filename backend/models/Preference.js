const mongoose = require('mongoose');

const dayAvailabilitySchema = new mongoose.Schema({
  lun: { type: Boolean, default: true },
  mar: { type: Boolean, default: true },
  mie: { type: Boolean, default: true },
  jue: { type: Boolean, default: true },
  vie: { type: Boolean, default: true },
  sab: { type: Boolean, default: false },
  dom: { type: Boolean, default: false }
}, { _id: false });

const preferenceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  role: {
    type: String,
    enum: ['estudiante', 'docente', 'coordinador'],
    required: true
  },
  // Disponibilidad horaria por bloques (Mañana/Tarde/Noche × Lun-Vie)
  availability: {
    manana: { type: dayAvailabilitySchema, default: () => ({}) },
    tarde:  { type: dayAvailabilitySchema, default: () => ({}) },
    noche:  { type: dayAvailabilitySchema, default: () => ({}) }
  },
  // Disponibilidad detallada por franja horaria (para vista semanal avanzada)
  detailedAvailability: [{
    day: {
      type: String,
      enum: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo']
    },
    startTime: String,
    endTime: String,
    status: {
      type: String,
      enum: ['disponible', 'no_disponible', 'preferencia'],
      default: 'disponible'
    }
  }],
  // Preferencias adicionales (checkboxes)
  additionalPreferences: {
    avoidBefore8am: { type: Boolean, default: true },
    avoidGaps: { type: Boolean, default: true },
    preferFewerDays: { type: Boolean, default: true },
    groupSameSubjectConsecutive: { type: Boolean, default: false }
  },
  // Prioridad de objetivos (arrastrables, 1 = más importante)
  priorityOrder: {
    type: [String],
    default: ['conflicts', 'institutional', 'gaps', 'personal']
  },
  // Preferencia de turno
  preferredShift: {
    type: String,
    enum: ['manana', 'tarde', 'noche', 'indiferente'],
    default: 'indiferente'
  },
  // Trabaja mientras estudia (solo estudiantes)
  worksWhileStudying: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});



module.exports = mongoose.model('Preference', preferenceSchema);
