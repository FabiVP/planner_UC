const Teacher = require('../models/Teacher');
const Course = require('../models/Course');
const { validationResult } = require('express-validator');

exports.getAll = async (req, res, next) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const filter = { active: true };
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [teachers, total] = await Promise.all([
      Teacher.find(filter)
        .populate('specializations', 'code name credits semester type')
        .sort({ name: 1 })
        .skip(skip).limit(parseInt(limit)),
      Teacher.countDocuments(filter)
    ]);
    res.json({ count: teachers.length, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)), teachers });
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const teacher = await Teacher.findById(req.params.id)
      .populate('specializations', 'code name credits semester type');
    if (!teacher) return res.status(404).json({ message: 'Docente no encontrado.' });
    res.json(teacher);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/teachers/my-profile
 * Devuelve el perfil completo del docente logueado, vinculado por userId.
 * Incluye: contrato, disponibilidad, preferencias, especialidades.
 */
exports.getMyProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const teacher = await Teacher.findOne({ userId })
      .populate('specializations', 'code name credits semester type');

    if (!teacher) {
      return res.status(404).json({
        message: 'No se encontró un perfil de docente vinculado a tu cuenta.',
        hint: 'El coordinador debe crear tu perfil docente y vincularlo a tu usuario.'
      });
    }

    // Compute summary stats
    const totalSpecializations = teacher.specializations?.length || 0;
    const availableDays = teacher.availability?.length || 0;
    const freeDaysCount = teacher.freeDays?.length || 0;

    res.json({
      teacher,
      summary: {
        totalSpecializations,
        availableDays,
        freeDaysCount,
        contractLabel: teacher.contractType === 'tiempo_completo' ? 'Tiempo Completo' : 'Por Horas',
        maxWeeklyHours: teacher.maxWeeklyHours,
        maxCourses: teacher.maxCourses,
        shiftLabel: { manana: 'Mañana', tarde: 'Tarde', noche: 'Noche', indiferente: 'Indiferente' }[teacher.preferredShift] || 'Indiferente'
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/teachers/my-profile
 * Permite al docente actualizar su propia disponibilidad, preferencias y especialidades.
 * NO puede cambiar: nombre, email, tipo de contrato (eso lo hace el coordinador).
 */
exports.updateMyProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const teacher = await Teacher.findOne({ userId });

    if (!teacher) {
      return res.status(404).json({ message: 'Perfil de docente no encontrado.' });
    }

    // Only allow docente to update these fields (not contract, name, etc.)
    const allowedFields = [
      'availability', 'freeDays', 'preferredShift', 'specializations'
    ];

    const updateData = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    }

    const updated = await Teacher.findByIdAndUpdate(teacher._id, updateData, {
      new: true, runValidators: true
    }).populate('specializations', 'code name credits semester type');

    res.json({
      message: 'Perfil actualizado exitosamente.',
      teacher: updated
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/teachers/admin/overview
 * Para el coordinador: resumen completo de todos los docentes con métricas.
 */
exports.getAdminOverview = async (req, res, next) => {
  try {
    const teachers = await Teacher.find({ active: true })
      .populate('specializations', 'code name credits semester type')
      .sort({ name: 1 });

    const tcTeachers = teachers.filter(t => t.contractType === 'tiempo_completo');
    const phTeachers = teachers.filter(t => t.contractType === 'por_horas');

    // Calculate coverage: how many courses have at least one teacher specialized
    const allCourses = await Course.countDocuments({ active: true });
    const coveredCourseIds = new Set();
    teachers.forEach(t => {
      (t.specializations || []).forEach(s => coveredCourseIds.add(s._id.toString()));
    });

    // Teachers without availability configured
    const noAvailability = teachers.filter(t =>
      (!t.availability || t.availability.length === 0) && (!t.freeDays || t.freeDays.length === 0)
    );

    // Teachers without specializations
    const noSpecializations = teachers.filter(t => !t.specializations || t.specializations.length === 0);

    res.json({
      teachers,
      metrics: {
        total: teachers.length,
        fullTime: tcTeachers.length,
        partTime: phTeachers.length,
        totalCapacityHours: tcTeachers.length * 40 + phTeachers.length * 20,
        coursesCovered: coveredCourseIds.size,
        totalCourses: allCourses,
        coveragePercent: allCourses > 0 ? Math.round((coveredCourseIds.size / allCourses) * 100) : 0,
        pendingAvailability: noAvailability.length,
        pendingSpecializations: noSpecializations.length,
        readyForScheduling: teachers.length - noAvailability.length - noSpecializations.length
      },
      warnings: [
        ...(noAvailability.length > 0 ? [`${noAvailability.length} docente(s) sin disponibilidad configurada`] : []),
        ...(noSpecializations.length > 0 ? [`${noSpecializations.length} docente(s) sin especialidades asignadas`] : []),
        ...(coveredCourseIds.size < allCourses ? [`${allCourses - coveredCourseIds.size} curso(s) sin docente especializado`] : [])
      ]
    });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ message: 'Error de validación', errors: errors.array() });
    const teacher = await Teacher.create(req.body);
    res.status(201).json({ message: 'Docente registrado exitosamente.', teacher });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ message: 'Error de validación', errors: errors.array() });
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('specializations', 'code name credits semester type');
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
