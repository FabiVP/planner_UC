module.exports = {
  secret: process.env.JWT_SECRET || 'default_secret_change_me',
  expiresIn: process.env.JWT_EXPIRES_IN || '8h',
};
