const mongoose = require('mongoose');

const createObjectId = (id) => new mongoose.Types.ObjectId(id);

const mockUser = (overrides = {}) => ({
  _id: createObjectId('507f191e810c19729de860ea'),
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
  role: 'coordinador',
  active: true,
  career: 'Ingeniería de Sistemas',
  ...overrides,
});

const mockCourse = (overrides = {}) => ({
  _id: createObjectId('507f191e810c19729de860eb'),
  code: 'CS101',
  name: 'Introducción a la Programación',
  credits: 4,
  type: 'teorico',
  semester: 1,
  career: createObjectId('507f191e810c19729de860ec'),
  sessionsPerWeek: 2,
  hoursPerSession: 2,
  mandatory: true,
  active: true,
  ...overrides,
});

const mockTeacher = (overrides = {}) => ({
  _id: createObjectId('507f191e810c19729de860ed'),
  name: 'Dr. Pérez',
  email: 'perez@example.com',
  contractType: 'tiempo_completo',
  teachingHours: 40,
  maxCourses: 5,
  maxWeeklyHours: 40,
  availability: [],
  freeDays: [],
  active: true,
  ...overrides,
});

const mockClassroom = (overrides = {}) => ({
  _id: createObjectId('507f191e810c19729de860ee'),
  code: 'A101',
  name: 'Aula 101',
  type: 'teorico',
  capacity: 40,
  available: true,
  ...overrides,
});

const mockToken = (user = mockUser()) => {
  const jwt = require('jsonwebtoken');
  const jwtConfig = require('../../config/jwt');
  return jwt.sign({ id: user._id, role: user.role }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });
};

module.exports = { createObjectId, mockUser, mockCourse, mockTeacher, mockClassroom, mockToken };
