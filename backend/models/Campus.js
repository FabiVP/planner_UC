const mongoose = require('mongoose');

/**
 * Campus — Sedes universitarias.
 * 
 * Permite gestionar múltiples campus con tiempos de traslado entre ellos.
 */
const campusSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'El código del campus es obligatorio'],
    unique: true,
    uppercase: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'El nombre del campus es obligatorio'],
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    trim: true,
    default: 'Huancayo'
  },
  // Tiempo de traslado (minutos) hacia otros campus
  travelTimes: [{
    toCampusId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campus' },
    minutes: { type: Number, min: 0, default: 0 }
  }],
  // Horario de operación del campus
  operatingHours: {
    startTime: { type: String, default: '07:00' },
    endTime: { type: String, default: '22:00' }
  },
  // Edificios/pabellones dentro del campus
  buildings: [{
    code: { type: String, required: true },
    name: { type: String, required: true },
    floors: [{
      floorNumber: { type: Number, required: true },
      rooms: [{
        code: { type: String, required: true },
        name: String,
        type: {
          type: String,
          enum: ['teorico', 'laboratorio_computo', 'laboratorio_practica'],
          default: 'teorico'
        },
        capacity: { type: Number, required: true, min: 5, max: 500 }
      }]
    }]
  }],
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

campusSchema.index({ active: 1 });

module.exports = mongoose.model('Campus', campusSchema);
