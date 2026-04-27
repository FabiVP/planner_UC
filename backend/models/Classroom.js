const mongoose = require('mongoose');

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
    max: [200, 'Máximo 200 personas']
  },
  type: {
    type: String,
    enum: ['teorico', 'laboratorio'],
    default: 'teorico'
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
  available: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

classroomSchema.index({ type: 1, available: 1 });

module.exports = mongoose.model('Classroom', classroomSchema);
