const Course = require('../../../models/Course');
const { getAll, getById, create, update, delete: deleteCourse } = require('../../../controllers/course.controller');

jest.mock('../../../models/Course');

describe('Course Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = { query: {}, params: {}, body: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    test('Debe retornar lista paginada de cursos', async () => {
      req.query = { page: '1', limit: '10' };
      const mockCourses = [{ _id: '1', code: 'CS101', name: 'Intro' }];
      Course.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockCourses),
      });
      Course.countDocuments.mockResolvedValue(1);

      await getAll(req, res, next);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ count: 1, total: 1, page: 1, courses: mockCourses })
      );
    });

    test('Debe filtrar por semestre y tipo', async () => {
      req.query = { semester: '1', type: 'teorico' };
      Course.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([]),
      });
      Course.countDocuments.mockResolvedValue(0);

      await getAll(req, res, next);
      expect(Course.find).toHaveBeenCalledWith(
        expect.objectContaining({ semester: '1', type: 'teorico' })
      );
    });

    test('Debe retornar lista vacía cuando no hay cursos', async () => {
      Course.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([]),
      });
      Course.countDocuments.mockResolvedValue(0);

      await getAll(req, res, next);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ count: 0, total: 0, courses: [] })
      );
    });

    test('Debe manejar errores llamando next()', async () => {
      const error = new Error('DB Error');
      Course.find.mockImplementation(() => { throw error; });

      await getAll(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getById', () => {
    test('Debe retornar un curso por ID', async () => {
      req.params.id = '507f191e810c19729de860eb';
      const mockCourse = { _id: req.params.id, code: 'CS101' };
      Course.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockCourse),
      });

      await getById(req, res, next);
      expect(res.json).toHaveBeenCalledWith(mockCourse);
    });

    test('Debe retornar 404 si el curso no existe', async () => {
      req.params.id = 'nonexistent';
      Course.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      });

      await getById(req, res, next);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Curso no encontrado.' });
    });
  });

  describe('create', () => {
    test('Debe crear un curso exitosamente', async () => {
      req.body = { code: 'CS101', name: 'Intro', credits: 4, type: 'teorico', semester: 1 };
      Course.create.mockResolvedValue(req.body);

      await create(req, res, next);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Curso creado exitosamente.' })
      );
    });
  });

  describe('update', () => {
    test('Debe actualizar un curso exitosamente', async () => {
      req.params.id = '507f191e810c19729de860eb';
      req.body = { name: 'Updated' };
      Course.findByIdAndUpdate.mockResolvedValue({ _id: req.params.id, ...req.body });

      await update(req, res, next);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Curso actualizado.' })
      );
    });

    test('Debe retornar 404 si el curso no existe', async () => {
      req.params.id = 'nonexistent';
      Course.findByIdAndUpdate.mockResolvedValue(null);

      await update(req, res, next);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('delete', () => {
    test('Debe eliminar un curso exitosamente', async () => {
      req.params.id = '507f191e810c19729de860eb';
      Course.findByIdAndDelete.mockResolvedValue({ _id: req.params.id });

      await deleteCourse(req, res, next);
      expect(res.json).toHaveBeenCalledWith({ message: 'Curso eliminado.' });
    });

    test('Debe retornar 404 si el curso no existe', async () => {
      req.params.id = 'nonexistent';
      Course.findByIdAndDelete.mockResolvedValue(null);

      await deleteCourse(req, res, next);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
