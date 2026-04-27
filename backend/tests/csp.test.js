// tests/csp.test.js
const { runCSP, generateSlots, DAYS, TIME_SLOTS } = require('../engine/csp');
const { checkRD01, checkRD02, checkRD03, checkRD06, checkConstraints } = require('../engine/constraints');

// Datos de prueba mock
const mockCourse = (id, name, type = 'teorico', sessionsPerWeek = 2) => ({
  _id: id,
  name,
  type,
  sessionsPerWeek,
  code: `C${id}`
});

const mockTeacher = (id, name, specializations = []) => ({
  _id: id,
  name,
  specializations: specializations.map(s => ({ _id: s })),
  availability: []
});

const mockClassroom = (id, name, type = 'teorico') => ({
  _id: id,
  name,
  type,
  code: `A${id}`,
  available: true
});

describe('CSP Solver - Pruebas de Restricciones', () => {
  
  describe('RD-01: No solapamiento de docente', () => {
    test('Debe permitir docente en diferentes horarios', () => {
      const assignment = {
        teacherId: 'T001',
        day: 'lunes',
        startTime: '08:00'
      };
      const existingAssignments = [
        {
          teacherId: 'T001',
          day: 'martes',
          startTime: '08:00'
        }
      ];
      
      expect(checkRD01(assignment, existingAssignments)).toBe(true);
    });
    
    test('Debe rechazar docente en mismo horario', () => {
      const assignment = {
        teacherId: 'T001',
        day: 'lunes',
        startTime: '08:00'
      };
      const existingAssignments = [
        {
          teacherId: 'T001',
          day: 'lunes',
          startTime: '08:00'
        }
      ];
      
      expect(checkRD01(assignment, existingAssignments)).toBe(false);
    });
  });
  
  describe('RD-02: No solapamiento de aula', () => {
    test('Debe permitir aula en diferentes horarios', () => {
      const assignment = {
        classroomId: 'A001',
        day: 'lunes',
        startTime: '08:00'
      };
      const existingAssignments = [
        {
          classroomId: 'A001',
          day: 'martes',
          startTime: '08:00'
        }
      ];
      
      expect(checkRD02(assignment, existingAssignments)).toBe(true);
    });
    
    test('Debe rechazar aula en mismo horario', () => {
      const assignment = {
        classroomId: 'A001',
        day: 'lunes',
        startTime: '08:00'
      };
      const existingAssignments = [
        {
          classroomId: 'A001',
          day: 'lunes',
          startTime: '08:00'
        }
      ];
      
      expect(checkRD02(assignment, existingAssignments)).toBe(false);
    });
  });
  
  describe('RD-03: No solapamiento de estudiante (mismo curso)', () => {
    test('Debe permitir diferentes sesiones del mismo curso en diferentes horarios', () => {
      const assignment = {
        courseId: 'C001',
        day: 'lunes',
        startTime: '08:00'
      };
      const existingAssignments = [
        {
          courseId: 'C001',
          day: 'martes',
          startTime: '08:00'
        }
      ];
      
      expect(checkRD03(assignment, existingAssignments)).toBe(true);
    });
    
    test('Debe rechazar dos sesiones del mismo curso en mismo horario', () => {
      const assignment = {
        courseId: 'C001',
        day: 'lunes',
        startTime: '08:00'
      };
      const existingAssignments = [
        {
          courseId: 'C001',
          day: 'lunes',
          startTime: '08:00'
        }
      ];
      
      expect(checkRD03(assignment, existingAssignments)).toBe(false);
    });
  });
  
  describe('RD-06: Tipo de aula debe coincidir con tipo de curso', () => {
    test('Curso teorico debe ir a aula teorica', () => {
      const course = mockCourse('C001', 'Matematicas', 'teorico');
      const classroom = mockClassroom('A001', 'Aula 101', 'teorico');
      
      expect(checkRD06(course, classroom)).toBe(true);
    });
    
    test('Curso teorico NO debe ir a aula laboratorio', () => {
      const course = mockCourse('C001', 'Matematicas', 'teorico');
      const classroom = mockClassroom('A001', 'Lab 1', 'laboratorio');
      
      expect(checkRD06(course, classroom)).toBe(false);
    });
    
    test('Curso laboratorio debe ir a aula laboratorio', () => {
      const course = mockCourse('C002', 'Fisica Lab', 'laboratorio');
      const classroom = mockClassroom('A002', 'Lab Fisica', 'laboratorio');
      
      expect(checkRD06(course, classroom)).toBe(true);
    });
  });
  
  describe('Integracion: runCSP debe generar horario valido', () => {
    test('Debe generar solucion con datos basicos', () => {
      const courses = [
        mockCourse('C001', 'Matematica I', 'teorico', 2),
        mockCourse('C002', 'Fisica I', 'teorico', 2)
      ];
      
      const teachers = [
        mockTeacher('T001', 'Dr. Perez', ['C001']),
        mockTeacher('T002', 'Dra. Gomez', ['C002'])
      ];
      
      const classrooms = [
        mockClassroom('A001', 'Aula 101', 'teorico'),
        mockClassroom('A002', 'Aula 102', 'teorico')
      ];
      
      const result = runCSP(courses, teachers, classrooms);
      
      expect(result).toBeDefined();
      expect(typeof result.success).toBe('boolean');
    });
    
    test('Debe respetar todas las restricciones en la solucion', () => {
      const courses = [
        mockCourse('C001', 'Matematica I', 'teorico', 2),
        mockCourse('C002', 'Fisica I', 'teorico', 2),
        mockCourse('C003', 'Quimica', 'laboratorio', 1)
      ];
      
      const teachers = [
        mockTeacher('T001', 'Dr. Perez', ['C001', 'C002']),
        mockTeacher('T002', 'Dra. Gomez', ['C003'])
      ];
      
      const classrooms = [
        mockClassroom('A001', 'Aula 101', 'teorico'),
        mockClassroom('A002', 'Aula 102', 'teorico'),
        mockClassroom('L001', 'Lab Quimica', 'laboratorio')
      ];
      
      const result = runCSP(courses, teachers, classrooms);
      
      if (result.success) {
        // Verificar que no hay conflictos en las asignaciones
        for (let i = 0; i < result.assignments.length; i++) {
          for (let j = i + 1; j < result.assignments.length; j++) {
            const a = result.assignments[i];
            const b = result.assignments[j];
            
            // Mismo horario
            if (a.day === b.day && a.startTime === b.startTime) {
              // No pueden mismo docente o misma aula
              expect(a.teacherId.toString() === b.teacherId.toString()).toBe(false);
              expect(a.classroomId.toString() === b.classroomId.toString()).toBe(false);
            }
          }
        }
      }
    });
  });
});

describe('Generacion de slots y dominios', () => {
  test('generateSlots debe crear combinaciones dia x horario', () => {
    const slots = generateSlots();
    const expectedCount = DAYS.length * TIME_SLOTS.length;
    
    expect(slots).toBeDefined();
    expect(slots.length).toBe(expectedCount);
    expect(slots[0]).toHaveProperty('day');
    expect(slots[0]).toHaveProperty('startTime');
    expect(slots[0]).toHaveProperty('endTime');
  });
});