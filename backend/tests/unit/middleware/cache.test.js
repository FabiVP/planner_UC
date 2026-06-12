const { cacheMiddleware, invalidateCacheByPrefix, cache } = require('../../../middleware/cache');

describe('Cache Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    cache.flushAll();
    req = { originalUrl: '/api/courses' };
    res = { json: jest.fn() };
    next = jest.fn();
  });

  test('Debe cachear la respuesta en la primera llamada', () => {
    const middleware = cacheMiddleware('test');
    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(typeof res.json).toBe('function');

    res.json({ data: 'test' });
    const cached = cache.get('test:/api/courses');
    expect(cached).toEqual({ data: 'test' });
  });

  test('Debe retornar datos cacheados en llamadas subsecuentes', () => {
    cache.set('test:/api/courses', { data: 'cached' });
    const middleware = cacheMiddleware('test');
    middleware(req, res, next);
    expect(res.json).toHaveBeenCalledWith({ data: 'cached' });
    expect(next).not.toHaveBeenCalled();
  });

  test('invalidar cache por prefijo debe eliminar solo las keys matching', () => {
    cache.set('test:/api/courses', { data: 1 });
    cache.set('test:/api/teachers', { data: 2 });
    cache.set('other:/api/data', { data: 3 });

    invalidateCacheByPrefix('test');

    expect(cache.get('test:/api/courses')).toBeUndefined();
    expect(cache.get('test:/api/teachers')).toBeUndefined();
    expect(cache.get('other:/api/data')).toEqual({ data: 3 });
  });
});
