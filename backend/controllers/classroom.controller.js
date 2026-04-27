const Classroom = require('../models/Classroom');

exports.getAll = async (req, res, next) => {
  try {
    const { type, available } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (available !== undefined) filter.available = available === 'true';

    const classrooms = await Classroom.find(filter).sort({ code: 1 });
    res.json({ count: classrooms.length, classrooms });
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
