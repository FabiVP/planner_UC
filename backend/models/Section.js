const mongoose = require('mongoose');

const sectionSlotSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'],
    required: true
  },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true }
}, { _id: false });

const sectionSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  sectionCode: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
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
  scheduleSlots: [sectionSlotSchema],
  enrolledStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  maxCapacity: {
    type: Number,
    required: true,
    min: 5
  },
  minStudents: {
    type: Number,
    default: 15
  },
  currentEnrolled: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['activa', 'cerrada', 'pendiente', 'cancelada'],
    default: 'activa'
  },
  generationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Generation'
  },
  semester: {
    type: String,
    required: true
  },
  career: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Career'
  },
  // Semester number of the course (for filtering)
  courseSemester: {
    type: Number,
    min: 1
  }
}, {
  timestamps: true
});

// Compound index for efficient querying
sectionSchema.index({ courseId: 1, semester: 1, status: 1 });
sectionSchema.index({ career: 1, semester: 1 });
sectionSchema.index({ teacherId: 1, semester: 1 });
sectionSchema.index({ generationId: 1 });

// Virtual for available spots
sectionSchema.virtual('availableSpots').get(function() {
  return this.maxCapacity - this.currentEnrolled;
});

// Method to check if section can accept more students
sectionSchema.methods.canEnroll = function() {
  return this.status === 'activa' && this.currentEnrolled < this.maxCapacity;
};

// Method to check minimum enrollment
sectionSchema.methods.meetsMinimum = function() {
  return this.currentEnrolled >= this.minStudents;
};

module.exports = mongoose.model('Section', sectionSchema);
