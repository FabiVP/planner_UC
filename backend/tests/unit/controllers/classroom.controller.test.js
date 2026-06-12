const httpMocks = require('node-mocks-http');
const Classroom = require('../../../models/Classroom');

jest.mock('../../../models/Classroom');

const classroomController = require('../../../controllers/classroom.controller');

describe('Classroom Controller', () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  describe('getAll', () => {
    it('Debe retornar lista paginada de aulas', async () => {
      const mockClassrooms = [
        { _id: 'a1', code: 'A101', name: 'Aula 101', capacity: 30, type: 'teorico' },
        { _id: 'a2', code: 'L01', name: 'Lab 01', capacity: 20, type: 'laboratorio' }
      ];
      Classroom.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue(mockClassrooms)
          })
        })
      });
      Classroom.countDocuments.mockResolvedValue(2);

      await classroomController.getAll(req, res, next);

      expect(res.statusCode).toBe(200);
      const data = JSON.parse(res._getData());
      expect(data.count).toBe(2);
      expect(data.total).toBe(2);
    });

    it('Debe filtrar por tipo de aula', async () => {
      req.query.type = 'laboratorio';
      Classroom.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([])
          })
        })
      });
      Classroom.countDocuments.mockResolvedValue(0);

      await classroomController.getAll(req, res, next);

      expect(Classroom.find).toHaveBeenCalledWith({ type: 'laboratorio' });
    });

    it('Debe filtrar por disponibilidad', async () => {
      req.query.available = 'true';
      Classroom.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([])
          })
        })
      });
      Classroom.countDocuments.mockResolvedValue(0);

      await classroomController.getAll(req, res, next);

      expect(Classroom.find).toHaveBeenCalledWith({ available: true });
    });

    it('Debe manejar errores llamando next()', async () => {
      const error = new Error('DB error');
      Classroom.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockRejectedValue(error)
          })
        })
      });

      await classroomController.getAll(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getById', () => {
    it('Debe retornar un aula por ID', async () => {
      const mockClassroom = { _id: 'a1', code: 'A101' };
      Classroom.findById.mockResolvedValue(mockClassroom);
      req.params.id = 'a1';

      await classroomController.getById(req, res, next);

      expect(res.statusCode).toBe(200);
    });

    it('Debe retornar 404 si el aula no existe', async () => {
      Classroom.findById.mockResolvedValue(null);
      req.params.id = 'nonexistent';

      await classroomController.getById(req, res, next);

      expect(res.statusCode).toBe(404);
    });
  });

  describe('create', () => {
    it('Debe crear un aula exitosamente', async () => {
      const body = { code: 'NEW', name: 'Nueva Aula', capacity: 30, type: 'teorico' };
      req.body = body;
      Classroom.create.mockResolvedValue({ _id: 'new', ...body });

      await classroomController.create(req, res, next);

      expect(res.statusCode).toBe(201);
    });

    it('Debe manejar errores llamando next()', async () => {
      Classroom.create.mockRejectedValue(new Error('Validation error'));
      req.body = {};

      await classroomController.create(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('Debe actualizar un aula exitosamente', async () => {
      Classroom.findByIdAndUpdate.mockResolvedValue({ _id: 'a1', name: 'Updated' });
      req.params.id = 'a1';
      req.body = { name: 'Updated' };

      await classroomController.update(req, res, next);

      expect(res.statusCode).toBe(200);
    });

    it('Debe retornar 404 si el aula no existe', async () => {
      Classroom.findByIdAndUpdate.mockResolvedValue(null);
      req.params.id = 'nonexistent';
      req.body = { name: 'Test' };

      await classroomController.update(req, res, next);
      expect(res.statusCode).toBe(404);
    });
  });

  describe('delete', () => {
    it('Debe eliminar un aula exitosamente', async () => {
      Classroom.findByIdAndDelete.mockResolvedValue({ _id: 'a1' });
      req.params.id = 'a1';

      await classroomController.delete(req, res, next);

      expect(res.statusCode).toBe(200);
    });

    it('Debe retornar 404 si el aula no existe', async () => {
      Classroom.findByIdAndDelete.mockResolvedValue(null);
      req.params.id = 'nonexistent';

      await classroomController.delete(req, res, next);
      expect(res.statusCode).toBe(404);
    });
  });
});
