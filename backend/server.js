const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

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

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Global error handler
app.use(require('./middleware/errorHandler'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 UniScheduler Backend running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
