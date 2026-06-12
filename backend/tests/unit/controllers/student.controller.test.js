const httpMocks = require('node-mocks-http');
const Student = require('../../../models/Student');

jest.mock('../../../models/Student');

const studentController = require('../../../controllers/student.controller');

describe('Student Controller', () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  describe('getAll', () => {
    it('Debe retornar lista paginada de estudiantes', async () => {
      const mockStudents = [
        { _id: 's1', name: 'Juan Pérez', studentCode: '2024001', currentSemester: 3 }
      ];
      Student.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnValue({
            skip: jest.fn().mockReturnValue({
              limit: jest.fn().mockResolvedValue(mockStudents)
            })
          })
        })
      });
      Student.countDocuments.mockResolvedValue(1);

      await studentController.getAll(req, res, next);

      expect(res.statusCode).toBe(200);
      const data = JSON.parse(res._getData());
      expect(data.count).toBe(1);
      expect(data.total).toBe(1);
    });

    it('Debe filtrar por semestre y carrera', async () => {
      req.query.semester = '3';
      req.query.career = 'c1';
      Student.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnValue({
            skip: jest.fn().mockReturnValue({
              limit: jest.fn().mockResolvedValue([])
            })
          })
        })
      });
      Student.countDocuments.mockResolvedValue(0);

      await studentController.getAll(req, res, next);

      expect(Student.find).toHaveBeenCalledWith({ active: true, currentSemester: '3', career: 'c1' });
    });

    it('Debe retornar lista vacía cuando no hay estudiantes', async () => {
      Student.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnValue({
            skip: jest.fn().mockReturnValue({
              limit: jest.fn().mockResolvedValue([])
            })
          })
        })
      });
      Student.countDocuments.mockResolvedValue(0);

      await studentController.getAll(req, res, next);

      expect(JSON.parse(res._getData()).count).toBe(0);
    });

    it('Debe manejar errores llamando next()', async () => {
      Student.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnValue({
            skip: jest.fn().mockReturnValue({
              limit: jest.fn().mockRejectedValue(new Error('DB error'))
            })
          })
        })
      });

      await studentController.getAll(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('getById', () => {
    it('Debe retornar un estudiante por ID', async () => {
      Student.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue({ _id: 's1', name: 'Juan' })
      });
      req.params.id = 's1';

      await studentController.getById(req, res, next);

      expect(res.statusCode).toBe(200);
    });

    it('Debe retornar 404 si no existe', async () => {
      Student.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null)
      });
      req.params.id = 'nonexistent';

      await studentController.getById(req, res, next);

      expect(res.statusCode).toBe(404);
    });
  });

  describe('create', () => {
    it('Debe crear un estudiante exitosamente', async () => {
      const body = { name: 'Nuevo', studentCode: '2024002', email: 'test@test.com' };
      req.body = body;
      Student.create.mockResolvedValue({ _id: 'new', ...body });

      await studentController.create(req, res, next);

      expect(res.statusCode).toBe(201);
    });

    it('Debe manejar error de email duplicado', async () => {
      const error = new Error('Duplicate email');
      error.code = 11000;
      Student.create.mockRejectedValue(error);
      req.body = { name: 'Test', studentCode: '2024003' };

      await studentController.create(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('update', () => {
    it('Debe actualizar un estudiante exitosamente', async () => {
      Student.findByIdAndUpdate.mockResolvedValue({ _id: 's1', name: 'Updated' });
      req.params.id = 's1';
      req.body = { name: 'Updated' };

      await studentController.update(req, res, next);

      expect(res.statusCode).toBe(200);
    });

    it('Debe retornar 404 si no existe', async () => {
      Student.findByIdAndUpdate.mockResolvedValue(null);
      req.params.id = 'nonexistent';
      req.body = { name: 'Test' };

      await studentController.update(req, res, next);
      expect(res.statusCode).toBe(404);
    });
  });

  describe('delete', () => {
    it('Debe eliminar un estudiante exitosamente', async () => {
      Student.findByIdAndDelete.mockResolvedValue({ _id: 's1' });
      req.params.id = 's1';

      await studentController.delete(req, res, next);

      expect(res.statusCode).toBe(200);
    });

    it('Debe retornar 404 si no existe', async () => {
      Student.findByIdAndDelete.mockResolvedValue(null);
      req.params.id = 'nonexistent';

      await studentController.delete(req, res, next);
      expect(res.statusCode).toBe(404);
    });
  });
});
