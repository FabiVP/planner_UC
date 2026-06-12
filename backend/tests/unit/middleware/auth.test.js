const jwt = require('jsonwebtoken');
const auth = require('../../../middleware/auth');
const User = require('../../../models/User');

jest.mock('../../../models/User');

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
  });

  test('Debe retornar 401 si no hay token', async () => {
    await auth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Acceso no autorizado. Token requerido.' });
    expect(next).not.toHaveBeenCalled();
  });

  test('Debe retornar 401 si el formato del token es inválido', async () => {
    req.headers.authorization = 'InvalidToken';
    await auth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  test('Debe retornar 401 si el token es inválido (firma incorrecta)', async () => {
    req.headers.authorization = 'Bearer invalid-token';
    await auth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  test('Debe retornar 401 si el usuario no existe', async () => {
    const token = jwt.sign({ id: 'nonexistent' }, 'test_jwt_secret_key_2026');
    req.headers.authorization = `Bearer ${token}`;
    User.findById.mockReturnValue({ select: jest.fn().mockResolvedValue(null) });

    await auth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token inválido. Usuario no encontrado.' });
  });

  test('Debe llamar next() si el token y usuario son válidos', async () => {
    const mockUser = { _id: '123', name: 'Test', email: 'test@test.com', role: 'coordinador' };
    const token = jwt.sign({ id: '123' }, 'test_jwt_secret_key_2026');
    req.headers.authorization = `Bearer ${token}`;
    User.findById.mockReturnValue({ select: jest.fn().mockResolvedValue(mockUser) });

    await auth(req, res, next);
    expect(req.user).toBeDefined();
    expect(next).toHaveBeenCalled();
  });
});
