const Generation = require('../../../models/Generation');
const Schedule = require('../../../models/Schedule');
const Course = require('../../../models/Course');
const Teacher = require('../../../models/Teacher');
const Classroom = require('../../../models/Classroom');
const Preference = require('../../../models/Preference');
const InstitutionalPolicy = require('../../../models/InstitutionalPolicy');
const {
  generate,
  getAll,
  getById,
  restore,
  remove
} = require('../../../controllers/generation.controller');

jest.mock('../../../models/Generation');
jest.mock('../../../models/Schedule');
jest.mock('../../../models/Course');
jest.mock('../../../models/Teacher');
jest.mock('../../../models/Classroom');
jest.mock('../../../models/Preference');
jest.mock('../../../models/InstitutionalPolicy');
jest.mock('../../../engine/csp', () => ({
  runCSPMultiple: jest.fn()
}));
jest.mock('../../../controllers/notification.controller', () => ({
  createNotification: jest.fn().mockResolvedValue(true)
}));

const { runCSPMultiple } = require('../../../engine/csp');

describe('Generation Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {}, params: {}, query: {}, user: { _id: 'admin1' } };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    test('Debe retornar lista paginada de generaciones', async () => {
      req.query = { page: '1', limit: '10' };
      const mockGens = [{ _id: '1', name: 'Gen1' }];
      Generation.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnValue({
            skip: jest.fn().mockReturnValue({
              limit: jest.fn().mockResolvedValue(mockGens)
            })
          })
        })
      });
      Generation.countDocuments.mockResolvedValue(1);

      await getAll(req, res, next);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ count: 1, total: 1 })
      );
    });

    test('Debe retornar array vacío si no hay generaciones', async () => {
      Generation.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnValue({
            skip: jest.fn().mockReturnValue({
              limit: jest.fn().mockResolvedValue([])
            })
          })
        })
      });
      Generation.countDocuments.mockResolvedValue(0);

      await getAll(req, res, next);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ count: 0 })
      );
    });

    test('Debe manejar errores con next', async () => {
      Generation.find.mockImplementation(() => { throw new Error('Error'); });
      await getAll(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('getById', () => {
    test('Debe retornar una generación por ID', async () => {
      req.params.id = '123';
      Generation.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue({ _id: '123', name: 'Test Gen' })
        })
      });

      await getById(req, res, next);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ _id: '123' }));
    });

    test('Debe retornar 404 si no existe', async () => {
      req.params.id = '999';
      Generation.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(null)
        })
      });

      await getById(req, res, next);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    test('Debe manejar errores con next', async () => {
      req.params.id = '123';
      Generation.findById.mockImplementation(() => { throw new Error('Error'); });
      await getById(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('generate', () => {
    const mockCourses = [{ _id: 'c1', name: 'Curso 1', code: 'C101', active: true, assignedTeachers: ['t1'] }];
    const mockTeachers = [{ _id: 't1', name: 'Dr. Pérez', active: true, specializations: [] }];
    const mockClassrooms = [{ _id: 'a1', name: 'Aula 101', available: true }];

    beforeEach(() => {
      req.body = { name: 'Horario 2025-2', semester: '2025-2' };
      Course.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(mockCourses)
        })
      });
      Teacher.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockTeachers)
      });
      Classroom.find.mockResolvedValue(mockClassrooms);
      Preference.find.mockResolvedValue([]);
      InstitutionalPolicy.findOne.mockReturnValue({
        sort: jest.fn().mockResolvedValue(null)
      });
    });

    test('Debe generar horario exitosamente', async () => {
      Generation.create.mockResolvedValue({ _id: 'gen1', name: 'Horario 2025-2', status: 'ejecutando', save: jest.fn().mockResolvedValue(true) });
      runCSPMultiple.mockReturnValue({
        success: true,
        assignments: [{ courseId: 'c1', teacherId: 't1', classroomId: 'a1', day: 'Lunes', startTime: '08:00', endTime: '10:00' }],
        qualityScore: 95,
        constraintsFulfilled: 98,
        preferencesScore: 92,
        resourceUsage: 88,
        loadDistribution: 94,
        conflicts: [],
        alternatives: [],
        unsatisfiedConditions: [],
        scoringBreakdown: {}
      });
      Schedule.create.mockResolvedValue({ _id: 's1', generationId: 'gen1', assignments: [] });
      Generation.findById.mockResolvedValue({ _id: 'gen1', name: 'Horario 2025-2' });
      Schedule.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            populate: jest.fn().mockResolvedValue({ _id: 's1' })
          })
        })
      });

      await generate(req, res, next);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Horario generado exitosamente.' })
      );
    });

    test('Debe fallar si no hay cursos activos', async () => {
      Course.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue([])
        })
      });
      Generation.create.mockResolvedValue({ _id: 'gen1', status: 'ejecutando', save: jest.fn().mockResolvedValue(true) });

      await generate(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    test('Debe fallar si no hay docentes disponibles', async () => {
      Teacher.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue([])
      });
      Generation.create.mockResolvedValue({ _id: 'gen1', status: 'ejecutando', save: jest.fn().mockResolvedValue(true) });

      await generate(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    test('Debe fallar si no hay aulas disponibles', async () => {
      Classroom.find.mockResolvedValue([]);
      Generation.create.mockResolvedValue({ _id: 'gen1', status: 'ejecutando', save: jest.fn().mockResolvedValue(true) });

      await generate(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    test('Debe manejar fallo del motor CSP', async () => {
      Generation.create.mockResolvedValue({ _id: 'gen1', status: 'ejecutando', save: jest.fn().mockResolvedValue(true) });
      runCSPMultiple.mockReturnValue({
        success: false,
        conflicts: [{ type: 'docente', description: 'No se encontró solución factible.', severity: 'alta' }]
      });

      await generate(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'No se encontró solución factible.' })
      );
    });

    test('Debe manejar errores con next', async () => {
      Course.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockRejectedValue(new Error('DB Error'))
        })
      });
      await generate(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('restore', () => {
    test('Debe restaurar una generación completada', async () => {
      req.params.id = '123';
      Generation.findById.mockResolvedValue({
        _id: '123',
        status: 'completada',
        scheduleId: 's1',
        name: 'Gen Original',
        semester: '2025-2',
        qualityScore: 95,
        constraintsFulfilled: 98,
        preferencesScore: 92,
        resourceUsage: 88,
        loadDistribution: 94,
        conflicts: [],
        unsatisfiedConditions: [],
        scoringBreakdown: {}
      });
      Schedule.findById.mockResolvedValue({
        _id: 's1',
        semester: '2025-2',
        assignments: [{ courseId: 'c1' }],
        totalAssignments: 1
      });
      Generation.create.mockResolvedValue({ _id: 'restored1', name: 'Gen Original (restaurado)', save: jest.fn().mockResolvedValue(true) });
      Schedule.create.mockResolvedValue({ _id: 's2' });

      await restore(req, res, next);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Generación restaurada exitosamente.' })
      );
    });

    test('Debe retornar 404 si generación no existe', async () => {
      req.params.id = '999';
      Generation.findById.mockResolvedValue(null);
      await restore(req, res, next);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    test('Debe rechazar restauración si no está completada', async () => {
      req.params.id = '123';
      Generation.findById.mockResolvedValue({ _id: '123', status: 'fallida' });
      await restore(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('remove', () => {
    test('Debe eliminar generación y schedules asociados', async () => {
      req.params.id = '123';
      Generation.findById.mockResolvedValue({
        _id: '123',
        scheduleId: 's1',
        alternatives: [{ scheduleId: 's2' }, { scheduleId: 's3' }]
      });
      Schedule.deleteOne.mockResolvedValue({ deletedCount: 1 });
      Generation.deleteOne.mockResolvedValue({ deletedCount: 1 });

      await remove(req, res, next);
      expect(res.json).toHaveBeenCalledWith({ message: 'Generación eliminada.' });
      expect(Schedule.deleteOne).toHaveBeenCalledTimes(3);
    });

    test('Debe retornar 404 si no existe', async () => {
      req.params.id = '999';
      Generation.findById.mockResolvedValue(null);
      await remove(req, res, next);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
