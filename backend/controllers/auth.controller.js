const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const jwtConfig = require('../config/jwt');
const { validationResult } = require('express-validator');

// Register
exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Error de validación', errors: errors.array() });
    }

    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El email ya está registrado.' });
    }

    const user = await User.create({ name, email, password, role: role || 'estudiante' });
    const token = jwt.sign({ id: user._id, role: user.role }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });

    // Link or create Teacher profile if role is docente
    if (user.role === 'docente') {
      const existingTeacher = await Teacher.findOne({ email: user.email });
      if (existingTeacher) {
        await Teacher.findByIdAndUpdate(existingTeacher._id, { userId: user._id });
      } else {
        await Teacher.create({
          userId: user._id,
          name: user.name,
          email: user.email
        });
      }
    }

    // Auto-create Student profile for estudiante role
    if (user.role === 'estudiante') {
      const existingStudent = await Student.findOne({ email: user.email });
      if (!existingStudent) {
        const count = await Student.countDocuments();
        await Student.create({
          userId: user._id,
          name: user.name,
          email: user.email,
          studentCode: `AUTO-${String(count + 1).padStart(5, '0')}`,
          currentSemester: 1
        });
      }
    }

    res.status(201).json({
      message: 'Usuario registrado exitosamente.',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    next(error);
  }
};

// Login
exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Error de validación', errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });

    res.json({
      message: 'Inicio de sesión exitoso.',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    next(error);
  }
};

// Get current user profile
exports.getProfile = async (req, res, next) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    next(error);
  }
};
