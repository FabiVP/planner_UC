const {
  checkRD01, checkRD02, checkRD03, checkRD04, checkRD05,
  checkRD06_TeacherAvailability, checkRD07_ClassroomAvailability,
  checkRD08_TeacherLoad, checkRD09_InstitutionalSchedule,
  checkRD10_ContinuousHours, checkRD11_DayDistribution,
  checkRD12_BlockedTimeSlots, checkRD13_PH_Preferences,
  checkRD14_CreditLimit, checkAllConstraints,
  timesOverlap, addHours, timeToMinutes
} = require('../../../engine/constraints');

describe('Constraint Helpers', () => {
  describe('timesOverlap', () => {
    it('Debe detectar solapamiento', () => {
      expect(timesOverlap('08:00', '09:00', '08:30', '09:30')).toBe(true);
    });

    it('Debe detectar no solapamiento', () => {
      expect(timesOverlap('08:00', '09:00', '09:00', '10:00')).toBe(false);
    });

    it('Debe detectar solapamiento exacto', () => {
      expect(timesOverlap('08:00', '09:00', '08:00', '09:00')).toBe(true);
    });
  });

  describe('addHours', () => {
    it('Debe sumar horas correctamente', () => {
      expect(addHours('08:00', 2)).toBe('10:00');
    });

    it('Debe cruzar el mediodía', () => {
      expect(addHours('11:30', 1)).toBe('12:30');
    });
  });

  describe('timeToMinutes', () => {
    it('Debe convertir hora a minutos', () => {
      expect(timeToMinutes('08:00')).toBe(480);
    });

    it('Debe manejar minutos', () => {
      expect(timeToMinutes('09:30')).toBe(570);
    });
  });
});

describe('RD-01: No solapamiento de docente', () => {
  it('Debe rechazar docente en mismo día y horario', () => {
    const assignment = { teacherId: 't1', day: 'lunes', startTime: '08:00', endTime: '09:00' };
    const existing = [{ teacherId: 't1', day: 'lunes', startTime: '08:00', endTime: '09:00' }];
    expect(checkRD01(assignment, existing)).toBe(false);
  });

  it('Debe permitir docente en diferente horario', () => {
    const assignment = { teacherId: 't1', day: 'lunes', startTime: '10:00', endTime: '11:00' };
    const existing = [{ teacherId: 't1', day: 'lunes', startTime: '08:00', endTime: '09:00' }];
    expect(checkRD01(assignment, existing)).toBe(true);
  });

  it('Debe permitir docente en diferente día', () => {
    const assignment = { teacherId: 't1', day: 'martes', startTime: '08:00', endTime: '09:00' };
    const existing = [{ teacherId: 't1', day: 'lunes', startTime: '08:00', endTime: '09:00' }];
    expect(checkRD01(assignment, existing)).toBe(true);
  });

  it('Debe permitir diferentes docentes mismo horario', () => {
    const assignment = { teacherId: 't2', day: 'lunes', startTime: '08:00', endTime: '09:00' };
    const existing = [{ teacherId: 't1', day: 'lunes', startTime: '08:00', endTime: '09:00' }];
    expect(checkRD01(assignment, existing)).toBe(true);
  });
});

describe('RD-02: No solapamiento de aula', () => {
  it('Debe rechazar misma aula en mismo horario', () => {
    const assignment = { classroomId: 'a1', day: 'lunes', startTime: '08:00', endTime: '09:00' };
    const existing = [{ classroomId: 'a1', day: 'lunes', startTime: '08:00', endTime: '09:00' }];
    expect(checkRD02(assignment, existing)).toBe(false);
  });

  it('Debe permitir misma aula en diferente horario', () => {
    const assignment = { classroomId: 'a1', day: 'lunes', startTime: '10:00', endTime: '11:00' };
    const existing = [{ classroomId: 'a1', day: 'lunes', startTime: '08:00', endTime: '09:00' }];
    expect(checkRD02(assignment, existing)).toBe(true);
  });
});

describe('RD-03: No solapamiento de estudiante', () => {
  const courses = [
    { _id: 'c1', career: 'ing', semester: 3 },
    { _id: 'c2', career: 'ing', semester: 3 }
  ];

  it('Debe rechazar cursos del mismo semestre/carrera en mismo horario', () => {
    const assignment = { courseId: 'c1', day: 'lunes', startTime: '08:00', endTime: '09:00' };
    const existing = [{ courseId: 'c2', day: 'lunes', startTime: '08:00', endTime: '09:00' }];
    expect(checkRD03(assignment, existing, courses)).toBe(false);
  });

  it('Debe permitir si es diferente semestre', () => {
    const diffCourses = [
      { _id: 'c1', career: 'ing', semester: 3 },
      { _id: 'c2', career: 'ing', semester: 5 }
    ];
    const assignment = { courseId: 'c1', day: 'lunes', startTime: '08:00', endTime: '09:00' };
    const existing = [{ courseId: 'c2', day: 'lunes', startTime: '08:00', endTime: '09:00' }];
    expect(checkRD03(assignment, existing, diffCourses)).toBe(true);
  });

  it('Debe retornar true si no hay cursos', () => {
    expect(checkRD03({ courseId: 'c1' }, [], null)).toBe(true);
  });
});

describe('RD-04: Capacidad de aula', () => {
  it('Debe aprobar si capacidad es suficiente', () => {
    const course = { maxStudents: 30 };
    const classroom = { capacity: 40 };
    expect(checkRD04(course, classroom)).toBe(true);
  });

  it('Debe rechazar si capacidad es insuficiente', () => {
    const course = { maxStudents: 50 };
    const classroom = { capacity: 30 };
    expect(checkRD04(course, classroom)).toBe(false);
  });

  it('Debe retornar true si no hay course o classroom', () => {
    expect(checkRD04(null, null)).toBe(true);
  });
});

describe('RD-05: Tipo de aula = tipo de curso', () => {
  it('Debe aprobar si los tipos coinciden', () => {
    expect(checkRD05({ type: 'teorico' }, { type: 'teorico' })).toBe(true);
    expect(checkRD05({ type: 'laboratorio' }, { type: 'laboratorio' })).toBe(true);
  });

  it('Debe rechazar si los tipos no coinciden', () => {
    expect(checkRD05({ type: 'teorico' }, { type: 'laboratorio' })).toBe(false);
  });

  it('Debe permitir aula_virtual para teórico si policy lo permite', () => {
    expect(checkRD05({ type: 'teorico' }, { type: 'aula_virtual' }, { classroomRules: { allowVirtualClassrooms: true } })).toBe(true);
  });

  it('Debe rechazar aula_virtual para teórico si policy no lo permite', () => {
    expect(checkRD05({ type: 'teorico' }, { type: 'aula_virtual' }, { classroomRules: { allowVirtualClassrooms: false } })).toBe(false);
  });
});

describe('RD-06: Disponibilidad del docente', () => {
  it('Debe permitir si no hay restricciones', () => {
    const teacher = { freeDays: [], availability: [] };
    expect(checkRD06_TeacherAvailability({ day: 'lunes' }, teacher)).toBe(true);
  });

  it('Debe rechazar si el día es libre', () => {
    const teacher = { freeDays: ['lunes'], availability: [] };
    expect(checkRD06_TeacherAvailability({ day: 'lunes' }, teacher)).toBe(false);
  });

  it('Debe rechazar si fuera de la ventana de disponibilidad', () => {
    const teacher = {
      freeDays: [],
      availability: [{ day: 'lunes', startTime: '08:00', endTime: '12:00' }]
    };
    expect(checkRD06_TeacherAvailability({ day: 'lunes', startTime: '14:00', endTime: '15:00' }, teacher)).toBe(false);
  });

  it('Debe permitir si dentro de la ventana de disponibilidad', () => {
    const teacher = {
      freeDays: [],
      availability: [{ day: 'lunes', startTime: '08:00', endTime: '12:00' }]
    };
    expect(checkRD06_TeacherAvailability({ day: 'lunes', startTime: '09:00', endTime: '10:00' }, teacher)).toBe(true);
  });
});

describe('RD-08: Carga máxima del docente', () => {
  it('Debe rechazar si excede maxCourses', () => {
    const teacher = { maxCourses: 2, contractType: 'tiempo_completo', teachingHours: 40, maxWeeklyHours: 40 };
    const existing = [
      { teacherId: 't1', courseId: 'c1' },
      { teacherId: 't1', courseId: 'c2' }
    ];
    const assignment = { teacherId: 't1', courseId: 'c3', hoursPerSession: 1 };
    expect(checkRD08_TeacherLoad(assignment, existing, teacher)).toBe(false);
  });

  it('Debe rechazar si excede horas semanales', () => {
    const teacher = { maxCourses: 5, contractType: 'tiempo_completo', teachingHours: 4, maxWeeklyHours: 4 };
    const existing = [
      { teacherId: 't1', courseId: 'c1', hoursPerSession: 3 }
    ];
    const assignment = { teacherId: 't1', courseId: 'c2', hoursPerSession: 2 };
    expect(checkRD08_TeacherLoad(assignment, existing, teacher)).toBe(false);
  });

  it('Debe permitir si está dentro de los límites', () => {
    const teacher = { maxCourses: 5, contractType: 'tiempo_completo', teachingHours: 40, maxWeeklyHours: 40 };
    const existing = [];
    const assignment = { teacherId: 't1', courseId: 'c1', hoursPerSession: 4 };
    expect(checkRD08_TeacherLoad(assignment, existing, teacher)).toBe(true);
  });
});

describe('RD-09: Horario institucional', () => {
  it('Debe rechazar si está fuera de la ventana', () => {
    const policy = { allowedSchedule: { startTime: '08:00', endTime: '18:00' } };
    expect(checkRD09_InstitutionalSchedule({ startTime: '07:00', endTime: '08:00', day: 'lunes' }, policy)).toBe(false);
  });

  it('Debe permitir si está dentro de la ventana', () => {
    const policy = { allowedSchedule: { startTime: '08:00', endTime: '18:00' } };
    expect(checkRD09_InstitutionalSchedule({ startTime: '09:00', endTime: '10:00', day: 'lunes' }, policy)).toBe(true);
  });

  it('Debe rechazar si el día no está activo', () => {
    const policy = { allowedSchedule: { activeDays: ['lunes', 'martes'], startTime: '08:00', endTime: '18:00' } };
    expect(checkRD09_InstitutionalSchedule({ startTime: '09:00', endTime: '10:00', day: 'domingo' }, policy)).toBe(false);
  });
});

describe('RD-10: Horas continuas', () => {
  it('Debe rechazar si excede el máximo de horas continuas', () => {
    const policy = { teacherLimits: { maxContinuousHours: 4 } };
    const existing = [
      { teacherId: 't1', day: 'lunes', startTime: '08:00', endTime: '09:00', hoursPerSession: 1 }
    ];
    const assignment = { teacherId: 't1', day: 'lunes', startTime: '09:00', endTime: '13:00', hoursPerSession: 4 };
    expect(checkRD10_ContinuousHours(assignment, existing, policy)).toBe(false);
  });

  it('Debe permitir si no excede el máximo', () => {
    const existing = [];
    const assignment = { teacherId: 't1', day: 'lunes', startTime: '08:00', endTime: '10:00', hoursPerSession: 2 };
    expect(checkRD10_ContinuousHours(assignment, existing, {})).toBe(true);
  });
});

describe('RD-11: Distribución en días', () => {
  it('Debe rechazar dos sesiones del mismo curso en el mismo día', () => {
    const existing = [{ courseId: 'c1', day: 'lunes' }];
    const assignment = { courseId: 'c1', day: 'lunes' };
    expect(checkRD11_DayDistribution(assignment, existing)).toBe(false);
  });

  it('Debe permitir sesiones en diferentes días', () => {
    const existing = [{ courseId: 'c1', day: 'lunes' }];
    const assignment = { courseId: 'c1', day: 'martes' };
    expect(checkRD11_DayDistribution(assignment, existing)).toBe(true);
  });
});

describe('RD-12: Bloques bloqueados', () => {
  it('Debe rechazar asignación en bloque bloqueado', () => {
    const policy = { allowedSchedule: { blockedTimeSlots: [{ start: '13:00', end: '14:00' }] } };
    expect(checkRD12_BlockedTimeSlots({ startTime: '13:00', endTime: '14:00' }, policy)).toBe(false);
  });

  it('Debe permitir fuera del bloque bloqueado', () => {
    const policy = { allowedSchedule: { blockedTimeSlots: [{ start: '13:00', end: '14:00' }] } };
    expect(checkRD12_BlockedTimeSlots({ startTime: '10:00', endTime: '11:00' }, policy)).toBe(true);
  });

  it('Debe retornar true si no hay bloques definidos', () => {
    expect(checkRD12_BlockedTimeSlots({ startTime: '13:00' }, { allowedSchedule: {} })).toBe(true);
  });
});

describe('RD-14: Límite de créditos', () => {
  it('Debe rechazar si excede el máximo de créditos', () => {
    const courses = [
      { semester: 3, credits: 15 },
      { semester: 3, credits: 15 }
    ];
    const policy = { enrollmentRules: { minCreditsPerSemester: 12, maxCreditsPerSemester: 25 } };
    expect(checkRD14_CreditLimit(courses, policy)).toBe(false);
  });

  it('Debe permitir si está dentro del rango', () => {
    const courses = [
      { semester: 3, credits: 10 },
      { semester: 3, credits: 10 }
    ];
    const policy = { enrollmentRules: { minCreditsPerSemester: 12, maxCreditsPerSemester: 25 } };
    expect(checkRD14_CreditLimit(courses, policy)).toBe(true);
  });

  it('Debe retornar true si no hay policy', () => {
    expect(checkRD14_CreditLimit([{ semester: 1, credits: 30 }], null)).toBe(true);
  });
});

describe('checkAllConstraints', () => {
  it('Debe retornar válido para asignación sin conflictos', () => {
    const result = checkAllConstraints(
      { teacherId: 't1', classroomId: 'a1', day: 'lunes', startTime: '08:00', endTime: '09:00', courseId: 'c1' },
      [],
      {
        course: { type: 'teorico', maxStudents: 30 },
        teacher: { freeDays: [], availability: [], contractType: 'tiempo_completo', maxCourses: 5, teachingHours: 40 },
        classroom: { capacity: 40, type: 'teorico', available: true, availabilitySchedule: [] },
        courses: [{ _id: 'c1', career: 'ing', semester: 3 }],
        policy: {}
      }
    );
    expect(result.valid).toBe(true);
    expect(result.violations).toEqual([]);
  });

  it('Debe detectar violación de tipo de aula', () => {
    const result = checkAllConstraints(
      { teacherId: 't1', classroomId: 'a1', day: 'lunes', startTime: '08:00', endTime: '09:00', courseId: 'c1' },
      [],
      {
        course: { type: 'laboratorio', maxStudents: 30 },
        teacher: { freeDays: [], availability: [], contractType: 'tiempo_completo', maxCourses: 5, teachingHours: 40 },
        classroom: { capacity: 40, type: 'teorico', available: true, availabilitySchedule: [] },
        courses: [{ _id: 'c1', career: 'ing', semester: 3 }],
        policy: {}
      }
    );
    expect(result.valid).toBe(false);
    expect(result.violations.some(v => v.includes('RD-05'))).toBe(true);
  });
});
