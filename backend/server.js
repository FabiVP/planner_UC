const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const { co2Monitor, getMetrics } = require('./middleware/co2Monitor');
// OWASP Top 10 2025: Custom security middleware
const { securityHeaders, sanitizeInputs } = require('./middleware/security');

dotenv.config();


const app = express();

// OWASP A05: Trust proxy (needed for rate-limit behind reverse proxy)
app.set('trust proxy', 1);

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Handled by our custom securityHeaders
  crossOriginEmbedderPolicy: false,
}));
app.use(securityHeaders); // OWASP A05: Enhanced security headers + CSP
app.use(compression({ level: 6, threshold: 1024 }));
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(morgan('dev'));
app.use(express.json({ limit: '2mb' })); // Limit reduced: OWASP A06
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(sanitizeInputs); // OWASP A03: Global input sanitization
app.use(co2Monitor);


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

// Sustainability metrics endpoint
app.get('/api/sustainability', getMetrics);

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

    // Seed automático solo si la BD está completamente vacía (seedInline verifica internamente)
    try {
      await require('./seed/seedInline')();
    } catch (seedErr) {
      console.warn('⚠️  Error en seed automático:', seedErr.message);
      console.log('   Puedes ejecutar el seed manualmente: npm run seed');
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

if (require.main === module) {
  startServer();
}

module.exports = app;
