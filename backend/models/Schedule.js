const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  classroomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Classroom',
    required: true
  },
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
}, { _id: true });

const scheduleSchema = new mongoose.Schema({
  generationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Generation',
    required: true
  },
  semester: {
    type: String,
    required: true
  },
  assignments: [assignmentSchema],
  totalAssignments: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Schedule', scheduleSchema);
