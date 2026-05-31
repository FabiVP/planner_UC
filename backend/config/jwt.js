const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  console.error('FATAL: JWT_SECRET environment variable is not set. Server will not start.');
  console.error('  Set a strong secret in your .env file (e.g. a 64-char hex string).');
  process.exit(1);
}

module.exports = {
  secret: jwtSecret,
  expiresIn: process.env.JWT_EXPIRES_IN || '8h',
};