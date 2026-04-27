const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'],
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
  specializations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  maxCourses: {
    type: Number,
    default: 3,
    min: 1,
    max: 6
  },
  availability: [availabilitySchema],
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Teacher', teacherSchema);
