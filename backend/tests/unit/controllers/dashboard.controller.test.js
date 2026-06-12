const Course = require('../../../models/Course');
const Teacher = require('../../../models/Teacher');
const Classroom = require('../../../models/Classroom');
const Student = require('../../../models/Student');
const Generation = require('../../../models/Generation');
const { getStats } = require('../../../controllers/dashboard.controller');

jest.mock('../../../models/Course');
jest.mock('../../../models/Teacher');
jest.mock('../../../models/Classroom');
jest.mock('../../../models/Student');
jest.mock('../../../models/Generation');

describe('Dashboard Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
    jest.clearAllMocks();
  });

  test('Debe retornar estadísticas del dashboard', async () => {
    Course.countDocuments.mockResolvedValue(10);
    Teacher.countDocuments.mockResolvedValue(5);
    Classroom.countDocuments.mockResolvedValue(8);
    Student.countDocuments.mockResolvedValue(50);
    Generation.countDocuments.mockResolvedValue(3);
    Generation.find.mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      populate: jest.fn().mockResolvedValue([]),
    });

    await getStats(req, res, next);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        stats: expect.objectContaining({
          courses: expect.objectContaining({ total: 10 }),
          teachers: expect.objectContaining({ total: 5 }),
          classrooms: expect.objectContaining({ total: 8 }),
          students: expect.objectContaining({ total: 50 }),
          generations: expect.objectContaining({ total: 3 }),
        }),
      })
    );
  });

  test('Debe incluir alertas cuando hay problemas', async () => {
    Course.countDocuments.mockResolvedValue(10);
    Teacher.countDocuments
      .mockResolvedValueOnce(5)
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(3)
      .mockResolvedValueOnce(2);
    Classroom.countDocuments.mockResolvedValue(8);
    Classroom.countDocuments
      .mockResolvedValueOnce(5)
      .mockResolvedValueOnce(3);
    Student.countDocuments.mockResolvedValue(50);
    Generation.countDocuments.mockResolvedValue(3);
    Generation.countDocuments
      .mockResolvedValueOnce(3)
      .mockResolvedValueOnce(1);
    Generation.find.mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      populate: jest.fn().mockResolvedValue([]),
    });

    await getStats(req, res, next);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        alerts: expect.arrayContaining([
          expect.objectContaining({ type: 'warning' }),
        ]),
      })
    );
  });

  test('Debe manejar errores llamando next()', async () => {
    Course.countDocuments.mockRejectedValue(new Error('DB Error'));

    await getStats(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
