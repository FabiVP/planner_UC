const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');
const Course = require('../models/Course');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const Classroom = require('../models/Classroom');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Course.deleteMany({}),
      Teacher.deleteMany({}),
      Student.deleteMany({}),
      Classroom.deleteMany({})
    ]);
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'Administrador',
      email: 'admin@uni.edu',
      password: 'admin123',
      role: 'coordinador'
    });
    console.log('👤 Admin user created: admin@uni.edu / admin123');

    // Create courses
    const coursesData = [
      { code: 'CS101', name: 'Introducción a la Programación', credits: 4, type: 'laboratorio', semester: 1, sessionsPerWeek: 2 },
      { code: 'MA101', name: 'Cálculo I', credits: 4, type: 'teorico', semester: 1, sessionsPerWeek: 2 },
      { code: 'CS201', name: 'Estructuras de Datos', credits: 4, type: 'laboratorio', semester: 3, sessionsPerWeek: 2 },
      { code: 'MA201', name: 'Matemáticas Discretas', credits: 3, type: 'teorico', semester: 3, sessionsPerWeek: 2 },
      { code: 'CS301', name: 'Base de Datos', credits: 4, type: 'laboratorio', semester: 5, sessionsPerWeek: 2 },
      { code: 'CS302', name: 'Sistemas Operativos', credits: 4, type: 'laboratorio', semester: 5, sessionsPerWeek: 2 },
      { code: 'CS303', name: 'Redes de Computadoras', credits: 3, type: 'laboratorio', semester: 5, sessionsPerWeek: 2 },
      { code: 'CS401', name: 'Inteligencia Artificial', credits: 4, type: 'teorico', semester: 7, sessionsPerWeek: 2 },
      { code: 'CS402', name: 'Programación Web', credits: 3, type: 'laboratorio', semester: 7, sessionsPerWeek: 2 },
      { code: 'CS403', name: 'Taller de Programación', credits: 3, type: 'laboratorio', semester: 7, sessionsPerWeek: 2 },
      { code: 'CS501', name: 'Programación Orientada a Objetos', credits: 4, type: 'laboratorio', semester: 3, sessionsPerWeek: 2 },
      { code: 'CS502', name: 'Seminario de Investigación', credits: 3, type: 'teorico', semester: 9, sessionsPerWeek: 1 },
    ];

    const courses = await Course.insertMany(coursesData);
    console.log(`📚 ${courses.length} courses created`);

    // Set prerequisites
    const courseMap = {};
    courses.forEach(c => { courseMap[c.code] = c; });

    // CS201 requires CS101
    await Course.findByIdAndUpdate(courseMap['CS201']._id, { prerequisites: [courseMap['CS101']._id] });
    // CS301 requires CS201
    await Course.findByIdAndUpdate(courseMap['CS301']._id, { prerequisites: [courseMap['CS201']._id] });
    // CS302 requires CS201
    await Course.findByIdAndUpdate(courseMap['CS302']._id, { prerequisites: [courseMap['CS201']._id] });
    // CS401 requires CS301 + MA201
    await Course.findByIdAndUpdate(courseMap['CS401']._id, { prerequisites: [courseMap['CS301']._id, courseMap['MA201']._id] });
    // CS501 requires CS101
    await Course.findByIdAndUpdate(courseMap['CS501']._id, { prerequisites: [courseMap['CS101']._id] });
    console.log('🔗 Prerequisites set');

    // Create teachers
    const teachersData = [
      {
        name: 'Dr. Carlos Mendoza',
        email: 'cmendoza@uni.edu',
        specializations: [courseMap['CS101']._id, courseMap['CS201']._id, courseMap['CS301']._id],
        maxCourses: 3,
        availability: [
          { day: 'lunes', startTime: '08:00', endTime: '14:00' },
          { day: 'martes', startTime: '08:00', endTime: '14:00' },
          { day: 'miercoles', startTime: '08:00', endTime: '14:00' },
          { day: 'jueves', startTime: '08:00', endTime: '14:00' },
          { day: 'viernes', startTime: '08:00', endTime: '14:00' },
        ]
      },
      {
        name: 'Dra. Ana García',
        email: 'agarcia@uni.edu',
        specializations: [courseMap['MA101']._id, courseMap['MA201']._id, courseMap['CS401']._id],
        maxCourses: 3,
        availability: [
          { day: 'lunes', startTime: '09:00', endTime: '15:00' },
          { day: 'martes', startTime: '09:00', endTime: '15:00' },
          { day: 'miercoles', startTime: '09:00', endTime: '15:00' },
          { day: 'jueves', startTime: '09:00', endTime: '15:00' },
          { day: 'viernes', startTime: '09:00', endTime: '13:00' },
        ]
      },
      {
        name: 'Mg. Roberto Sánchez',
        email: 'rsanchez@uni.edu',
        specializations: [courseMap['CS302']._id, courseMap['CS303']._id, courseMap['CS402']._id],
        maxCourses: 3,
        availability: [
          { day: 'lunes', startTime: '10:00', endTime: '18:00' },
          { day: 'martes', startTime: '10:00', endTime: '18:00' },
          { day: 'miercoles', startTime: '10:00', endTime: '18:00' },
          { day: 'jueves', startTime: '10:00', endTime: '18:00' },
          { day: 'viernes', startTime: '10:00', endTime: '16:00' },
        ]
      },
      {
        name: 'Dra. María López',
        email: 'mlopez@uni.edu',
        specializations: [courseMap['CS403']._id, courseMap['CS501']._id, courseMap['CS502']._id],
        maxCourses: 3,
        availability: [
          { day: 'lunes', startTime: '08:00', endTime: '16:00' },
          { day: 'martes', startTime: '08:00', endTime: '16:00' },
          { day: 'miercoles', startTime: '08:00', endTime: '16:00' },
          { day: 'jueves', startTime: '08:00', endTime: '16:00' },
          { day: 'viernes', startTime: '08:00', endTime: '14:00' },
          { day: 'sabado', startTime: '08:00', endTime: '12:00' },
        ]
      },
      {
        name: 'Dr. Fernando Torres',
        email: 'ftorres@uni.edu',
        specializations: [courseMap['CS101']._id, courseMap['CS201']._id, courseMap['CS401']._id],
        maxCourses: 3,
        availability: [
          { day: 'lunes', startTime: '14:00', endTime: '20:00' },
          { day: 'martes', startTime: '14:00', endTime: '20:00' },
          { day: 'miercoles', startTime: '14:00', endTime: '20:00' },
          { day: 'jueves', startTime: '14:00', endTime: '20:00' },
        ]
      }
    ];

    const teachers = await Teacher.insertMany(teachersData);
    console.log(`👨‍🏫 ${teachers.length} teachers created`);

    // Create classrooms
    const classroomsData = [
      { code: 'AULA-201', name: 'Aula 201', capacity: 40, type: 'teorico', building: 'Principal', floor: 2 },
      { code: 'AULA-202', name: 'Aula 202', capacity: 35, type: 'teorico', building: 'Principal', floor: 2 },
      { code: 'AULA-203', name: 'Aula 203', capacity: 45, type: 'teorico', building: 'Principal', floor: 2 },
      { code: 'AULA-204', name: 'Aula 204', capacity: 30, type: 'teorico', building: 'Principal', floor: 2 },
      { code: 'AULA-301', name: 'Aula 301', capacity: 50, type: 'teorico', building: 'Principal', floor: 3 },
      { code: 'AULA-302', name: 'Aula 302', capacity: 40, type: 'teorico', building: 'Principal', floor: 3 },
      { code: 'LAB-1', name: 'Laboratorio 1', capacity: 30, type: 'laboratorio', building: 'Tecnológico', floor: 1, equipment: ['computadoras', 'proyector'] },
      { code: 'LAB-2', name: 'Laboratorio 2', capacity: 25, type: 'laboratorio', building: 'Tecnológico', floor: 1, equipment: ['computadoras', 'proyector', 'redes'] },
    ];

    const classrooms = await Classroom.insertMany(classroomsData);
    console.log(`🏫 ${classrooms.length} classrooms created`);

    // Create students
    const studentsData = [];
    const firstNames = ['Juan', 'María', 'Carlos', 'Ana', 'Pedro', 'Lucía', 'Diego', 'Sofía', 'Jorge', 'Valentina', 'Luis', 'Camila', 'Andrés', 'Isabella', 'Miguel'];
    const lastNames = ['García', 'Rodríguez', 'Martínez', 'López', 'Hernández', 'González', 'Pérez', 'Sánchez', 'Ramírez', 'Torres', 'Flores', 'Rivera', 'Gómez', 'Díaz', 'Cruz'];

    for (let i = 0; i < 15; i++) {
      const semester = Math.floor(i / 3) * 2 + 1;
      const approvedCourses = [];

      // Students in higher semesters have approved earlier courses
      if (semester >= 3) {
        approvedCourses.push({ courseId: courseMap['CS101']._id, grade: 14 + Math.floor(Math.random() * 6), semester: '2025-I' });
        approvedCourses.push({ courseId: courseMap['MA101']._id, grade: 12 + Math.floor(Math.random() * 8), semester: '2025-I' });
      }
      if (semester >= 5) {
        approvedCourses.push({ courseId: courseMap['CS201']._id, grade: 13 + Math.floor(Math.random() * 7), semester: '2025-II' });
        approvedCourses.push({ courseId: courseMap['MA201']._id, grade: 12 + Math.floor(Math.random() * 8), semester: '2025-II' });
        approvedCourses.push({ courseId: courseMap['CS501']._id, grade: 14 + Math.floor(Math.random() * 6), semester: '2025-II' });
      }

      studentsData.push({
        name: `${firstNames[i]} ${lastNames[i]}`,
        email: `${firstNames[i].toLowerCase()}.${lastNames[i].toLowerCase()}@uni.edu`,
        studentCode: `2024${String(i + 1).padStart(4, '0')}`,
        currentSemester: semester,
        career: 'Ingeniería de Sistemas',
        approvedCourses,
        totalCreditsApproved: approvedCourses.reduce((sum, ac) => sum + (ac.grade >= 11 ? 4 : 0), 0)
      });
    }

    const students = await Student.insertMany(studentsData);
    console.log(`🎓 ${students.length} students created`);

    console.log('\n✅ Seed completed successfully!');
    console.log('─────────────────────────────');
    console.log('Login: admin@uni.edu / admin123');
    console.log('─────────────────────────────');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();
