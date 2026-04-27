const Course = require('../models/Course');

exports.getAll = async (req, res, next) => {
  try {
    const { semester, type, active } = req.query;
    const filter = {};
    if (semester) filter.semester = semester;
    if (type) filter.type = type;
    if (active !== undefined) filter.active = active === 'true';
    
    const courses = await Course.find(filter)
      .populate('prerequisites', 'code name')
      .sort({ semester: 1, code: 1 });
    res.json({ count: courses.length, courses });
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).populate('prerequisites', 'code name');
    if (!course) return res.status(404).json({ message: 'Curso no encontrado.' });
    res.json(course);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json({ message: 'Curso creado exitosamente.', course });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!course) return res.status(404).json({ message: 'Curso no encontrado.' });
    res.json({ message: 'Curso actualizado.', course });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ message: 'Curso no encontrado.' });
    res.json({ message: 'Curso eliminado.' });
  } catch (error) {
    next(error);
  }
};
