const Preference = require('../models/Preference');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');

// GET /api/preferences — Obtener preferencias del usuario logueado
exports.getMyPreferences = async (req, res, next) => {
  try {
    let preference = await Preference.findOne({ userId: req.user._id });
    
    if (!preference) {
      // Crear preferencias por defecto
      preference = await Preference.create({
        userId: req.user._id,
        role: req.user.role,
        availability: {
          manana: { lun: true, mar: true, mie: true, jue: true, vie: true },
          tarde: { lun: true, mar: true, mie: true, jue: true, vie: true },
          noche: { lun: false, mar: false, mie: false, jue: false, vie: false }
        },
        additionalPreferences: {
          avoidBefore8am: true,
          avoidGaps: true,
          preferFewerDays: true,
          groupSameSubjectConsecutive: false
        },
        priorityOrder: ['conflicts', 'institutional', 'gaps', 'personal']
      });
    }

    res.json(preference);
  } catch (error) {
    next(error);
  }
};

// PUT /api/preferences — Actualizar preferencias
exports.updateMyPreferences = async (req, res, next) => {
  try {
    const {
      availability,
      detailedAvailability,
      additionalPreferences,
      priorityOrder,
      preferredShift,
      worksWhileStudying
    } = req.body;

    let preference = await Preference.findOne({ userId: req.user._id });

    if (!preference) {
      preference = new Preference({
        userId: req.user._id,
        role: req.user.role
      });
    }

    if (availability) preference.availability = availability;
    if (detailedAvailability) preference.detailedAvailability = detailedAvailability;
    if (additionalPreferences) preference.additionalPreferences = additionalPreferences;
    if (priorityOrder) preference.priorityOrder = priorityOrder;
    if (preferredShift) preference.preferredShift = preferredShift;
    if (worksWhileStudying !== undefined) preference.worksWhileStudying = worksWhileStudying;

    await preference.save();
    res.json(preference);
  } catch (error) {
    next(error);
  }
};

// GET /api/preferences/availability/teachers — Disponibilidad de todos los docentes
exports.getTeacherAvailability = async (req, res, next) => {
  try {
    const teachers = await Teacher.find({ active: true })
      .select('name email department availability preferredShift specializations')
      .populate('specializations', 'name code');

    const preferences = await Preference.find({ role: 'docente' })
      .populate('userId', 'name email');

    // Merge teacher data with their preferences
    const result = teachers.map(teacher => {
      const pref = preferences.find(p => 
        p.userId?._id?.toString() === teacher.userId?.toString()
      );
      return {
        _id: teacher._id,
        name: teacher.name,
        department: teacher.department,
        specializations: teacher.specializations,
        availability: teacher.availability,
        preferredShift: teacher.preferredShift,
        preferenceAvailability: pref?.availability || null
      };
    });

    res.json({ count: result.length, teachers: result });
  } catch (error) {
    next(error);
  }
};

// GET /api/preferences/teachers/by-career — Docentes agrupados por carrera con estado de preferencias
// Las preferencias reales del docente son las que configura en su perfil (Teacher model):
// disponibilidad, turno preferido, días libres, especialidades, carga horaria.
exports.getTeachersByCareer = async (req, res, next) => {
  try {
    const Career = require('../models/Career');
    const [teachers, totalCareers] = await Promise.all([
      Teacher.find({ active: true })
        .select('name email department contractType administrativeLoad teachingHours preferredShift availability freeDays specializations updatedAt')
        .populate('specializations', 'name code')
        .sort({ department: 1, name: 1 })
        .lean(),
      Career.countDocuments({ active: true })
    ]);

    const daysMap = { lunes: 'lun', martes: 'mar', miercoles: 'mie', jueves: 'jue', viernes: 'vie', sabado: 'sab', domingo: 'dom' };

    // Group by department/career
    const grouped = {};
    let hasPrefCount = 0;

    for (const teacher of teachers) {
      const dept = teacher.department || 'Sin departamento';
      if (!grouped[dept]) grouped[dept] = { department: dept, teachers: [] };

      // Un docente tiene preferencias configuradas si:
      // - Tiene turno preferido (no indiferente)
      // - O tiene disponibilidad horaria definida
      // - O tiene días libres
      // - O tiene especialidades asignadas
      const hasShift = teacher.preferredShift && teacher.preferredShift !== 'indiferente';
      const hasAvailability = teacher.availability && teacher.availability.length > 0;
      const hasFreeDays = teacher.freeDays && teacher.freeDays.length > 0;
      const hasSpecializations = teacher.specializations && teacher.specializations.length > 0;
      const hasConfiguredPreferences = hasShift || hasAvailability || hasFreeDays || hasSpecializations;

      if (hasConfiguredPreferences) hasPrefCount++;

      // Build readable available days
      const availSlots = teacher.availability || [];
      const availableDays = [...new Set(availSlots.map(s => s.day))];
      const freeDayList = teacher.freeDays || [];

      grouped[dept].teachers.push({
        _id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        contractType: teacher.contractType,
        administrativeLoad: teacher.administrativeLoad,
        teachingHours: teacher.teachingHours,
        preferredShift: teacher.preferredShift,
        // Estado real de preferencias
        hasConfiguredPreferences,
        details: {
          hasShift,
          hasAvailability,
          hasFreeDays,
          hasSpecializations: teacher.specializations?.length || 0
        },
        availableDays,
        availabilitySlots: availSlots.map(s => ({
          day: s.day,
          startTime: s.startTime,
          endTime: s.endTime
        })),
        freeDays: freeDayList,
        specializations: (teacher.specializations || []).map(s => ({ code: s.code, name: s.name })),
        lastUpdated: teacher.updatedAt
      });
    }

    const careers = Object.values(grouped);

    // ── Aggregate stats ──
    const shiftDistribution = {
      manana: teachers.filter(t => t.preferredShift === 'manana').length,
      tarde: teachers.filter(t => t.preferredShift === 'tarde').length,
      noche: teachers.filter(t => t.preferredShift === 'noche').length,
      indiferente: teachers.filter(t => t.preferredShift === 'indiferente' || !t.preferredShift).length
    };

    const contractDistribution = {
      tc: teachers.filter(t => t.contractType === 'tiempo_completo' && !t.administrativeLoad).length,
      tcAdmin: teachers.filter(t => t.contractType === 'tiempo_completo' && t.administrativeLoad).length,
      ph: teachers.filter(t => t.contractType === 'por_horas').length
    };

    // Heatmap: teachers available per shift × day (using availability slots)
    const heatmapDays = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
    const heatmapShifts = ['manana', 'tarde', 'noche'];
    const heatmap = {};
    for (const shift of heatmapShifts) {
      heatmap[shift] = {};
      for (const day of heatmapDays) {
        heatmap[shift][day] = teachers.filter(t => {
          if (!t.availability || t.availability.length === 0) return false;
          const daySlots = t.availability.filter(a => a.day === day);
          if (daySlots.length === 0) return false;
          const hour = parseInt(daySlots[0].startTime.split(':')[0], 10);
          if (shift === 'manana') return hour < 13;
          if (shift === 'tarde') return hour >= 13 && hour < 19;
          return hour >= 19;
        }).length;
      }
    }

    res.json({
      totalTeachers: teachers.length,
      totalCareers,
      withPreferences: hasPrefCount,
      withoutPreferences: teachers.length - hasPrefCount,
      shiftDistribution,
      contractDistribution,
      heatmap,
      averageAvailability: teachers.length > 0
        ? Math.round(teachers.reduce((sum, t) => sum + (t.availability?.length || 0), 0) / teachers.length)
        : 0,
      careers
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/preferences/availability/students — Estadísticas de disponibilidad de alumnos
exports.getStudentAvailability = async (req, res, next) => {
  try {
    const totalStudents = await Student.countDocuments({ active: true });
    const preferences = await Preference.find({ role: 'estudiante' })
      .populate('userId', 'name email');

    // Calculate availability statistics
    const days = ['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom'];
    const shifts = ['manana', 'tarde', 'noche'];
    
    let totalAvailable = 0;
    let totalSlots = 0;

    const heatmap = {};
    for (const shift of shifts) {
      heatmap[shift] = {};
      for (const day of days) {
        const available = preferences.filter(p => p.availability?.[shift]?.[day] === true).length;
        heatmap[shift][day] = available;
        totalAvailable += available;
        totalSlots += preferences.length;
      }
    }

    const avgAvailability = totalSlots > 0 ? Math.round((totalAvailable / totalSlots) * 100) : 100;

    // Find best time slot
    let bestSlot = { shift: 'manana', day: 'lun', count: 0 };
    for (const shift of shifts) {
      for (const day of days) {
        if (heatmap[shift][day] > bestSlot.count) {
          bestSlot = { shift, day, count: heatmap[shift][day] };
        }
      }
    }

    // Recommended time slots
    const shiftTimes = { manana: '07:00 - 13:00', tarde: '14:00 - 19:00', noche: '19:00 - 22:00' };
    const allSlots = [];
    for (const shift of shifts) {
      for (const day of days) {
        allSlots.push({ shift, day, count: heatmap[shift][day], time: shiftTimes[shift] });
      }
    }
    allSlots.sort((a, b) => b.count - a.count);
    const recommended = allSlots.slice(0, 5).map((s, i) => ({
      rank: i + 1,
      shift: s.shift,
      day: s.day,
      time: shiftTimes[s.shift],
      percentage: preferences.length > 0 ? Math.round((s.count / preferences.length) * 100) : 0
    }));

    // Conflicts detected
    const workingStudents = preferences.filter(p => p.worksWhileStudying).length;

    // ── Listado individual de preferencias por estudiante ──
    const studentPreferences = preferences.map(p => {
      // Calculate student availability summary
      const availDays = days.filter(d =>
        shifts.some(s => p.availability?.[s]?.[d] === true)
      );
      return {
        userId: p.userId?._id,
        name: p.userId?.name || 'Sin nombre',
        email: p.userId?.email || '',
        preferredShift: p.preferredShift || 'indiferente',
        worksWhileStudying: p.worksWhileStudying || false,
        availableDays: availDays.length,
        availability: p.availability,
        additionalPreferences: p.additionalPreferences,
        updatedAt: p.updatedAt
      };
    });

    // ── Shift distribution summary ──
    const shiftDistribution = {
      manana: preferences.filter(p => p.preferredShift === 'manana').length,
      tarde: preferences.filter(p => p.preferredShift === 'tarde').length,
      noche: preferences.filter(p => p.preferredShift === 'noche').length,
      indiferente: preferences.filter(p => p.preferredShift === 'indiferente' || !p.preferredShift).length
    };

    res.json({
      totalStudents,
      respondedPreferences: preferences.length,
      pendingPreferences: totalStudents - preferences.length,
      averageAvailability: avgAvailability,
      bestTimeSlot: `${shiftTimes[bestSlot.shift]}`,
      conflictsDetected: workingStudents,
      heatmap,
      recommended,
      shiftDistribution,
      studentPreferences
    });
  } catch (error) {
    next(error);
  }
};
