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
  // Section-based enrollment (new)
  selectedSections: [{
    sectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Section' },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' }
  }],
  totalCredits: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pendiente', 'validada', 'rechazada', 'confirmada'],
    default: 'pendiente'
  },
  validationErrors: [{
    type: String
  }],
  // Schedule snapshot: the student's confirmed timetable
  scheduleSnapshot: [{
    sectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Section' },
    courseCode: String,
    courseName: String,
    sectionCode: String,
    teacherName: String,
    classroomCode: String,
    day: String,
    startTime: String,
    endTime: String
  }],
  validatedAt: Date
}, {
  timestamps: true
});

enrollmentSchema.index({ studentId: 1, semester: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
