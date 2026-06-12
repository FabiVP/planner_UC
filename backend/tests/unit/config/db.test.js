describe('DB Config', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  test('Debe exportar una función connectDB', () => {
    const connectDB = require('../../../config/db');
    expect(typeof connectDB).toBe('function');
  });
});
