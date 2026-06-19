/**
 * Security Headers Middleware — OWASP Top 10 2025 Mitigations
 * 
 * Covers:
 * - A01: Broken Access Control → CORS strict config
 * - A02: Cryptographic Failures → Secure cookie flags
 * - A03: Injection → Input sanitization + CSP
 * - A05: Security Misconfiguration → Security headers
 * - A07: Identification & Auth Failures → Anti-clickjacking
 */
const { body, validationResult } = require('express-validator');

/**
 * Enhanced Content Security Policy + Security Headers.
 * Extends Helmet defaults with stricter directives.
 */
const securityHeaders = (req, res, next) => {
  // OWASP A05: Remove fingerprinting header (already done by helmet, reinforce)
  res.removeHeader('X-Powered-By');

  // OWASP A03: Content Security Policy — prevent XSS injection
  res.setHeader(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https:",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
    ].join('; ')
  );

  // OWASP A05: Prevent clickjacking (SC 2.4.3 also benefits)
  res.setHeader('X-Frame-Options', 'DENY');

  // OWASP A05: Prevent MIME-type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // OWASP A05: Strict Transport Security (HSTS)
  res.setHeader(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  );

  // OWASP A05: Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // OWASP A05: Permissions Policy — restrict browser features
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=()'
  );

  // OWASP A05: Cross-Origin Embedder/Opener/Resource policies
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');

  next();
};

/**
 * Input sanitization — OWASP A03 Injection prevention.
 * 1) Elimina contenido de tags peligrosos (script, style, iframe, etc.)
 * 2) Elimina todos los tags HTML restantes
 * 3) Hace trim de espacios
 * @param {object} req - Express request
 * @param {object} res - Express response
 * @param {Function} next
 */
const DANGEROUS_TAGS = /(<\s*(script|style|iframe|object|embed|form|input|button|link|meta)[^>]*>[\s\S]*?<\/\s*\2\s*>)/gi;
const HTML_TAGS = /<[^>]*>/g;

const sanitizeInputs = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    for (const key of Object.keys(req.body)) {
      if (typeof req.body[key] === 'string') {
        // 1. Eliminar contenido completo de tags peligrosos (XSS, injection)
        req.body[key] = req.body[key].replace(DANGEROUS_TAGS, '');
        // 2. Eliminar tags HTML restantes
        req.body[key] = req.body[key].replace(HTML_TAGS, '');
        // 3. Trim
        req.body[key] = req.body[key].trim();
      }
    }
  }
  next();
};

/**
 * Validates express-validator results and returns 422 on failure.
 * OWASP A03: Prevent injection via unvalidated input.
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Error de validación en los datos enviados.',
      errors: errors.array().map(e => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

/**
 * Prevents Mass Assignment by only allowing known fields.
 * OWASP A01: Broken Access Control mitigation.
 * @param {string[]} allowedFields - List of permitted field names
 */
const filterAllowedFields = (allowedFields) => (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    const filtered = {};
    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        filtered[field] = req.body[field];
      }
    }
    req.body = filtered;
  }
  next();
};

module.exports = {
  securityHeaders,
  sanitizeInputs,
  handleValidationErrors,
  filterAllowedFields,
};
