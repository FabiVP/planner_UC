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
  timestamps: true
});



module.exports = mongoose.model('Student', studentSchema);
