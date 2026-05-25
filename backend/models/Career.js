const mongoose = require('mongoose');

const careerSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'El código de la carrera es obligatorio'],
    unique: true,
    uppercase: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'El nombre de la carrera es obligatorio'],
    trim: true
  },
  faculty: {
    type: String,
    trim: true,
    default: 'Ingeniería'
  },
  totalSemesters: {
    type: Number,
    default: 10,
    min: 6,
    max: 14
  },
  totalCredits: {
    type: Number,
    default: 200,
    min: 100,
    max: 350
  },
  director: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

careerSchema.index({ active: 1 });

module.exports = mongoose.model('Career', careerSchema);
