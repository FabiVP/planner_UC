const Classroom = require('../models/Classroom');

exports.getAll = async (req, res, next) => {
  try {
    const { type, available, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (available !== undefined) filter.available = available === 'true';

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [classrooms, total] = await Promise.all([
      Classroom.find(filter).sort({ code: 1 }).skip(skip).limit(parseInt(limit)),
      Classroom.countDocuments(filter)
    ]);
    res.json({ count: classrooms.length, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)), classrooms });
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const classroom = await Classroom.findById(req.params.id);
    if (!classroom) return res.status(404).json({ message: 'Aula no encontrada.' });
    res.json(classroom);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const classroom = await Classroom.create(req.body);
    res.status(201).json({ message: 'Aula creada exitosamente.', classroom });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const classroom = await Classroom.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!classroom) return res.status(404).json({ message: 'Aula no encontrada.' });
    res.json({ message: 'Aula actualizada.', classroom });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const classroom = await Classroom.findByIdAndDelete(req.params.id);
    if (!classroom) return res.status(404).json({ message: 'Aula no encontrada.' });
    res.json({ message: 'Aula eliminada.' });
  } catch (error) {
    next(error);
  }
};
