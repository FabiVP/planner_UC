const roleGuard = require('../../../middleware/roleGuard');

describe('RoleGuard Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { user: null };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
  });

  test('Debe retornar 401 si no hay usuario autenticado', () => {
    roleGuard('coordinador')(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'No autenticado.' });
    expect(next).not.toHaveBeenCalled();
  });

  test('Debe retornar 403 si el rol no está permitido', () => {
    req.user = { role: 'estudiante' };
    roleGuard('coordinador')(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'No tiene permisos para realizar esta acción.' })
    );
    expect(next).not.toHaveBeenCalled();
  });

  test('Debe permitir acceso si el rol está en la lista permitida', () => {
    req.user = { role: 'coordinador' };
    roleGuard('coordinador', 'docente')(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('Debe permitir acceso con múltiples roles permitidos', () => {
    req.user = { role: 'docente' };
    roleGuard('coordinador', 'docente', 'estudiante')(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
