const Campus = require('../models/Campus');
const Classroom = require('../models/Classroom');

/**
 * Sincroniza las aulas definidas dentro de los edificios del campus
 * hacia el modelo Classroom.
 * 
 * - Solo CREA aulas nuevas (código no existente en la colección).
 * - NO sobrescribe aulas existentes (ya fueron editadas desde Aulas).
 * - Desactiva aulas cuyo código ya no está en el campus.
 */
const syncClassrooms = async (campus) => {
  if (!campus.buildings || campus.buildings.length === 0) return;

  const existingCodes = [];

  for (const building of campus.buildings) {
    if (!building.floors || building.floors.length === 0) continue;
    for (const floor of building.floors) {
      if (!floor.rooms || floor.rooms.length === 0) continue;
      for (const room of floor.rooms) {
        existingCodes.push(room.code);
        const typeMap = {
          'laboratorio_computo': 'laboratorio',
          'laboratorio_practica': 'laboratorio',
          'teorico': 'teorico'
        };
        // Solo crear si NO existe un aula con ese código
        const exists = await Classroom.findOne({ code: room.code });
        if (!exists) {
          await Classroom.create({
            code: room.code,
            name: room.name || `${building.code}-${room.code}`,
            capacity: room.capacity,
            type: typeMap[room.type] || 'teorico',
            campus: campus._id,
            building: building.code,
            floor: floor.floorNumber,
            available: true
          });
        }
      }
    }
  }

  // Desactivar aulas vinculadas a este campus que ya no están en la lista
  await Classroom.updateMany(
    { campus: campus._id, code: { $nin: existingCodes } },
    { available: false }
  );
};

exports.getAll = async (req, res, next) => {
  try {
    const campuses = await Campus.find({ active: true })
      .populate('travelTimes.toCampusId', 'code name')
      .sort({ name: 1 });
    res.json({ count: campuses.length, campuses });
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const campus = await Campus.findById(req.params.id)
      .populate('travelTimes.toCampusId', 'code name');
    if (!campus) return res.status(404).json({ message: 'Campus no encontrado.' });
    res.json(campus);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const campus = await Campus.create(req.body);
    await syncClassrooms(campus);
    res.status(201).json({ message: 'Campus creado con aulas sincronizadas.', campus });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const campus = await Campus.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!campus) return res.status(404).json({ message: 'Campus no encontrado.' });
    await syncClassrooms(campus);
    res.json({ message: 'Campus actualizado con aulas sincronizadas.', campus });
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const campus = await Campus.findByIdAndUpdate(req.params.id, { active: false }, { new: true });
    if (!campus) return res.status(404).json({ message: 'Campus no encontrado.' });
    await Classroom.updateMany({ campus: campus._id }, { available: false });
    res.json({ message: 'Campus desactivado. Aulas marcadas como no disponibles.' });
  } catch (error) {
    next(error);
  }
};
