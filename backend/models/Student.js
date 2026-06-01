const mongoose = require('mongoose');

const approvedCourseSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  grade: {
    type: Number,
    min: 0,
    max: 20
  },
  semester: String
}, { _id: false });

const studentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
    required: [true, 'El nombre del estudiante es obligatorio'],
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  studentCode: {
    type: String,
    unique: true,
    required: true
  },
  currentSemester: {
    type: Number,
    default: 1,
    min: 1,
    max: 10
  },
  career: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Career'
  },
  approvedCourses: [approvedCourseSchema],
  totalCreditsApproved: {
    type: Number,
    default: 0
  },
  worksWhileStudying: {
    type: Boolean,
    default: false
  },
  preferredShift: {
    type: String,
    enum: ['manana', 'tarde', 'noche', 'indiferente'],
    default: 'indiferente'
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ── Promedio ponderado (GPA) calculado automáticamente ──
studentSchema.virtual('gpa').get(function() {
  const grades = (this.approvedCourses || []).filter(ac => ac.grade != null && ac.grade !== undefined);
  if (grades.length === 0) return 0;
  return Math.round((grades.reduce((sum, ac) => sum + ac.grade, 0) / grades.length) * 100) / 100;
});

// ── Cursos desaprobados count ──
studentSchema.virtual('failedCoursesCount').get(function() {
  return (this.approvedCourses || []).filter(ac => ac.grade != null && ac.grade < 11).length;
});

studentSchema.index({ email: 1 });
studentSchema.index({ career: 1, currentSemester: 1 });
studentSchema.index({ active: 1 });

module.exports = mongoose.model('Student', studentSchema);
