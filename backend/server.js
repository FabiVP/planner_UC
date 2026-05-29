const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/courses', require('./routes/course.routes'));
app.use('/api/teachers', require('./routes/teacher.routes'));
app.use('/api/students', require('./routes/student.routes'));
app.use('/api/classrooms', require('./routes/classroom.routes'));
app.use('/api/enrollments', require('./routes/enrollment.routes'));
app.use('/api/schedule', require('./routes/schedule.routes'));
app.use('/api/generations', require('./routes/generation.routes'));
app.use('/api/dashboard', require('./routes/dashboard.routes'));
app.use('/api/preferences', require('./routes/preference.routes'));
app.use('/api/notifications', require('./routes/notification.routes'));
app.use('/api/reports', require('./routes/report.routes'));
app.use('/api/restrictions', require('./routes/restriction.routes'));
app.use('/api/profile', require('./routes/profile.routes'));
app.use('/api/careers', require('./routes/career.routes'));
app.use('/api/policies', require('./routes/policy.routes'));
app.use('/api/projections', require('./routes/projection.routes'));
app.use('/api/student-schedule', require('./routes/student-schedule.routes'));
app.use('/api/simulations', require('./routes/simulation.routes'));
app.use('/api/campuses', require('./routes/campus.routes'));
app.use('/api', require('./routes/section.routes'));

// Health check — incluye estado de la base de datos
app.get('/api/health', (req, res) => {
  const dbStates = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: {
      state: dbStates[mongoose.connection.readyState] || 'unknown',
      host: mongoose.connection.host || null,
      name: mongoose.connection.name || null,
    }
  });
});

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: `Ruta ${req.originalUrl} no encontrada.` });
});

// Global error handler
app.use(require('./middleware/errorHandler'));

/**
 * Iniciar servidor: primero conectar a la BD, luego abrir el puerto.
 * Si se usa MongoDB en memoria, ejecuta el seed automáticamente.
 */
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Conectar a la base de datos
    await connectDB();

    // Verificar si la BD está vacía (modo in-memory o primera ejecución)
    const User = require('./models/User');
    const userCount = await User.countDocuments();

    if (userCount === 0) {
      console.log('📋 Base de datos vacía detectada. Ejecutando seed automático...');
      try {
        await require('./seed/seedInline')();
        console.log('✅ Seed automático completado.');
      } catch (seedErr) {
        console.warn('⚠️  Error en seed automático:', seedErr.message);
        console.log('   Puedes ejecutar el seed manualmente: npm run seed');
      }
    }

    // Iniciar servidor HTTP
    app.listen(PORT, () => {
      console.log('');
      console.log('══════════════════════════════════════════');
      console.log(`🚀 UniScheduler Backend running on port ${PORT}`);
      console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 API: http://localhost:${PORT}/api`);
      console.log(`💚 Health: http://localhost:${PORT}/api/health`);
      console.log('══════════════════════════════════════════');
      console.log('');
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;
