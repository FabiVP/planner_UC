const httpMocks = require('node-mocks-http');
const Section = require('../../../models/Section');
const Student = require('../../../models/Student');

jest.mock('../../../models/Section');
jest.mock('../../../models/Student');

const {
  getSections,
  getStudentSections,
  getPendingReview,
  mergeSections,
} = require('../../../controllers/career-generation.controller');

function mockSectionFind4Populates(result) {
  Section.find.mockReturnValue({
    populate: jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            sort: jest.fn().mockResolvedValue(result),
          }),
        }),
      }),
    }),
  });
}

describe('CareerGeneration Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  describe('getSections', () => {
    it('Debe devolver todas las secciones sin filtros', async () => {
      mockSectionFind4Populates([{ _id: 'sec1', sectionCode: 'A' }, { _id: 'sec2', sectionCode: 'B' }]);
      await getSections(req, res, next);
      const data = JSON.parse(res._getData());
      expect(res.statusCode).toBe(200);
      expect(data.count).toBe(2);
    });

    it('Debe filtrar por career', async () => {
      mockSectionFind4Populates([]);
      req.query.career = 'c1';
      await getSections(req, res, next);
      expect(Section.find).toHaveBeenCalledWith(expect.objectContaining({ career: 'c1' }));
    });

    it('Debe manejar errores', async () => {
      Section.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            populate: jest.fn().mockReturnValue({
              populate: jest.fn().mockReturnValue({
                sort: jest.fn().mockRejectedValue(new Error('DB Error')),
              }),
            }),
          }),
        }),
      });
      await getSections(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('getStudentSections', () => {
    it('Debe devolver 404 si el estudiante no existe', async () => {
      Student.findOne.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      });
      req.user = { _id: 'userX' };
      await getStudentSections(req, res, next);
      const data = JSON.parse(res._getData());
      expect(res.statusCode).toBe(404);
      expect(data.message).toContain('no encontrado');
    });
  });

  describe('getPendingReview', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('Debe devolver lista de revisión', async () => {
      const mockSection = {
        _id: 'sec1',
        sectionCode: 'A',
        maxCapacity: 40,
        currentEnrolled: 5,
        minStudents: 15,
        status: 'activa',
        semester: '2026-1',
        courseId: { _id: 'c1', code: 'INF101', name: 'Intro', credits: 4, minStudentsPerSection: 15 },
        teacherId: { _id: 't1', name: 'Prof A' },
        classroomId: { _id: 'r1', code: 'A101' },
      };

      Section.find.mockReturnValueOnce({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            populate: jest.fn().mockReturnValue({
              sort: jest.fn().mockResolvedValue([mockSection]),
            }),
          }),
        }),
      });

      Section.find.mockReturnValueOnce({
        populate: jest.fn().mockResolvedValue([]),
      });

      await getPendingReview(req, res, next);
      const data = JSON.parse(res._getData());
      expect(res.statusCode).toBe(200);
      expect(typeof data.count).toBe('number');
    });

    it('Debe manejar errores', async () => {
      Section.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            populate: jest.fn().mockReturnValue({
              sort: jest.fn().mockRejectedValue(new Error('DB Error')),
            }),
          }),
        }),
      });
      await getPendingReview(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('mergeSections', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    const chainFindById = (value) => ({
      populate: jest.fn().mockResolvedValue(value),
    });

    it('Debe fusionar secciones exitosamente', async () => {
      Section.findById.mockReturnValue(chainFindById({
        _id: 'src1',
        sectionCode: 'A',
        courseId: { _id: 'c1', code: 'INF101', name: 'Intro' },
        currentEnrolled: 5,
        maxCapacity: 40,
        enrolledStudents: ['s1'],
      }));
      Section.findByIdAndUpdate.mockResolvedValue({});
      req.body = { sourceSectionId: 'src1', targetSectionId: 'tgt1' };
      await mergeSections(req, res, next);
      const data = JSON.parse(res._getData());
      expect(res.statusCode).toBe(200);
      expect(data.message).toContain('fusionada');
    });

    it('Debe devolver 400 si faltan parámetros', async () => {
      req.body = {};
      await mergeSections(req, res, next);
      const data = JSON.parse(res._getData());
      expect(res.statusCode).toBe(400);
    });
  });
});
