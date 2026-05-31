// GET /api/restrictions — Listar restricciones institucionales
exports.getAll = async (req, res, next) => {
  try {
    // Restricciones institucionales del motor CSP (constraints.js)
    const restrictions = [
      {
        id: 'RD-01',
        category: 'institucional',
        rule: 'No solapamiento de docente',
        description: 'Un docente no puede estar asignado a dos cursos al mismo tiempo.',
        active: true,
        type: 'dura'
      },
      {
        id: 'RD-02',
        category: 'institucional',
        rule: 'No solapamiento de aula',
        description: 'Un aula no puede ser asignada a dos cursos al mismo tiempo.',
        active: true,
        type: 'dura'
      },
      {
        id: 'RD-03',
        category: 'institucional',
        rule: 'No solapamiento de estudiantes',
        description: 'Cursos del mismo semestre y carrera no deben solaparse.',
        active: true,
        type: 'dura'
      },
      {
        id: 'RD-04',
        category: 'institucional',
        rule: 'Capacidad de aula (aforo)',
        description: 'El aula debe tener capacidad suficiente para los alumnos del curso.',
        active: true,
        type: 'dura'
      },
      {
        id: 'RD-05',
        category: 'institucional',
        rule: 'Tipo de infraestructura',
        description: 'El tipo de aula debe corresponder al tipo de curso (teórico/laboratorio).',
        active: true,
        type: 'dura'
      },
      {
        id: 'RD-06',
        category: 'institucional',
        rule: 'Disponibilidad del docente',
        description: 'La asignación debe estar dentro de la disponibilidad horaria y días libres del docente.',
        active: true,
        type: 'dura'
      },
      {
        id: 'RD-07',
        category: 'institucional',
        rule: 'Disponibilidad del aula',
        description: 'La asignación debe estar dentro del horario disponible del aula.',
        active: true,
        type: 'dura'
      },
      {
        id: 'RD-08',
        category: 'institucional',
        rule: 'Carga máxima del docente',
        description: 'Límite de horas y cursos según tipo de contrato: TC sin carga admin (36h), TC con carga admin (24h), PH (20h).',
        active: true,
        type: 'dura'
      },
      {
        id: 'RD-09',
        category: 'institucional',
        rule: 'Horario institucional',
        description: 'Las clases solo pueden programarse dentro de la ventana horaria y días activos definidos por la institución.',
        active: true,
        type: 'dura'
      },
      {
        id: 'RD-10',
        category: 'institucional',
        rule: 'Horas continuas por docente',
        description: 'Un docente no puede dictar más de 4 horas consecutivas de clase.',
        active: true,
        type: 'dura'
      },
      {
        id: 'RD-11',
        category: 'institucional',
        rule: 'Distribución de sesiones',
        description: 'Las sesiones del mismo curso deben programarse en días diferentes.',
        active: true,
        type: 'dura'
      },
      {
        id: 'RD-12',
        category: 'institucional',
        rule: 'Bloques horarios bloqueados',
        description: 'No se pueden programar clases en bloques bloqueados (ej: almuerzo 13:00-14:00).',
        active: true,
        type: 'dura'
      },
      {
        id: 'RD-13',
        category: 'institucional',
        rule: 'Preferencia de turno para docentes PH',
        description: 'Los docentes por horas tienen su turno preferido como restricción obligatoria.',
        active: true,
        type: 'dura'
      },
      {
        id: 'RD-14',
        category: 'institucional',
        rule: 'Límite de créditos por semestre',
        description: 'La suma de créditos de los cursos de cada semestre debe estar entre 12 y 25.',
        active: true,
        type: 'dura'
      },
      {
        id: 'RS-01',
        category: 'preferencia',
        rule: 'Preferencia horaria docente',
        description: 'Considerar turno preferido del docente.',
        active: true,
        type: 'blanda'
      },
      {
        id: 'RS-02',
        category: 'preferencia',
        rule: 'Preferencia horaria estudiante',
        description: 'Considerar turno preferido del estudiante.',
        active: true,
        type: 'blanda'
      },
      {
        id: 'RS-03',
        category: 'preferencia',
        rule: 'Minimización de huecos',
        description: 'Reducir huecos entre clases para optimizar tiempo.',
        active: true,
        type: 'blanda'
      },
      {
        id: 'RS-04',
        category: 'preferencia',
        rule: 'Agrupación de días',
        description: 'Agrupar clases en menos días cuando sea posible.',
        active: true,
        type: 'blanda'
      }
    ];

    const { type } = req.query;
    const filtered = type 
      ? restrictions.filter(r => r.category === type)
      : restrictions;

    res.json({ count: filtered.length, restrictions: filtered });
  } catch (error) {
    next(error);
  }
};
