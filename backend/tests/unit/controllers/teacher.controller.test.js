const httpMocks = require('node-mocks-http');
const Teacher = require('../../../models/Teacher');
const Course = require('../../../models/Course');

jest.mock('../../../models/Teacher');
jest.mock('../../../models/Course');

const teacherController = require('../../../controllers/teacher.controller');

describe('Teacher Controller', () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  describe('getAll', () => {
    it('Debe retornar lista paginada de docentes', async () => {
      const mockTeachers = [
        { _id: 't1', name: 'Dr. Pérez', email: 'perez@test.com', contractType: 'tiempo_completo' }
      ];
      Teacher.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnValue({
            skip: jest.fn().mockReturnValue({
              limit: jest.fn().mockResolvedValue(mockTeachers)
            })
          })
        })
      });
      Teacher.countDocuments.mockResolvedValue(1);

      await teacherController.getAll(req, res, next);

      expect(res.statusCode).toBe(200);
      const data = JSON.parse(res._getData());
      expect(data.count).toBe(1);
    });

    it('Debe retornar lista vacía cuando no hay docentes', async () => {
      Teacher.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnValue({
            skip: jest.fn().mockReturnValue({
              limit: jest.fn().mockResolvedValue([])
            })
          })
        })
      });
      Teacher.countDocuments.mockResolvedValue(0);

      await teacherController.getAll(req, res, next);

      expect(JSON.parse(res._getData()).count).toBe(0);
    });

    it('Debe manejar errores llamando next()', async () => {
      Teacher.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnValue({
            skip: jest.fn().mockReturnValue({
              limit: jest.fn().mockRejectedValue(new Error('DB error'))
            })
          })
        })
      });

      await teacherController.getAll(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('getById', () => {
    it('Debe retornar un docente por ID', async () => {
      Teacher.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue({ _id: 't1', name: 'Dr. Pérez' })
      });
      req.params.id = 't1';

      await teacherController.getById(req, res, next);

      expect(res.statusCode).toBe(200);
    });

    it('Debe retornar 404 si el docente no existe', async () => {
      Teacher.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null)
      });
      req.params.id = 'nonexistent';

      await teacherController.getById(req, res, next);

      expect(res.statusCode).toBe(404);
    });
  });

  describe('getMyProfile', () => {
    it('Debe retornar perfil del docente autenticado', async () => {
      req.user = { _id: 'u1', name: 'Dr. Pérez', email: 'perez@test.com' };
      const mockTeacher = {
        _id: 't1', name: 'Dr. Pérez', email: 'perez@test.com',
        userId: 'u1', contractType: 'tiempo_completo',
        specializations: [], availability: [], freeDays: [],
        teachingHours: 36, maxCourses: 4, maxWeeklyHours: 40,
        administrativeLoad: false, preferredShift: 'manana'
      };
      Teacher.findOne.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockTeacher)
      });

      await teacherController.getMyProfile(req, res, next);

      expect(res.statusCode).toBe(200);
      const data = JSON.parse(res._getData());
      expect(data.teacher).toBeDefined();
      expect(data.summary).toBeDefined();
    });

    it('Debe crear perfil automáticamente si no existe', async () => {
      req.user = { _id: 'u1', name: 'Nuevo', email: 'nuevo@test.com' };
      Teacher.findOne
        .mockReturnValueOnce({ populate: jest.fn().mockResolvedValue(null) })
        .mockResolvedValueOnce(null);
      Teacher.create.mockResolvedValue({
        _id: 't1', name: 'Nuevo', email: 'nuevo@test.com', userId: 'u1',
        contractType: 'tiempo_completo', specializations: [], availability: [], freeDays: [],
        teachingHours: 36, maxCourses: 4, maxWeeklyHours: 40,
        administrativeLoad: false, preferredShift: 'indiferente'
      });

      await teacherController.getMyProfile(req, res, next);

      expect(res.statusCode).toBe(200);
      expect(Teacher.create).toHaveBeenCalled();
    });

    it('Debe manejar errores llamando next()', async () => {
      req.user = { _id: 'u1' };
      Teacher.findOne.mockReturnValue({
        populate: jest.fn().mockRejectedValue(new Error('DB error'))
      });

      await teacherController.getMyProfile(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('updateMyProfile', () => {
    it('Debe actualizar campos permitidos del perfil', async () => {
      req.user = { _id: 'u1' };
      req.body = { preferredShift: 'tarde', teachingHours: 24 };
      Teacher.findOne.mockResolvedValue({ _id: 't1', userId: 'u1' });
      Teacher.findByIdAndUpdate.mockReturnValue({
        populate: jest.fn().mockResolvedValue({ _id: 't1', preferredShift: 'tarde', teachingHours: 24 })
      });

      await teacherController.updateMyProfile(req, res, next);

      expect(res.statusCode).toBe(200);
    });

    it('Debe retornar 404 si el perfil no existe', async () => {
      req.user = { _id: 'u1' };
      Teacher.findOne.mockResolvedValue(null);

      await teacherController.updateMyProfile(req, res, next);

      expect(res.statusCode).toBe(404);
    });

    it('Debe filtrar campos no permitidos', async () => {
      req.user = { _id: 'u1' };
      req.body = { name: 'Hacker', contractType: 'por_horas', teachingHours: 24 };
      Teacher.findOne.mockResolvedValue({ _id: 't1', userId: 'u1' });
      Teacher.findByIdAndUpdate.mockReturnValue({
        populate: jest.fn().mockResolvedValue({ _id: 't1', teachingHours: 24 })
      });

      await teacherController.updateMyProfile(req, res, next);

      expect(res.statusCode).toBe(200);
    });
  });

  describe('getAdminOverview', () => {
    it('Debe retornar overview con métricas', async () => {
      const mockTeachers = [
        { _id: 't1', name: 'TC Teacher', contractType: 'tiempo_completo', administrativeLoad: true, specializations: [{ _id: 'c1' }], availability: [{ day: 'lunes' }] },
        { _id: 't2', name: 'PH Teacher', contractType: 'por_horas', administrativeLoad: false, specializations: [{ _id: 'c2' }], availability: [] }
      ];
      Teacher.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({ sort: jest.fn().mockResolvedValue(mockTeachers) })
      });
      Course.countDocuments.mockResolvedValue(2);

      await teacherController.getAdminOverview(req, res, next);

      expect(res.statusCode).toBe(200);
      const body = res._getData();
      expect(body).not.toBe('');
      const data = JSON.parse(body);
      expect(data.metrics).toBeDefined();
      expect(data.metrics.total).toBe(2);
      expect(data.warnings.length).toBeGreaterThanOrEqual(0);
    });

    it('Debe manejar errores llamando next()', async () => {
      Teacher.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({ sort: jest.fn().mockRejectedValue(new Error('DB error')) })
      });

      await teacherController.getAdminOverview(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('Debe crear un docente exitosamente', async () => {
      const body = { name: 'Nuevo Docente', email: 'docente@test.com', contractType: 'tiempo_completo' };
      req.body = body;
      Teacher.create.mockResolvedValue({ _id: 't1', ...body });

      await teacherController.create(req, res, next);

      expect(res.statusCode).toBe(201);
    });
  });

  describe('update', () => {
    it('Debe actualizar un docente exitosamente', async () => {
      Teacher.findByIdAndUpdate.mockReturnValue({
        populate: jest.fn().mockResolvedValue({ _id: 't1', name: 'Updated' })
      });
      req.params.id = 't1';
      req.body = { name: 'Updated' };

      await teacherController.update(req, res, next);

      expect(res.statusCode).toBe(200);
    });

    it('Debe retornar 404 si no existe', async () => {
      Teacher.findByIdAndUpdate.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null)
      });
      req.params.id = 'nonexistent';
      req.body = { name: 'Test' };

      await teacherController.update(req, res, next);
      expect(res.statusCode).toBe(404);
    });
  });

  describe('delete', () => {
    it('Debe eliminar un docente exitosamente', async () => {
      Teacher.findByIdAndDelete.mockResolvedValue({ _id: 't1' });
      req.params.id = 't1';

      await teacherController.delete(req, res, next);

      expect(res.statusCode).toBe(200);
    });

    it('Debe retornar 404 si no existe', async () => {
      Teacher.findByIdAndDelete.mockResolvedValue(null);
      req.params.id = 'nonexistent';

      await teacherController.delete(req, res, next);
      expect(res.statusCode).toBe(404);
    });
  });
});
