const Enrollment = require('../models/Enrollment');
const Student = require('../models/Student');
const Course = require('../models/Course');

// Validate enrollment (credits + prerequisites)
const validateEnrollment = async (studentId, courseIds) => {
  const errors = [];
  const student = await Student.findById(studentId).populate('approvedCourses.courseId');
  if (!student) {
    return { valid: false, errors: ['Estudiante no encontrado.'] };
  }

  const courses = await Course.find({ _id: { $in: courseIds } }).populate('prerequisites');
  if (courses.length !== courseIds.length) {
    errors.push('Uno o más cursos seleccionados no existen.');
  }

  // RD-04: Credit validation (20-22)
  const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0);
  if (totalCredits < 20) {
    errors.push(`Total de créditos (${totalCredits}) está por debajo del mínimo de 20.`);
  }
  if (totalCredits > 22) {
    errors.push(`Total de créditos (${totalCredits}) excede el límite de 22 créditos por semestre.`);
  }

  // RD-05: Prerequisites validation
  const approvedIds = student.approvedCourses.map(ac => ac.courseId?._id?.toString() || ac.courseId?.toString());
  for (const course of courses) {
    if (course.prerequisites && course.prerequisites.length > 0) {
      for (const prereq of course.prerequisites) {
        const prereqId = prereq._id ? prereq._id.toString() : prereq.toString();
        if (!approvedIds.includes(prereqId)) {
          const prereqName = prereq.name || prereqId;
          errors.push(`Prerrequisito no cumplido: "${prereqName}" es requerido para "${course.name}".`);
        }
      }
    }
  }

  return { valid: errors.length === 0, errors, totalCredits };
};

exports.getAll = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find()
      .populate('studentId', 'name studentCode')
      .populate('selectedCourses', 'code name credits')
      .sort({ createdAt: -1 });
    res.json({ count: enrollments.length, enrollments });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { studentId, semester, selectedCourses } = req.body;

    // Validate
    const validation = await validateEnrollment(studentId, selectedCourses);

    const enrollment = await Enrollment.create({
      studentId,
      semester,
      selectedCourses,
      totalCredits: validation.totalCredits || 0,
      status: validation.valid ? 'validada' : 'rechazada',
      validationErrors: validation.errors,
      validatedAt: new Date()
    });

    const populated = await Enrollment.findById(enrollment._id)
      .populate('studentId', 'name studentCode')
      .populate('selectedCourses', 'code name credits');

    res.status(201).json({
      message: validation.valid ? 'Matrícula validada exitosamente.' : 'Matrícula rechazada. Verifique los errores.',
      valid: validation.valid,
      errors: validation.errors,
      enrollment: populated
    });
  } catch (error) {
    next(error);
  }
};

exports.validate = async (req, res, next) => {
  try {
    const { studentId, courseIds } = req.body;
    const result = await validateEnrollment(studentId, courseIds);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findByIdAndDelete(req.params.id);
    if (!enrollment) return res.status(404).json({ message: 'Matrícula no encontrada.' });
    res.json({ message: 'Matrícula eliminada.' });
  } catch (error) {
    next(error);
  }
};
