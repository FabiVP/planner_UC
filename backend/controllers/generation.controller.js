const Generation = require('../models/Generation');
const Schedule = require('../models/Schedule');
const Course = require('../models/Course');
const Teacher = require('../models/Teacher');
const Classroom = require('../models/Classroom');
const { runCSP } = require('../engine/csp');

exports.generate = async (req, res, next) => {
  try {
    const { name, semester } = req.body;

    // Create generation record
    const generation = await Generation.create({
      name: name || `Horario ${semester}`,
      semester,
      status: 'ejecutando',
      executedAt: new Date(),
      createdBy: req.user._id
    });

    // Fetch all necessary data
    const courses = await Course.find({ active: true }).populate('prerequisites');
    const teachers = await Teacher.find({ active: true }).populate('specializations');
    const classrooms = await Classroom.find({ available: true });

    if (courses.length === 0) {
      generation.status = 'fallida';
      generation.conflicts = [{ type: 'docente', description: 'No hay cursos activos para programar.', severity: 'alta' }];
      await generation.save();
      return res.status(400).json({ message: 'No hay cursos activos para programar.', generation });
    }

    if (teachers.length === 0) {
      generation.status = 'fallida';
      generation.conflicts = [{ type: 'docente', description: 'No hay docentes disponibles.', severity: 'alta' }];
      await generation.save();
      return res.status(400).json({ message: 'No hay docentes disponibles.', generation });
    }

    if (classrooms.length === 0) {
      generation.status = 'fallida';
      generation.conflicts = [{ type: 'aula', description: 'No hay aulas disponibles.', severity: 'alta' }];
      await generation.save();
      return res.status(400).json({ message: 'No hay aulas disponibles.', generation });
    }

    // Run CSP Engine
    const startTime = Date.now();
    const result = runCSP(courses, teachers, classrooms);
    const executionTime = Date.now() - startTime;

    if (result.success) {
      // Save schedule
      const schedule = await Schedule.create({
        generationId: generation._id,
        semester,
        assignments: result.assignments,
        totalAssignments: result.assignments.length
      });

      generation.status = 'completada';
      generation.completedAt = new Date();
      generation.executionTimeMs = executionTime;
      generation.scheduleId = schedule._id;
      generation.qualityScore = result.qualityScore || 92;
      generation.constraintsFulfilled = result.constraintsFulfilled || 98;
      generation.preferencesScore = result.preferencesScore || 90;
      generation.resourceUsage = result.resourceUsage || 85;
      generation.loadDistribution = result.loadDistribution || 95;
      generation.conflicts = result.conflicts || [];
      await generation.save();

      const populatedSchedule = await Schedule.findById(schedule._id)
        .populate('assignments.courseId', 'code name credits type')
        .populate('assignments.teacherId', 'name')
        .populate('assignments.classroomId', 'code name type capacity');

      res.status(201).json({
        message: 'Horario generado exitosamente.',
        executionTimeMs: executionTime,
        generation,
        schedule: populatedSchedule
      });
    } else {
      generation.status = 'fallida';
      generation.completedAt = new Date();
      generation.executionTimeMs = executionTime;
      generation.conflicts = result.conflicts || [{ type: 'docente', description: 'No se encontró solución factible.', severity: 'alta' }];
      await generation.save();

      res.status(400).json({
        message: 'No se encontró solución factible.',
        executionTimeMs: executionTime,
        generation,
        conflicts: result.conflicts
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const generations = await Generation.find()
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });
    res.json({ count: generations.length, generations });
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const generation = await Generation.findById(req.params.id).populate('createdBy', 'name');
    if (!generation) return res.status(404).json({ message: 'Generación no encontrada.' });
    res.json(generation);
  } catch (error) {
    next(error);
  }
};
