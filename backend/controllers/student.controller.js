const Student = require('../models/Student');

exports.getAll = async (req, res, next) => {
  try {
    const { semester, career } = req.query;
    const filter = { active: true };
    if (semester) filter.currentSemester = semester;
    if (career) filter.career = career;

    const students = await Student.find(filter)
      .populate('approvedCourses.courseId', 'code name credits')
      .sort({ name: 1 });
    res.json({ count: students.length, students });
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('approvedCourses.courseId', 'code name credits');
    if (!student) return res.status(404).json({ message: 'Estudiante no encontrado.' });
    res.json(student);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json({ message: 'Estudiante registrado exitosamente.', student });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!student) return res.status(404).json({ message: 'Estudiante no encontrado.' });
    res.json({ message: 'Estudiante actualizado.', student });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: 'Estudiante no encontrado.' });
    res.json({ message: 'Estudiante eliminado.' });
  } catch (error) {
    next(error);
  }
};
