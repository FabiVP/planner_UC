const Simulation = require('../models/Simulation');

/**
 * GET /api/simulations
 * Lista las simulaciones del usuario autenticado.
 */
exports.getAll = async (req, res, next) => {
  try {
    const { semester, label, starred } = req.query;
    const filter = { userId: req.user._id, active: true };
    if (semester) filter.semester = semester;
    if (label) filter.label = label;
    if (starred === 'true') filter.starred = true;

    const simulations = await Simulation.find(filter)
      .sort({ starred: -1, updatedAt: -1 })
      .select('-assignments'); // Lista ligera sin assignments

    res.json({ count: simulations.length, simulations });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/simulations/:id
 * Detalle de una simulación con assignments completos.
 */
exports.getById = async (req, res, next) => {
  try {
    const simulation = await Simulation.findOne({ _id: req.params.id, userId: req.user._id })
      .populate('assignments.courseId', 'code name credits type semester difficulty')
      .populate('assignments.teacherId', 'name email')
      .populate('assignments.classroomId', 'code name type capacity');

    if (!simulation) return res.status(404).json({ message: 'Simulación no encontrada.' });
    res.json(simulation);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/simulations
 * Guarda una nueva simulación.
 * Body: { name, description, label, semester, assignments, stats }
 */
exports.create = async (req, res, next) => {
  try {
    const { name, description, label, semester, assignments, stats } = req.body;
    const role = req.user.role === 'docente' ? 'docente' : 'estudiante';

    // Límite: máximo 10 simulaciones activas por usuario
    const count = await Simulation.countDocuments({ userId: req.user._id, active: true });
    if (count >= 10) {
      return res.status(400).json({ message: 'Máximo 10 simulaciones guardadas. Elimina alguna antes de crear otra.' });
    }

    const simulation = await Simulation.create({
      userId: req.user._id,
      role,
      name: name || `Simulación ${new Date().toLocaleDateString('es-PE')}`,
      description,
      label: label || 'personalizado',
      semester: semester || '2026-1',
      assignments: assignments || [],
      stats: stats || {}
    });

    res.status(201).json({ message: 'Simulación guardada.', simulation });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/simulations/:id
 * Actualiza una simulación existente.
 */
exports.update = async (req, res, next) => {
  try {
    const { name, description, label, assignments, stats, starred } = req.body;

    const simulation = await Simulation.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: { name, description, label, assignments, stats, starred } },
      { new: true, runValidators: true }
    );

    if (!simulation) return res.status(404).json({ message: 'Simulación no encontrada.' });
    res.json({ message: 'Simulación actualizada.', simulation });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/simulations/:id/star
 * Marca/desmarca como favorita.
 */
exports.toggleStar = async (req, res, next) => {
  try {
    const sim = await Simulation.findOne({ _id: req.params.id, userId: req.user._id });
    if (!sim) return res.status(404).json({ message: 'Simulación no encontrada.' });

    sim.starred = !sim.starred;
    await sim.save();
    res.json({ message: sim.starred ? 'Marcada como favorita.' : 'Desmarcada.', starred: sim.starred });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/simulations/:id
 * Elimina (soft-delete) una simulación.
 */
exports.remove = async (req, res, next) => {
  try {
    const simulation = await Simulation.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { active: false },
      { new: true }
    );
    if (!simulation) return res.status(404).json({ message: 'Simulación no encontrada.' });
    res.json({ message: 'Simulación eliminada.' });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/simulations/compare
 * Compara dos simulaciones lado a lado.
 * Body: { simulationIds: [id1, id2] }
 */
exports.compare = async (req, res, next) => {
  try {
    const { simulationIds } = req.body;
    if (!simulationIds || simulationIds.length < 2) {
      return res.status(400).json({ message: 'Se necesitan al menos 2 simulaciones para comparar.' });
    }

    const simulations = await Simulation.find({
      _id: { $in: simulationIds.slice(0, 3) },
      userId: req.user._id,
      active: true
    }).populate('assignments.courseId', 'code name credits type');

    if (simulations.length < 2) {
      return res.status(400).json({ message: 'No se encontraron suficientes simulaciones.' });
    }

    // Build comparison
    const comparison = simulations.map(sim => ({
      id: sim._id,
      name: sim.name,
      label: sim.label,
      starred: sim.starred,
      stats: sim.stats,
      // Schedule by day for visual comparison
      scheduleByDay: buildScheduleByDay(sim.assignments),
      courseList: [...new Set(sim.assignments.map(a =>
        a.courseId?.name || a.courseName || 'Curso'
      ))],
      createdAt: sim.createdAt
    }));

    // Comparative metrics
    const metrics = {
      credits: comparison.map(c => ({ name: c.name, value: c.stats.totalCredits || 0 })),
      gaps: comparison.map(c => ({ name: c.name, value: c.stats.totalGaps || 0 })),
      days: comparison.map(c => ({ name: c.name, value: c.stats.daysWithClasses || 0 })),
      sessions: comparison.map(c => ({ name: c.name, value: c.stats.totalSessions || 0 })),
      score: comparison.map(c => ({ name: c.name, value: c.stats.score || 0 })),
      avgDailyHours: comparison.map(c => ({ name: c.name, value: c.stats.averageDailyHours || 0 }))
    };

    res.json({ comparison, metrics });
  } catch (error) {
    next(error);
  }
};

function buildScheduleByDay(assignments) {
  const days = {};
  const dayOrder = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
  for (const d of dayOrder) days[d] = [];

  for (const a of assignments) {
    if (days[a.day]) {
      days[a.day].push({
        course: a.courseId?.name || a.courseName || '',
        courseCode: a.courseId?.code || a.courseCode || '',
        teacher: a.teacherName || '',
        classroom: a.classroomCode || '',
        startTime: a.startTime,
        endTime: a.endTime
      });
    }
  }

  // Sort each day by startTime
  for (const d of dayOrder) {
    days[d].sort((a, b) => a.startTime.localeCompare(b.startTime));
  }

  return days;
}
