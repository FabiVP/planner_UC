const Course = require('../models/Course');
const { validationResult } = require('express-validator');

exports.getAll = async (req, res, next) => {
  try {
    const { semester, type, active, career } = req.query;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(10000, Math.max(1, parseInt(req.query.limit) || 20));
    const filter = {};
    if (semester) filter.semester = semester;
    if (type) filter.type = type;
    if (active !== undefined) filter.active = active === 'true';
    if (career) filter.career = career;

    const skip = (page - 1) * limit;
    const [courses, total] = await Promise.all([
      Course.find(filter)
        .populate('prerequisites', 'code name')
        .populate('career', 'code name faculty')
        .sort({ semester: 1, code: 1 })
        .skip(skip).limit(limit)
        .lean(),
      Course.countDocuments(filter)
    ]);
    const pages = Math.ceil(total / limit);
    res.json({
      count: courses.length,
      total,
      page,
      limit,
      pages,
      hasNext: page < pages,
      hasPrev: page > 1,
      courses
    });
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ message: 'Error de validación', errors: errors.array() });
    const course = await Course.create(req.body);
    res.status(201).json({ message: 'Curso creado exitosamente.', course });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ message: 'Error de validación', errors: errors.array() });
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
