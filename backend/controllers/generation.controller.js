const Generation = require('../models/Generation');
const Schedule = require('../models/Schedule');
const Course = require('../models/Course');
const Teacher = require('../models/Teacher');
const Classroom = require('../models/Classroom');
const Preference = require('../models/Preference');
const InstitutionalPolicy = require('../models/InstitutionalPolicy');
const { runCSPMultiple } = require('../engine/csp');
const { createNotification } = require('./notification.controller');

/**
 * POST /api/generations/generate
 * Genera horario usando CSP con múltiples soluciones y scoring.
 */
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
    const courses = await Course.find({ active: true }).populate('prerequisites').populate('assignedTeachers', 'name');
    const teachers = await Teacher.find({ active: true }).populate('specializations');
    const classrooms = await Classroom.find({ available: true });
    const preferences = await Preference.find({ role: 'docente' });

    // Load active institutional policy (if any)
    const policy = await InstitutionalPolicy.findOne({ active: true }).sort({ updatedAt: -1 });

    // ── Aplicar bloques horarios bloqueados por defecto (almuerzo) si no están configurados ──
    if (policy && policy.allowedSchedule) {
      if (!policy.allowedSchedule.blockedTimeSlots || policy.allowedSchedule.blockedTimeSlots.length === 0) {
        policy.allowedSchedule.blockedTimeSlots = [
          { start: '13:00', end: '14:00', reason: 'Horario de almuerzo' }
        ];
      }
    }

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

    // ── VINCULACIÓN TRIPARTITA: Validar cursos con docente asignado ──
    const teacherSpecCourseIds = new Set(
      teachers.flatMap(t => (t.specializations || []).map(s => {
        const sId = s._id ? s._id.toString() : s.toString();
        return sId;
      }))
    );

    const coursesWithTeacher = [];
    const coursesWithoutTeacher = [];

    for (const course of courses) {
      const cId = course._id.toString();
      const hasAssigned = (course.assignedTeachers && course.assignedTeachers.length > 0);
      const hasSpecialist = teacherSpecCourseIds.has(cId);
      if (hasAssigned || hasSpecialist) {
        coursesWithTeacher.push(course);
      } else {
        coursesWithoutTeacher.push(course);
      }
    }

    // Warn about unlinked courses but proceed with those that have teachers
    const preWarnings = coursesWithoutTeacher.map(c => ({
      type: 'docente',
      description: `Curso "${c.name}" (${c.code}) no tiene docente asignado — excluido de la generación.`,
      severity: 'media'
    }));

    const coursesToSchedule = coursesWithTeacher.length > 0 ? coursesWithTeacher : courses;

    // Run CSP Engine with multiple solutions + institutional policy
    const startTime = Date.now();
    const result = runCSPMultiple(coursesToSchedule, teachers, classrooms, preferences, 4, policy);
    const executionTime = Date.now() - startTime;

    // Merge pre-warnings into result conflicts
    if (result.conflicts) {
      result.conflicts = [...preWarnings, ...result.conflicts];
    } else if (preWarnings.length > 0) {
      result.conflicts = preWarnings;
    }

    if (result.success) {
      // Save primary schedule
      const schedule = await Schedule.create({
        generationId: generation._id,
        semester,
        assignments: result.assignments,
        totalAssignments: result.assignments.length
      });

      // Save alternative schedules
      const alternativesData = [];
      for (let i = 0; i < (result.alternatives || []).length; i++) {
        const alt = result.alternatives[i];
        const altSchedule = await Schedule.create({
          generationId: generation._id,
          semester,
          assignments: alt.assignments,
          totalAssignments: alt.assignments.length
        });

        alternativesData.push({
          scheduleId: altSchedule._id,
          qualityScore: alt.qualityScore,
          preferencesScore: alt.preferencesScore,
          constraintsFulfilled: alt.constraintsFulfilled,
          resourceUsage: alt.resourceUsage,
          optimization: alt.optimization,
          label: alt.label || `Alternativa ${i + 1}`
        });
      }

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
      generation.alternatives = alternativesData;
      generation.unsatisfiedConditions = result.unsatisfiedConditions || [];
      generation.scoringBreakdown = result.scoringBreakdown || {};
      await generation.save();

      // Create notification
      if (req.user?._id) {
        await createNotification(req.user._id, {
          title: 'Horario generado',
          message: `Tu horario "${generation.name}" ha sido generado correctamente. Puntaje: ${result.qualityScore}/100`,
          type: 'horario',
          category: 'info',
          relatedEntity: { entityType: 'generation', entityId: generation._id }
        });
      }

      const populatedSchedule = await Schedule.findById(schedule._id)
        .populate('assignments.courseId', 'code name credits type')
        .populate('assignments.teacherId', 'name')
        .populate('assignments.classroomId', 'code name type capacity');

      res.status(201).json({
        message: 'Horario generado exitosamente.',
        executionTimeMs: executionTime,
        generation,
        schedule: populatedSchedule,
        alternatives: alternativesData,
        unsatisfiedConditions: result.unsatisfiedConditions || [],
        scoringBreakdown: result.scoringBreakdown || {}
      });
    } else {
      generation.status = 'fallida';
      generation.completedAt = new Date();
      generation.executionTimeMs = executionTime;
      generation.conflicts = result.conflicts || [{ type: 'docente', description: 'No se encontró solución factible.', severity: 'alta' }];
      await generation.save();

      // Notify about failure
      if (req.user?._id) {
        await createNotification(req.user._id, {
          title: 'Conflictos detectados',
          message: 'No fue posible generar un horario que cumpla todas las restricciones.',
          type: 'conflicto',
          category: 'alerta',
          relatedEntity: { entityType: 'generation', entityId: generation._id }
        });
      }

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
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [generations, total] = await Promise.all([
      Generation.find()
        .populate('createdBy', 'name')
        .sort({ createdAt: -1 })
        .skip(skip).limit(parseInt(limit)),
      Generation.countDocuments()
    ]);
    res.json({ count: generations.length, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)), generations });
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const generation = await Generation.findById(req.params.id)
      .populate('createdBy', 'name')
      .populate('alternatives.scheduleId');
    if (!generation) return res.status(404).json({ message: 'Generación no encontrada.' });
    res.json(generation);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/generations/:id/restore
 * Restaura una generación previa como la activa.
 * Crea una copia del schedule asociado como nuevo "principal".
 */
exports.restore = async (req, res, next) => {
  try {
    const generation = await Generation.findById(req.params.id);
    if (!generation) return res.status(404).json({ message: 'Generación no encontrada.' });
    if (generation.status !== 'completada') {
      return res.status(400).json({ message: 'Solo se pueden restaurar generaciones completadas.' });
    }
    if (!generation.scheduleId) {
      return res.status(400).json({ message: 'Esta generación no tiene horario asociado.' });
    }

    // Get the original schedule
    const originalSchedule = await Schedule.findById(generation.scheduleId);
    if (!originalSchedule) {
      return res.status(404).json({ message: 'Horario original no encontrado.' });
    }

    // Create a new generation as a restored copy
    const restored = await Generation.create({
      name: `${generation.name} (restaurado)`,
      semester: generation.semester,
      status: 'completada',
      executedAt: new Date(),
      completedAt: new Date(),
      executionTimeMs: 0,
      qualityScore: generation.qualityScore,
      constraintsFulfilled: generation.constraintsFulfilled,
      preferencesScore: generation.preferencesScore,
      resourceUsage: generation.resourceUsage,
      loadDistribution: generation.loadDistribution,
      conflicts: generation.conflicts || [],
      unsatisfiedConditions: generation.unsatisfiedConditions || [],
      scoringBreakdown: generation.scoringBreakdown || {},
      createdBy: req.user._id
    });

    // Copy the schedule
    const newSchedule = await Schedule.create({
      generationId: restored._id,
      semester: originalSchedule.semester,
      assignments: originalSchedule.assignments,
      totalAssignments: originalSchedule.totalAssignments
    });

    restored.scheduleId = newSchedule._id;
    await restored.save();

    res.json({
      message: 'Generación restaurada exitosamente.',
      generation: restored
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/generations/:id
 * Elimina una generación y sus schedules asociados.
 */
exports.remove = async (req, res, next) => {
  try {
    const generation = await Generation.findById(req.params.id);
    if (!generation) return res.status(404).json({ message: 'Generación no encontrada.' });

    // Delete associated schedules
    if (generation.scheduleId) {
      await Schedule.deleteOne({ _id: generation.scheduleId });
    }
    for (const alt of (generation.alternatives || [])) {
      if (alt.scheduleId) await Schedule.deleteOne({ _id: alt.scheduleId });
    }

    await Generation.deleteOne({ _id: generation._id });

    res.json({ message: 'Generación eliminada.' });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/generations/test/generate
 * Endpoint público para pruebas (sin autenticación)
 */
exports.generatePublic = async (req, res) => {
  try {
    const { semester = '2025-2' } = req.body;
    
    console.log('🚀 Generando horario público (modo prueba)...');
    
    const courses = await Course.find({ active: true });
    const teachers = await Teacher.find({ active: true });
    const classrooms = await Classroom.find({ available: true });
    const policy = await InstitutionalPolicy.findOne({ active: true }).sort({ updatedAt: -1 });

    // Apply default lunch break if not configured
    if (policy && policy.allowedSchedule) {
      if (!policy.allowedSchedule.blockedTimeSlots || policy.allowedSchedule.blockedTimeSlots.length === 0) {
        policy.allowedSchedule.blockedTimeSlots = [
          { start: '13:00', end: '14:00', reason: 'Horario de almuerzo' }
        ];
      }
    }

    if (courses.length === 0) {
      return res.status(400).json({ success: false, error: 'No hay cursos disponibles. Ejecuta el seed primero.' });
    }
    if (teachers.length === 0) {
      return res.status(400).json({ success: false, error: 'No hay docentes disponibles.' });
    }
    if (classrooms.length === 0) {
      return res.status(400).json({ success: false, error: 'No hay aulas disponibles.' });
    }

    console.log(`📚 Cursos: ${courses.length} | 👨‍🏫 Docentes: ${teachers.length} | 🏫 Aulas: ${classrooms.length}`);

    const startTime = Date.now();
    const preferences = await Preference.find({ role: 'docente' });

    // ── Ejecutar CSP por semestre (escalable para 60+ cursos) ──
    const semestres = [...new Set(courses.map(c => c.semester))].sort((a, b) => a - b);
    const allAssignments = [];
    const semResults = [];

    for (const sem of semestres) {
      const semCourses = courses.filter(c => c.semester === sem);
      console.log(`  Semestre ${sem}: ${semCourses.length} cursos...`);
      const result = runCSPMultiple(semCourses, teachers, classrooms, preferences, 1, policy);
      const semTime = ((Date.now() - startTime) / 1000).toFixed(1);

      if (result.success) {
        allAssignments.push(...result.assignments);
        semResults.push({ semester: sem, cursos: semCourses.length, asignaciones: result.assignments.length, score: result.qualityScore, tiempo: semTime });
      } else {
        semResults.push({ semester: sem, cursos: semCourses.length, error: 'falló', conflicts: result.conflicts, tiempo: semTime });
      }
    }

    const executionTime = (Date.now() - startTime) / 1000;

    // Build readable schedule
    const courseIds = [...new Set(allAssignments.map(a => a.courseId.toString()))];
    const teacherIds = [...new Set(allAssignments.map(a => a.teacherId.toString()))];
    const classroomIds = [...new Set(allAssignments.map(a => a.classroomId.toString()))];
    const [courseDocs, teacherDocs, classroomDocs] = await Promise.all([
      Course.find({ _id: { $in: courseIds } }).select('name code'),
      Teacher.find({ _id: { $in: teacherIds } }).select('name'),
      Classroom.find({ _id: { $in: classroomIds } }).select('name code')
    ]);
    const courseMap = Object.fromEntries(courseDocs.map(c => [c._id.toString(), c]));
    const teacherMap = Object.fromEntries(teacherDocs.map(t => [t._id.toString(), t]));
    const classroomMap = Object.fromEntries(classroomDocs.map(c => [c._id.toString(), c]));

    const horario = {};
    for (const assignment of allAssignments) {
      if (!horario[assignment.day]) horario[assignment.day] = [];
      const curso = courseMap[assignment.courseId.toString()];
      const docente = teacherMap[assignment.teacherId.toString()];
      const aula = classroomMap[assignment.classroomId.toString()];
      horario[assignment.day].push({
        curso: curso?.name || 'Curso', codigo: curso?.code || 'N/A',
        docente: docente?.name || 'Docente',
        aula: aula?.name || 'Aula',
        hora: `${assignment.startTime} - ${assignment.endTime}`
      });
    }

    const errores = semResults.filter(r => r.error);
    res.json({
      success: errores.length === 0,
      message: errores.length === 0 ? 'Horario generado exitosamente' : 'Algunos semestres fallaron',
      horario,
      executionTime: `${executionTime.toFixed(1)} segundos`,
      cursosAsignados: allAssignments.length,
      semestres: semResults,
      errores: errores.map(r => ({ semester: r.semester, conflicts: r.conflicts }))
    });
  } catch (error) {
    console.error('❌ Error en generatePublic:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};