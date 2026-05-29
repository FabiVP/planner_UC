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
