const Schedule = require('../models/Schedule');

exports.getAll = async (req, res, next) => {
  try {
    const schedules = await Schedule.find()
      .populate('generationId', 'name semester status qualityScore')
      .populate('assignments.courseId', 'code name credits type')
      .populate('assignments.teacherId', 'name')
      .populate('assignments.classroomId', 'code name type capacity')
      .sort({ createdAt: -1 });
    res.json({ count: schedules.length, schedules });
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const schedule = await Schedule.findById(req.params.id)
      .populate('generationId', 'name semester status qualityScore constraintsFulfilled preferencesScore resourceUsage')
      .populate('assignments.courseId', 'code name credits type semester')
      .populate('assignments.teacherId', 'name email')
      .populate('assignments.classroomId', 'code name type capacity building');
    if (!schedule) return res.status(404).json({ message: 'Horario no encontrado.' });
    res.json(schedule);
  } catch (error) {
    next(error);
  }
};

exports.getByGeneration = async (req, res, next) => {
  try {
    const schedule = await Schedule.findOne({ generationId: req.params.generationId })
      .populate('assignments.courseId', 'code name credits type semester')
      .populate('assignments.teacherId', 'name')
      .populate('assignments.classroomId', 'code name type capacity');
    if (!schedule) return res.status(404).json({ message: 'Horario no encontrado para esta generación.' });
    res.json(schedule);
  } catch (error) {
    next(error);
  }
};
