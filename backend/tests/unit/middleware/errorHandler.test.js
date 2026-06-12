const errorHandler = require('../../../middleware/errorHandler');

describe('ErrorHandler Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
    process.env.NODE_ENV = 'test';
  });

  test('Debe manejar ValidationError de Mongoose', () => {
    const err = {
      name: 'ValidationError',
      errors: {
        field1: { message: 'El campo es obligatorio' },
        field2: { message: 'Valor inválido' },
      },
    };
    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Error de validación',
      errors: ['El campo es obligatorio', 'Valor inválido'],
    });
  });

  test('Debe manejar error de llave duplicada (código 11000)', () => {
    const err = {
      code: 11000,
      keyValue: { email: 'test@test.com' },
    };
    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "El campo 'email' ya existe con ese valor.",
    });
  });

  test('Debe manejar CastError de Mongoose', () => {
    const err = { name: 'CastError' };
    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'ID inválido proporcionado.' });
  });

  test('Debe manejar errores genéricos con status 500', () => {
    const err = { message: 'Algo salió mal' };
    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Algo salió mal',
    });
  });

  test('Debe incluir stack trace en desarrollo', () => {
    process.env.NODE_ENV = 'development';
    const err = { message: 'Error', stack: 'line1\nline2' };
    errorHandler(err, req, res, next);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ stack: 'line1\nline2' })
    );
  });

  test('Debe usar el status del error si está definido', () => {
    const err = { status: 422, message: 'Entidad no procesable' };
    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(422);
  });
});
