/**
 * security.test.js — Pruebas unitarias del middleware de seguridad OWASP
 * Cubre: securityHeaders, sanitizeInputs, handleValidationErrors,
 *        filterAllowedFields.
 */
const httpMocks = require('node-mocks-http');
const {
  securityHeaders,
  sanitizeInputs,
  handleValidationErrors,
  filterAllowedFields,
} = require('../../../middleware/security');

// Mock express-validator
jest.mock('express-validator', () => ({
  body: () => ({}),
  validationResult: jest.fn(),
}));

const { validationResult } = require('express-validator');

// ── securityHeaders ───────────────────────────────────────────────────────
describe('securityHeaders middleware', () => {
  const buildMocks = () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    res.removeHeader = jest.fn();
    const next = jest.fn();
    return { req, res, next };
  };

  it('debe llamar a next()', () => {
    const { req, res, next } = buildMocks();
    securityHeaders(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('debe establecer Content-Security-Policy', () => {
    const { req, res, next } = buildMocks();
    securityHeaders(req, res, next);
    const csp = res.getHeader('Content-Security-Policy');
    expect(csp).toBeDefined();
    expect(csp).toContain("default-src 'self'");
  });

  it('debe establecer X-Frame-Options: DENY (anti-clickjacking)', () => {
    const { req, res, next } = buildMocks();
    securityHeaders(req, res, next);
    expect(res.getHeader('X-Frame-Options')).toBe('DENY');
  });

  it('debe establecer X-Content-Type-Options: nosniff', () => {
    const { req, res, next } = buildMocks();
    securityHeaders(req, res, next);
    expect(res.getHeader('X-Content-Type-Options')).toBe('nosniff');
  });

  it('debe establecer Strict-Transport-Security (HSTS)', () => {
    const { req, res, next } = buildMocks();
    securityHeaders(req, res, next);
    const hsts = res.getHeader('Strict-Transport-Security');
    expect(hsts).toContain('max-age=31536000');
    expect(hsts).toContain('includeSubDomains');
  });

  it('debe establecer Referrer-Policy', () => {
    const { req, res, next } = buildMocks();
    securityHeaders(req, res, next);
    expect(res.getHeader('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
  });

  it('debe establecer Permissions-Policy', () => {
    const { req, res, next } = buildMocks();
    securityHeaders(req, res, next);
    const pp = res.getHeader('Permissions-Policy');
    expect(pp).toContain('camera=()');
    expect(pp).toContain('microphone=()');
  });

  it('debe remover X-Powered-By', () => {
    const { req, res, next } = buildMocks();
    securityHeaders(req, res, next);
    expect(res.removeHeader).toHaveBeenCalledWith('X-Powered-By');
  });

  it('CSP debe bloquear frame-ancestors (anti-clickjacking avanzado)', () => {
    const { req, res, next } = buildMocks();
    securityHeaders(req, res, next);
    expect(res.getHeader('Content-Security-Policy')).toContain("frame-ancestors 'none'");
  });

  it('CSP debe bloquear object-src (prevenir Flash/plugins)', () => {
    const { req, res, next } = buildMocks();
    securityHeaders(req, res, next);
    expect(res.getHeader('Content-Security-Policy')).toContain("object-src 'none'");
  });
});

// ── sanitizeInputs ────────────────────────────────────────────────────────
describe('sanitizeInputs middleware', () => {
  const next = jest.fn();

  beforeEach(() => next.mockClear());

  it('debe eliminar etiquetas HTML del body (OWASP A03 XSS)', () => {
    const req = httpMocks.createRequest({
      body: { name: '<script>alert("xss")</script>Admin' },
    });
    const res = httpMocks.createResponse();
    sanitizeInputs(req, res, next);
    expect(req.body.name).toBe('Admin');
    expect(next).toHaveBeenCalled();
  });

  it('debe eliminar tags HTML complejos', () => {
    const req = httpMocks.createRequest({
      body: { description: '<img src=x onerror="alert(1)">texto' },
    });
    const res = httpMocks.createResponse();
    sanitizeInputs(req, res, next);
    expect(req.body.description).toBe('texto');
  });

  it('debe hacer trim de espacios en blanco', () => {
    const req = httpMocks.createRequest({
      body: { email: '  user@test.com  ' },
    });
    const res = httpMocks.createResponse();
    sanitizeInputs(req, res, next);
    expect(req.body.email).toBe('user@test.com');
  });

  it('debe preservar strings sin etiquetas HTML', () => {
    const req = httpMocks.createRequest({
      body: { name: 'Juan García', role: 'admin' },
    });
    const res = httpMocks.createResponse();
    sanitizeInputs(req, res, next);
    expect(req.body.name).toBe('Juan García');
    expect(req.body.role).toBe('admin');
  });

  it('debe manejar body vacío sin errores', () => {
    const req = httpMocks.createRequest({ body: {} });
    const res = httpMocks.createResponse();
    expect(() => sanitizeInputs(req, res, next)).not.toThrow();
    expect(next).toHaveBeenCalled();
  });

  it('no debe modificar campos no-string (números, booleanos)', () => {
    const req = httpMocks.createRequest({
      body: { count: 42, active: true },
    });
    const res = httpMocks.createResponse();
    sanitizeInputs(req, res, next);
    expect(req.body.count).toBe(42);
    expect(req.body.active).toBe(true);
  });

  it('debe manejar body null sin error', () => {
    const req = httpMocks.createRequest();
    req.body = null;
    const res = httpMocks.createResponse();
    expect(() => sanitizeInputs(req, res, next)).not.toThrow();
  });
});

// ── handleValidationErrors ────────────────────────────────────────────────
describe('handleValidationErrors middleware', () => {
  it('debe llamar next() si no hay errores de validación', () => {
    validationResult.mockReturnValue({ isEmpty: () => true });
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const next = jest.fn();
    handleValidationErrors(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.statusCode).toBe(200);
  });

  it('debe retornar 422 si hay errores de validación', () => {
    validationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => [{ path: 'email', msg: 'Email inválido' }],
    });
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const next = jest.fn();
    handleValidationErrors(req, res, next);
    expect(res.statusCode).toBe(422);
    const body = JSON.parse(res._getData());
    expect(body.message).toContain('validación');
    expect(body.errors[0].field).toBe('email');
    expect(next).not.toHaveBeenCalled();
  });
});

// ── filterAllowedFields ────────────────────────────────────────────────────
describe('filterAllowedFields middleware', () => {
  it('debe filtrar campos no permitidos (Mass Assignment)', () => {
    const req = httpMocks.createRequest({
      body: { name: 'Juan', role: 'admin', __proto__: 'malicious' },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();
    filterAllowedFields(['name'])(req, res, next);
    expect(req.body).toEqual({ name: 'Juan' });
    expect(next).toHaveBeenCalled();
  });

  it('debe preservar solo los campos en la whitelist', () => {
    const req = httpMocks.createRequest({
      body: { email: 'a@b.com', password: '123', isAdmin: true },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();
    filterAllowedFields(['email', 'password'])(req, res, next);
    expect(req.body.isAdmin).toBeUndefined();
    expect(req.body.email).toBe('a@b.com');
  });

  it('debe manejar body vacío sin error', () => {
    const req = httpMocks.createRequest({ body: {} });
    const res = httpMocks.createResponse();
    const next = jest.fn();
    expect(() => filterAllowedFields(['name'])(req, res, next)).not.toThrow();
  });
});
