const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.stack);

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ message: 'Error de validación', errors: messages });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({ message: `El campo '${field}' ya existe con ese valor.` });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'ID inválido proporcionado.' });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Error interno del servidor.',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
