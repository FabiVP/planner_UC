const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Acceso no autorizado. Token requerido.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, jwtConfig.secret);
    
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Token inválido. Usuario no encontrado.' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expirado. Inicie sesión nuevamente.' });
    }
    return res.status(401).json({ message: 'Token inválido.' });
  }
};

module.exports = auth;
