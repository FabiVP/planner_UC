describe('JWT Config', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  test('Debe exportar secret y expiresIn desde variables de entorno', () => {
    process.env.JWT_SECRET = 'my-custom-secret';
    process.env.JWT_EXPIRES_IN = '24h';
    const jwtConfig = require('../../../config/jwt');
    expect(jwtConfig.secret).toBe('my-custom-secret');
    expect(jwtConfig.expiresIn).toBe('24h');
  });

  test('Debe usar expiresIn por defecto si no está definido', () => {
    process.env.JWT_SECRET = 'test-secret';
    delete process.env.JWT_EXPIRES_IN;
    const jwtConfig = require('../../../config/jwt');
    expect(jwtConfig.expiresIn).toBe('8h');
  });

  test('Debe hacer exit process si JWT_SECRET no está definido', () => {
    delete process.env.JWT_SECRET;
    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});
    const mockError = jest.spyOn(console, 'error').mockImplementation(() => {});
    require('../../../config/jwt');
    expect(mockExit).toHaveBeenCalledWith(1);
    mockExit.mockRestore();
    mockError.mockRestore();
  });
});
