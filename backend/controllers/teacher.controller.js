const Teacher = require('../models/Teacher');

exports.getAll = async (req, res, next) => {
  try {
    const teachers = await Teacher.find({ active: true })
      .populate('specializations', 'code name')
      .sort({ name: 1 });
    res.json({ count: teachers.length, teachers });
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const teacher = await Teacher.findById(req.params.id).populate('specializations', 'code name');
    if (!teacher) return res.status(404).json({ message: 'Docente no encontrado.' });
    res.json(teacher);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const teacher = await Teacher.create(req.body);
    res.status(201).json({ message: 'Docente registrado exitosamente.', teacher });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!teacher) return res.status(404).json({ message: 'Docente no encontrado.' });
    res.json({ message: 'Docente actualizado.', teacher });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!teacher) return res.status(404).json({ message: 'Docente no encontrado.' });
    res.json({ message: 'Docente eliminado.' });
  } catch (error) {
    next(error);
  }
};
