const {
  getShift,
  calculateValidityScore,
  calculateInstitutionalScore,
  calculatePreferencesScore,
  calculateOptimizationScore,
  evaluateSolution,
  compareSolutions,
  detectUnsatisfiedConditions,
} = require('../../../engine/scoring');

describe('Scoring Engine', () => {
  describe('getShift', () => {
    it('Debe identificar turno mañana', () => {
      expect(getShift('08:00')).toBe('manana');
    });

    it('Debe identificar turno tarde', () => {
      expect(getShift('15:00')).toBe('tarde');
    });

    it('Debe identificar turno noche', () => {
      expect(getShift('20:00')).toBe('noche');
    });

    it('Debe usar policy shifts cuando están disponibles', () => {
      const policy = { shifts: { intensivo: { start: '06:00', end: '12:00' } } };
      expect(getShift('08:00', policy)).toBe('intensivo');
    });
  });

  describe('calculateValidityScore', () => {
    it('Debe devolver 100 si no hay solapamientos', () => {
      const a = [
        { teacherId: 't1', classroomId: 'r1', day: 'lunes', startTime: '08:00' },
        { teacherId: 't2', classroomId: 'r2', day: 'martes', startTime: '08:00' },
      ];
      expect(calculateValidityScore(a)).toBe(100);
    });

    it('Debe penalizar solapamiento de docente', () => {
      const a = [
        { teacherId: 't1', classroomId: 'r1', day: 'lunes', startTime: '08:00' },
        { teacherId: 't1', classroomId: 'r2', day: 'lunes', startTime: '08:00' },
      ];
      expect(calculateValidityScore(a)).toBeLessThan(100);
    });

    it('Debe penalizar solapamiento de aula', () => {
      const a = [
        { teacherId: 't1', classroomId: 'r1', day: 'lunes', startTime: '08:00' },
        { teacherId: 't2', classroomId: 'r1', day: 'lunes', startTime: '08:00' },
      ];
      expect(calculateValidityScore(a)).toBeLessThan(100);
    });

    it('Debe devolver 100 para lista vacía', () => {
      expect(calculateValidityScore([])).toBe(100);
    });
  });

  describe('calculateInstitutionalScore', () => {
    it('Debe devolver 100 si todo coincide', () => {
      const assignments = [{ courseId: 'c1', classroomId: 'r1' }];
      const courses = [{ _id: 'c1', type: 'teoria', maxStudents: 40 }];
      const classrooms = [{ _id: 'r1', type: 'teoria', capacity: 50 }];
      expect(calculateInstitutionalScore(assignments, courses, classrooms)).toBe(100);
    });

    it('Debe penalizar type mismatch', () => {
      const assignments = [{ courseId: 'c1', classroomId: 'r1' }];
      const courses = [{ _id: 'c1', type: 'laboratorio', maxStudents: 30 }];
      const classrooms = [{ _id: 'r1', type: 'teoria', capacity: 50 }];
      expect(calculateInstitutionalScore(assignments, courses, classrooms)).toBeLessThan(100);
    });

    it('Debe devolver 100 si no hay courses o classrooms', () => {
      const assignments = [{ courseId: 'c1', classroomId: 'r1' }];
      expect(calculateInstitutionalScore(assignments, [], [])).toBe(100);
    });
  });

  describe('calculatePreferencesScore', () => {
    it('Debe devolver score 85 si no hay preferencias', () => {
      const result = calculatePreferencesScore([], [], [], null);
      expect(result.score).toBe(85);
    });

    it('Debe calcular con preferencias de docente', () => {
      const assignments = [{ teacherId: 't1', day: 'lunes', startTime: '08:00' }];
      const teachers = [{ _id: 't1', name: 'Docente', userId: 'u1', preferredShift: 'manana' }];
      const preferences = [{ userId: 'u1', role: 'docente', preferredShift: 'manana' }];
      const result = calculatePreferencesScore(assignments, teachers, preferences, null);
      expect(result.score).toBeGreaterThan(0);
    });
  });

  describe('calculateOptimizationScore', () => {
    it('Debe devolver un score entre 0 y 100', () => {
      const result = calculateOptimizationScore([], [], [], [{ _id: 'r1' }]);
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(100);
    });

    it('Debe contar recursos usados', () => {
      const result = calculateOptimizationScore(
        [{ teacherId: 't1', classroomId: 'r1', day: 'lunes' },
         { teacherId: 't2', classroomId: 'r1', day: 'martes' }],
        [], [],
        [{ _id: 'r1' }, { _id: 'r2' }]
      );
      expect(result.resourceUsage).toBe(50);
    });
  });

  describe('evaluateSolution', () => {
    it('Debe calcular score overall', () => {
      const result = evaluateSolution([], [], [], [], [], null);
      expect(result).toHaveProperty('overall');
      expect(result).toHaveProperty('validity');
      expect(result).toHaveProperty('institutional');
      expect(result).toHaveProperty('preferencesScore');
      expect(result).toHaveProperty('optimization');
      expect(result).toHaveProperty('breakdown');
    });

    it('Debe respetar pesos personalizados del policy', () => {
      const policy = {
        priorityWeights: { validity: 0.5, institutional: 0.3, preferences: 0.1, optimization: 0.1 }
      };
      const result = evaluateSolution([], [], [], [], [], policy);
      expect(result.overall).toBeGreaterThanOrEqual(0);
    });
  });

  describe('compareSolutions', () => {
    it('Debe comparar dos soluciones', () => {
      const a = { overall: 80, validity: 90, institutional: 80, preferencesScore: 70, optimization: 80 };
      const b = { overall: 85, validity: 95, institutional: 85, preferencesScore: 75, optimization: 85 };
      const result = compareSolutions(a, b);
      expect(result.overall.diff).toBe(5);
      expect(result.validezHorario.diff).toBe(5);
    });
  });

  describe('detectUnsatisfiedConditions', () => {
    it('Debe detectar huecos en preferencias', () => {
      const result = { preferencesDetails: [{ type: 'gap' }, { type: 'gap' }], daysUsed: 5, preferencesScore: 60 };
      const conditions = detectUnsatisfiedConditions(result, []);
      expect(conditions.length).toBeGreaterThan(0);
    });

    it('Debe devolver vacío si no hay condiciones', () => {
      const result = { preferencesDetails: [], daysUsed: 3, preferencesScore: 85 };
      const conditions = detectUnsatisfiedConditions(result, []);
      expect(conditions).toHaveLength(0);
    });
  });
});
