// GET /api/restrictions — Listar restricciones institucionales
exports.getAll = async (req, res, next) => {
  try {
    // Restricciones institucionales predefinidas del sistema
    const restrictions = [
      {
        id: 'RD-01',
        category: 'institucional',
        rule: 'Créditos limitados',
        description: 'No puede inscribir más de 22 créditos.',
        active: true,
        type: 'dura'
      },
      {
        id: 'RD-02',
        category: 'institucional',
        rule: 'Choque de horarios',
        description: 'No se permite clases en el mismo horario.',
        active: true,
        type: 'dura'
      },
      {
        id: 'RD-03',
        category: 'institucional',
        rule: 'Requisitos de materia',
        description: 'Debe cumplir con los requisitos de cada materia.',
        active: true,
        type: 'dura'
      },
      {
        id: 'RD-04',
        category: 'institucional',
        rule: 'Obligatoriedad',
        description: 'Debe incluir todas las materias obligatorias del plan de estudios.',
        active: true,
        type: 'dura'
      },
      {
        id: 'RD-05',
        category: 'institucional',
        rule: 'Capacidad de aula',
        description: 'Solo se asignan materias con la capacidad adecuada de cupo.',
        active: true,
        type: 'dura'
      },
      {
        id: 'RD-06',
        category: 'institucional',
        rule: 'Tipo de aula',
        description: 'El tipo de aula debe corresponder al tipo de materia.',
        active: true,
        type: 'dura'
      },
      {
        id: 'RD-07',
        category: 'institucional',
        rule: 'Disponibilidad docente',
        description: 'Respetar la disponibilidad horaria del docente.',
        active: true,
        type: 'dura'
      },
      {
        id: 'RD-08',
        category: 'institucional',
        rule: 'Carga máxima docente',
        description: 'Límite de horas y cursos según tipo de contrato: Tiempo Completo (40h/sem, 4 cursos) o Por Horas (20h/sem, 2 cursos).',
        active: true,
        type: 'dura'
      },
      {
        id: 'RD-09',
        category: 'institucional',
        rule: 'Horario institucional',
        description: 'Las clases solo pueden programarse entre las 7:00 a.m. y las 10:00 p.m., de lunes a domingo.',
        active: true,
        type: 'dura'
      },
      {
        id: 'RD-10',
        category: 'institucional',
        rule: 'Horas continuas docente',
        description: 'Un docente no puede dictar más de 4 horas consecutivas de clase.',
        active: true,
        type: 'dura'
      },
      {
        id: 'RD-11',
        category: 'institucional',
        rule: 'Distribución de sesiones',
        description: 'Las sesiones del mismo curso deben programarse en días diferentes para mejor aprendizaje.',
        active: true,
        type: 'dura'
      },
      {
        id: 'RD-12',
        category: 'institucional',
        rule: 'Horario de almuerzo bloqueado',
        description: 'No se pueden programar clases entre la 1:00 p.m. y las 2:00 p.m. (horario de almuerzo institucional).',
        active: true,
        type: 'dura'
      },
      {
        id: 'RD-13',
        category: 'institucional',
        rule: 'Vinculación tripartita',
        description: 'Solo se programan cursos que estén vinculados entre administrador, docente asignado y estudiantes matriculados.',
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
