const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  semester: {
    type: String,
    required: [true, 'El semestre es obligatorio']
  },
  selectedCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  totalCredits: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pendiente', 'validada', 'rechazada'],
    default: 'pendiente'
  },
  validationErrors: [{
    type: String
  }],
  validatedAt: Date
}, {
  timestamps: true
});

enrollmentSchema.index({ studentId: 1, semester: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
