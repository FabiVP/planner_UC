const jwt = require('jsonwebtoken');
const User = require('../../../models/User');
const Teacher = require('../../../models/Teacher');
const Student = require('../../../models/Student');
const jwtConfig = require('../../../config/jwt');
const { register, login, getProfile } = require('../../../controllers/auth.controller');

jest.mock('../../../models/User');
jest.mock('../../../models/Teacher');
jest.mock('../../../models/Student');

describe('Auth Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {}, user: null };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('register', () => {
    const validBody = { name: 'Test', email: 'test@test.com', password: 'password123', role: 'estudiante' };

    test('Debe registrar un usuario exitosamente', async () => {
      req.body = validBody;
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({ _id: '123', name: 'Test', email: 'test@test.com', role: 'estudiante' });
      Student.findOne.mockResolvedValue(null);
      Student.countDocuments.mockResolvedValue(0);
      Student.create.mockResolvedValue({});

      await register(req, res, next);

      expect(User.create).toHaveBeenCalledWith(expect.objectContaining({ email: 'test@test.com' }));
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Usuario registrado exitosamente.' })
      );
    });

    test('Debe retornar 400 si el email ya está registrado', async () => {
      req.body = validBody;
      User.findOne.mockResolvedValue({ email: 'test@test.com' });

      await register(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'El email ya está registrado.' });
    });

    test('Debe crear perfil de docente si el rol es docente', async () => {
      req.body = { ...validBody, role: 'docente' };
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({ _id: '123', name: 'Test', email: 'test@test.com', role: 'docente' });
      Teacher.findOne.mockResolvedValue(null);
      Teacher.create.mockResolvedValue({});

      await register(req, res, next);
      expect(Teacher.create).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'test@test.com' })
      );
    });

    test('Debe crear perfil de estudiante si el rol es estudiante', async () => {
      req.body = validBody;
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({ _id: '123', name: 'Test', email: 'test@test.com', role: 'estudiante' });
      Student.findOne.mockResolvedValue(null);
      Student.countDocuments.mockResolvedValue(5);
      Student.create.mockResolvedValue({});

      await register(req, res, next);
      expect(Student.create).toHaveBeenCalledWith(
        expect.objectContaining({ studentCode: 'AUTO-00006' })
      );
    });

    test('Debe manejar errores llamando next()', async () => {
      req.body = validBody;
      const error = new Error('DB Error');
      User.findOne.mockRejectedValue(error);

      await register(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('login', () => {
    const validCredentials = { email: 'test@test.com', password: 'password123' };

    test('Debe iniciar sesión con credenciales válidas', async () => {
      req.body = validCredentials;
      const mockUser = {
        _id: '123',
        name: 'Test',
        email: 'test@test.com',
        role: 'coordinador',
        comparePassword: jest.fn().mockResolvedValue(true),
      };
      User.findOne.mockResolvedValue(mockUser);

      await login(req, res, next);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Inicio de sesión exitoso.' })
      );
    });

    test('Debe retornar 401 si el usuario no existe', async () => {
      req.body = validCredentials;
      User.findOne.mockResolvedValue(null);

      await login(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Credenciales inválidas.' });
    });

    test('Debe retornar 401 si la contraseña es incorrecta', async () => {
      req.body = validCredentials;
      User.findOne.mockResolvedValue({
        comparePassword: jest.fn().mockResolvedValue(false),
      });

      await login(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
    });
  });

  describe('getProfile', () => {
    test('Debe retornar el perfil del usuario autenticado', async () => {
      req.user = { _id: '123', name: 'Test', email: 'test@test.com' };
      await getProfile(req, res, next);
      expect(res.json).toHaveBeenCalledWith({ user: req.user });
    });

    test('Debe manejar errores', async () => {
      const error = new Error('Error');
      req.user = null;
      const mockJson = jest.fn();
      res.json = mockJson;
      mockJson.mockImplementation(() => { throw error; });

      req.user = { _id: '123' };
      await getProfile(req, res, next);
    });
  });
});
