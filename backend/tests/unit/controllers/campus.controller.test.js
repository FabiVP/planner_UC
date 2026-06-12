const httpMocks = require('node-mocks-http');
const Campus = require('../../../models/Campus');
const Classroom = require('../../../models/Classroom');

jest.mock('../../../models/Campus');
jest.mock('../../../models/Classroom');

const campusController = require('../../../controllers/campus.controller');

describe('Campus Controller', () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  describe('getAll', () => {
    it('Debe retornar lista de campuses activos', async () => {
      const mockCampuses = [
        { _id: 'c1', code: 'HQ', name: 'Huancayo', active: true },
        { _id: 'c2', code: 'LP', name: 'Lima', active: true }
      ];
      Campus.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({ sort: jest.fn().mockResolvedValue(mockCampuses) })
      });

      await campusController.getAll(req, res, next);

      expect(res.statusCode).toBe(200);
      const data = JSON.parse(res._getData());
      expect(data.count).toBe(2);
      expect(data.campuses).toEqual(mockCampuses);
    });

    it('Debe retornar lista vacía si no hay campuses', async () => {
      Campus.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({ sort: jest.fn().mockResolvedValue([]) })
      });

      await campusController.getAll(req, res, next);

      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res._getData()).count).toBe(0);
    });

    it('Debe manejar errores llamando next()', async () => {
      const error = new Error('DB error');
      Campus.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({ sort: jest.fn().mockRejectedValue(error) })
      });

      await campusController.getAll(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getById', () => {
    it('Debe retornar un campus por ID', async () => {
      const mockCampus = { _id: 'c1', code: 'HQ', name: 'Huancayo' };
      Campus.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockCampus)
      });
      req.params.id = 'c1';

      await campusController.getById(req, res, next);

      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res._getData())).toEqual(mockCampus);
    });

    it('Debe retornar 404 si el campus no existe', async () => {
      Campus.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null)
      });
      req.params.id = 'nonexistent';

      await campusController.getById(req, res, next);

      expect(res.statusCode).toBe(404);
      expect(JSON.parse(res._getData()).message).toBe('Campus no encontrado.');
    });

    it('Debe manejar errores llamando next()', async () => {
      const error = new Error('DB error');
      Campus.findById.mockReturnValue({
        populate: jest.fn().mockRejectedValue(error)
      });
      req.params.id = 'c1';

      await campusController.getById(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('create', () => {
    it('Debe crear un campus exitosamente', async () => {
      const body = { code: 'NEW', name: 'Nuevo Campus' };
      req.body = body;
      const created = { _id: 'new', ...body };
      Campus.create.mockResolvedValue(created);
      Classroom.findOne.mockResolvedValue(null);

      await campusController.create(req, res, next);

      expect(res.statusCode).toBe(201);
      expect(JSON.parse(res._getData()).message).toContain('creado');
    });

    it('Debe manejar errores llamando next()', async () => {
      const error = new Error('Validation error');
      Campus.create.mockRejectedValue(error);
      req.body = {};

      await campusController.create(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('update', () => {
    it('Debe actualizar un campus exitosamente', async () => {
      const body = { name: 'Actualizado' };
      req.params.id = 'c1';
      req.body = body;
      const updated = { _id: 'c1', code: 'HQ', ...body };
      Campus.findByIdAndUpdate.mockResolvedValue(updated);

      await campusController.update(req, res, next);

      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res._getData()).message).toContain('actualizado');
    });

    it('Debe retornar 404 si el campus no existe', async () => {
      Campus.findByIdAndUpdate.mockResolvedValue(null);
      req.params.id = 'nonexistent';
      req.body = { name: 'Test' };

      await campusController.update(req, res, next);

      expect(res.statusCode).toBe(404);
    });
  });

  describe('remove', () => {
    it('Debe desactivar un campus exitosamente', async () => {
      const mockCampus = { _id: 'c1', code: 'HQ', name: 'Huancayo', active: true };
      Campus.findByIdAndUpdate.mockResolvedValue(mockCampus);
      Classroom.updateMany.mockResolvedValue({ modifiedCount: 1 });
      req.params.id = 'c1';

      await campusController.remove(req, res, next);

      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res._getData()).message).toContain('desactivado');
    });

    it('Debe retornar 404 si el campus no existe', async () => {
      Campus.findByIdAndUpdate.mockResolvedValue(null);
      req.params.id = 'nonexistent';

      await campusController.remove(req, res, next);

      expect(res.statusCode).toBe(404);
    });
  });
});
