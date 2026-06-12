const Enrollment = require('../../../models/Enrollment');
const Student = require('../../../models/Student');
const Course = require('../../../models/Course');
const InstitutionalPolicy = require('../../../models/InstitutionalPolicy');
const {
  getAll,
  create,
  validate,
  delete: removeEnrollment
} = require('../../../controllers/enrollment.controller');

jest.mock('../../../models/Enrollment');
jest.mock('../../../models/Student');
jest.mock('../../../models/Course');
jest.mock('../../../models/InstitutionalPolicy');

describe('Enrollment Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {}, params: {}, query: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    const mockEnrollments = [
      { _id: '1', studentId: { name: 'Juan' }, selectedCourses: [], totalCredits: 20, status: 'validada' }
    ];

    test('Debe retornar lista paginada de matrículas', async () => {
      req.query = { page: '1', limit: '10' };
      Enrollment.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            sort: jest.fn().mockReturnValue({
              skip: jest.fn().mockReturnValue({
                limit: jest.fn().mockResolvedValue(mockEnrollments)
              })
            })
          })
        })
      });
      Enrollment.countDocuments.mockResolvedValue(1);

      await getAll(req, res, next);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ count: 1, total: 1, page: 1, pages: 1 })
      );
    });

    test('Debe retornar lista vacía cuando no hay matrículas', async () => {
      Enrollment.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            sort: jest.fn().mockReturnValue({
              skip: jest.fn().mockReturnValue({
                limit: jest.fn().mockResolvedValue([])
              })
            })
          })
        })
      });
      Enrollment.countDocuments.mockResolvedValue(0);

      await getAll(req, res, next);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ count: 0, total: 0 })
      );
    });

    test('Debe manejar errores con next', async () => {
      const error = new Error('DB Error');
      Enrollment.find.mockImplementation(() => { throw error; });
      await getAll(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('create', () => {
    const validBody = {
      studentId: 'student1',
      semester: '2025-2',
      selectedCourses: ['course1', 'course2']
    };

    beforeEach(() => {
      req.body = { ...validBody };
      Student.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue({
          _id: 'student1',
          approvedCourses: [{ courseId: { _id: 'course1', name: 'PreReq' } }]
        })
      });
      Course.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue([
          { _id: 'course1', name: 'Intro', credits: 7, prerequisites: [] },
          { _id: 'course2', name: 'Avanzado', credits: 6, prerequisites: [] }
        ])
      });
      InstitutionalPolicy.findOne.mockReturnValue({
        sort: jest.fn().mockResolvedValue({
          enrollmentRules: { minCreditsPerSemester: 12, maxCreditsPerSemester: 25 }
        })
      });
      Enrollment.create.mockResolvedValue({ _id: 'new', ...validBody, totalCredits: 13 });
      Enrollment.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue({ _id: 'new', studentId: { name: 'Juan' } })
        })
      });
    });

    test('Debe crear matrícula exitosamente cuando todo es válido', async () => {

      await create(req, res, next);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ valid: true })
      );
    });

    test('Debe rechazar matrícula sin cursos', async () => {
      req.body.selectedCourses = [];
      await create(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    test('Debe rechazar matrícula sin studentId', async () => {
      req.body.studentId = null;
      await create(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    test('Debe rechazar matrícula por créditos insuficientes', async () => {
      Course.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue([
          { _id: 'course1', name: 'Intro', credits: 2, prerequisites: [] },
          { _id: 'course2', name: 'Avanzado', credits: 2, prerequisites: [] }
        ])
      });
      Enrollment.create.mockResolvedValue({ _id: 'new', totalCredits: 4 });
      Enrollment.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue({ _id: 'new' })
        })
      });

      await create(req, res, next);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ valid: false })
      );
    });

    test('Debe rechazar matrícula cuando estudiante no existe', async () => {
      Student.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null)
      });
      await create(req, res, next);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ valid: false, errors: expect.arrayContaining([expect.stringContaining('no encontrado')]) })
      );
    });

    test('Debe manejar errores con next', async () => {
      const error = new Error('DB Error');
      Enrollment.create.mockRejectedValue(error);
      await create(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('validate', () => {
    test('Debe validar una matrícula correctamente', async () => {
      req.body = { studentId: 'student1', courseIds: ['course1'] };
      Student.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue({
          _id: 'student1',
          approvedCourses: []
        })
      });
      Course.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue([
          { _id: 'course1', name: 'Intro', credits: 4, prerequisites: [] }
        ])
      });
      InstitutionalPolicy.findOne.mockReturnValue({
        sort: jest.fn().mockResolvedValue({
          enrollmentRules: { minCreditsPerSemester: 12, maxCreditsPerSemester: 25 }
        })
      });

      await validate(req, res, next);
      expect(res.json).toHaveBeenCalled();
    });

    test('Debe manejar errores', async () => {
      Student.findById.mockReturnValue({
        populate: jest.fn().mockRejectedValue(new Error('Error'))
      });
      await validate(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    test('Debe eliminar una matrícula existente', async () => {
      req.params.id = '123';
      Enrollment.findByIdAndDelete.mockResolvedValue({ _id: '123' });
      await removeEnrollment(req, res, next);
      expect(res.json).toHaveBeenCalledWith({ message: 'Matrícula eliminada.' });
    });

    test('Debe retornar 404 si la matrícula no existe', async () => {
      req.params.id = '999';
      Enrollment.findByIdAndDelete.mockResolvedValue(null);
      await removeEnrollment(req, res, next);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    test('Debe manejar errores con next', async () => {
      req.params.id = '123';
      Enrollment.findByIdAndDelete.mockRejectedValue(new Error('Error'));
      await removeEnrollment(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });
});
