/**
 * Poblar datos masivos — 60 cursos, 58 docentes, 150 estudiantes
 * Todos para Ingeniería de Sistemas, campus Huancayo.
 *
 * Ejecutar: node seed/poblar_datos_masivos.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const Career = require('../models/Career');
const Course = require('../models/Course');
const Teacher = require('../models/Teacher');
const User = require('../models/User');
const Student = require('../models/Student');
const Campus = require('../models/Campus');
const Preference = require('../models/Preference');

// ─── Nombres realistas ───
const apellidos = [
  'Quispe', 'Huamán', 'Paredes', 'Flores', 'Rojas', 'Castillo', 'Moreno',
  'Sánchez', 'Herrera', 'Núñez', 'Cruz', 'Peña', 'Vargas', 'García',
  'Martínez', 'López', 'González', 'Rodríguez', 'Torres', 'Ramírez',
  'Díaz', 'Pérez', 'Chávez', 'Romero', 'Álvarez', 'Soto', 'Ramos',
  'Córdova', 'Medina', 'Vega', 'Ortega', 'Castellanos', 'Guzmán',
  'Mendoza', 'Rivas', 'Campos', 'Acosta', 'Salazar', 'Pachas', 'Cárdenas',
  'Espinoza', 'Ríos', 'Miranda', 'Vilca', 'Sulca', 'Poma', 'Aguilar',
  'Tapia', 'Castro', 'Ortiz'
];

const nombresMasc = [
  'Carlos', 'Luis', 'Jorge', 'Diego', 'Andrés', 'Fernando', 'Mateo',
  'Sebastián', 'Nicolás', 'Alejandro', 'Miguel', 'José', 'Juan', 'David',
  'Daniel', 'Marco', 'Pedro', 'Pablo', 'Cristian', 'Manuel', 'Ricardo',
  'Eduardo', 'Gustavo', 'Raúl', 'Hugo', 'Iván', 'Óscar', 'Víctor'
];

const nombresFem = [
  'Sofía', 'Valeria', 'Camila', 'Isabella', 'Daniela', 'Valentina',
  'Luciana', 'María', 'Ana', 'Carmen', 'Rosa', 'Patricia', 'Laura',
  'Andrea', 'Lucía', 'Elena', 'Paula', 'Gabriela', 'Fernanda', 'Ximena',
  'Natalia', 'Alejandra', 'Mariana', 'Claudia', 'Verónica', 'Silvia',
  'Mónica', 'Ruth'
];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomShuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateStudentName(idx) {
  const nombre = idx % 2 === 0
    ? randomChoice(nombresMasc)
    : randomChoice(nombresFem);
  const apellido1 = randomChoice(apellidos);
  const apellido2 = randomChoice(apellidos);
  return { name: `${nombre} ${apellido1} ${apellido2}`, firstName: nombre, lastName: `${apellido1} ${apellido2}` };
}

function generateTeacherName(idx) {
  const nombre = randomChoice(nombresMasc);
  const apellido1 = randomChoice(apellidos);
  const apellido2 = randomChoice(apellidos);
  return { name: `${nombre} ${apellido1} ${apellido2}`, firstName: nombre, lastName: `${apellido1} ${apellido2}` };
}

// ─── Definición de 60 cursos (6 por semestre × 10) ───
const courseDefs = [
  // Semestre 1
  { code: 'SI101', name: 'Matemática Básica', credits: 4, semester: 1, type: 'teorico', sessionsPerWeek: 3, hoursPerSession: 1, difficulty: 2 },
  { code: 'SI102', name: 'Comunicación Integral', credits: 3, semester: 1, type: 'teorico', sessionsPerWeek: 2, hoursPerSession: 1, difficulty: 1 },
  { code: 'SI103', name: 'Introducción a la Programación', credits: 4, semester: 1, type: 'teorico', sessionsPerWeek: 3, hoursPerSession: 1, difficulty: 3 },
  { code: 'SI104', name: 'Introducción a la Ingeniería de Sistemas', credits: 2, semester: 1, type: 'teorico', sessionsPerWeek: 1, hoursPerSession: 2, difficulty: 1 },
  { code: 'SI105', name: 'Física General', credits: 4, semester: 1, type: 'teorico', sessionsPerWeek: 3, hoursPerSession: 1, difficulty: 3 },
  { code: 'SI106', name: 'Metodología del Estudio', credits: 2, semester: 1, type: 'teorico', sessionsPerWeek: 1, hoursPerSession: 2, difficulty: 1 },

  // Semestre 2
  { code: 'SI201', name: 'Programación I', credits: 4, semester: 2, type: 'laboratorio', sessionsPerWeek: 3, hoursPerSession: 1, difficulty: 3, prereqCodes: ['SI103'] },
  { code: 'SI202', name: 'Cálculo I', credits: 5, semester: 2, type: 'teorico', sessionsPerWeek: 4, hoursPerSession: 1, difficulty: 4, prereqCodes: ['SI101'] },
  { code: 'SI203', name: 'Álgebra Lineal', credits: 4, semester: 2, type: 'teorico', sessionsPerWeek: 3, hoursPerSession: 1, difficulty: 4, prereqCodes: ['SI101'] },
  { code: 'SI204', name: 'Contabilidad General', credits: 3, semester: 2, type: 'teorico', sessionsPerWeek: 2, hoursPerSession: 1, difficulty: 2 },
  { code: 'SI205', name: 'Física I', credits: 4, semester: 2, type: 'teorico', sessionsPerWeek: 3, hoursPerSession: 1, difficulty: 3, prereqCodes: ['SI105'] },
  { code: 'SI206', name: 'Estadística Descriptiva', credits: 3, semester: 2, type: 'teorico', sessionsPerWeek: 2, hoursPerSession: 1, difficulty: 2 },

  // Semestre 3
  { code: 'SI301', name: 'Programación II', credits: 4, semester: 3, type: 'laboratorio', sessionsPerWeek: 3, hoursPerSession: 1, difficulty: 4, prereqCodes: ['SI201'] },
  { code: 'SI302', name: 'Cálculo II', credits: 4, semester: 3, type: 'teorico', sessionsPerWeek: 3, hoursPerSession: 1, difficulty: 4, prereqCodes: ['SI202'] },
  { code: 'SI303', name: 'Estructura de Datos', credits: 4, semester: 3, type: 'laboratorio', sessionsPerWeek: 3, hoursPerSession: 1, difficulty: 4, prereqCodes: ['SI201', 'SI203'] },
  { code: 'SI304', name: 'Base de Datos I', credits: 4, semester: 3, type: 'teorico', sessionsPerWeek: 3, hoursPerSession: 1, difficulty: 3, prereqCodes: ['SI203'] },
  { code: 'SI305', name: 'Matemáticas Discretas', credits: 3, semester: 3, type: 'teorico', sessionsPerWeek: 2, hoursPerSession: 1, difficulty: 4, prereqCodes: ['SI203'] },
  { code: 'SI306', name: 'Estadística Inferencial', credits: 3, semester: 3, type: 'teorico', sessionsPerWeek: 2, hoursPerSession: 1, difficulty: 3, prereqCodes: ['SI206'] },

  // Semestre 4
  { code: 'SI401', name: 'Programación III', credits: 4, semester: 4, type: 'laboratorio', sessionsPerWeek: 3, hoursPerSession: 1, difficulty: 4, prereqCodes: ['SI301'] },
  { code: 'SI402', name: 'Base de Datos II', credits: 4, semester: 4, type: 'laboratorio', sessionsPerWeek: 3, hoursPerSession: 1, difficulty: 4, prereqCodes: ['SI304'] },
  { code: 'SI403', name: 'Análisis de Sistemas', credits: 4, semester: 4, type: 'teorico', sessionsPerWeek: 3, hoursPerSession: 1, difficulty: 3, prereqCodes: ['SI301', 'SI304'] },
  { code: 'SI404', name: 'Arquitectura de Computadoras', credits: 3, semester: 4, type: 'teorico', sessionsPerWeek: 2, hoursPerSession: 1, difficulty: 3, prereqCodes: ['SI303'] },
  { code: 'SI405', name: 'Sistemas Operativos', credits: 4, semester: 4, type: 'laboratorio', sessionsPerWeek: 3, hoursPerSession: 1, difficulty: 4, prereqCodes: ['SI303'] },
  { code: 'SI406', name: 'Investigación de Operaciones', credits: 3, semester: 4, type: 'teorico', sessionsPerWeek: 2, hoursPerSession: 1, difficulty: 4, prereqCodes: ['SI306'] },

  // Semestre 5
  { code: 'SI501', name: 'Ingeniería de Software I', credits: 4, semester: 5, type: 'teorico', sessionsPerWeek: 3, hoursPerSession: 1, difficulty: 3, prereqCodes: ['SI403'] },
  { code: 'SI502', name: 'Redes I', credits: 4, semester: 5, type: 'laboratorio', sessionsPerWeek: 3, hoursPerSession: 1, difficulty: 3, prereqCodes: ['SI404'] },
  { code: 'SI503', name: 'Programación Web', credits: 4, semester: 5, type: 'laboratorio', sessionsPerWeek: 3, hoursPerSession: 1, difficulty: 3, prereqCodes: ['SI401'] },
  { code: 'SI504', name: 'Diseño de Interfaces UX/UI', credits: 3, semester: 5, type: 'laboratorio', sessionsPerWeek: 2, hoursPerSession: 1, difficulty: 2, prereqCodes: ['SI301'] },
  { code: 'SI505', name: 'Administración de Empresas', credits: 3, semester: 5, type: 'teorico', sessionsPerWeek: 2, hoursPerSession: 1, difficulty: 2 },
  { code: 'SI506', name: 'Taller de Base de Datos', credits: 3, semester: 5, type: 'laboratorio', sessionsPerWeek: 2, hoursPerSession: 2, difficulty: 3, prereqCodes: ['SI402'] },

  // Semestre 6
  { code: 'SI601', name: 'Ingeniería de Software II', credits: 4, semester: 6, type: 'teorico', sessionsPerWeek: 3, hoursPerSession: 1, difficulty: 3, prereqCodes: ['SI501'] },
  { code: 'SI602', name: 'Redes II', credits: 4, semester: 6, type: 'laboratorio', sessionsPerWeek: 3, hoursPerSession: 1, difficulty: 4, prereqCodes: ['SI502'] },
  { code: 'SI603', name: 'Programación Móvil', credits: 4, semester: 6, type: 'laboratorio', sessionsPerWeek: 3, hoursPerSession: 1, difficulty: 4, prereqCodes: ['SI503'] },
  { code: 'SI604', name: 'Inteligencia de Negocios', credits: 3, semester: 6, type: 'laboratorio', sessionsPerWeek: 2, hoursPerSession: 1, difficulty: 3, prereqCodes: ['SI402', 'SI306'] },
  { code: 'SI605', name: 'Gestión de TI', credits: 3, semester: 6, type: 'teorico', sessionsPerWeek: 2, hoursPerSession: 1, difficulty: 2, prereqCodes: ['SI501'] },
  { code: 'SI606', name: 'Seguridad Informática I', credits: 3, semester: 6, type: 'teorico', sessionsPerWeek: 2, hoursPerSession: 1, difficulty: 3, prereqCodes: ['SI405'] },

  // Semestre 7
  { code: 'SI701', name: 'Ingeniería de Software III', credits: 4, semester: 7, type: 'laboratorio', sessionsPerWeek: 3, hoursPerSession: 1, difficulty: 4, prereqCodes: ['SI601'] },
  { code: 'SI702', name: 'Inteligencia Artificial', credits: 4, semester: 7, type: 'laboratorio', sessionsPerWeek: 3, hoursPerSession: 1, difficulty: 5, prereqCodes: ['SI303', 'SI306'] },
  { code: 'SI703', name: 'Seguridad Informática II', credits: 3, semester: 7, type: 'laboratorio', sessionsPerWeek: 2, hoursPerSession: 2, difficulty: 4, prereqCodes: ['SI606'] },
  { code: 'SI704', name: 'Computación en la Nube', credits: 3, semester: 7, type: 'laboratorio', sessionsPerWeek: 2, hoursPerSession: 1, difficulty: 3, prereqCodes: ['SI405', 'SI502'] },
  { code: 'SI705', name: 'Gestión de Proyectos TI', credits: 3, semester: 7, type: 'teorico', sessionsPerWeek: 2, hoursPerSession: 1, difficulty: 3, prereqCodes: ['SI601'] },
  { code: 'SI706', name: 'Auditoría de Sistemas', credits: 3, semester: 7, type: 'teorico', sessionsPerWeek: 2, hoursPerSession: 1, difficulty: 3, prereqCodes: ['SI601', 'SI606'] },

  // Semestre 8
  { code: 'SI801', name: 'Sistemas Distribuidos', credits: 4, semester: 8, type: 'laboratorio', sessionsPerWeek: 3, hoursPerSession: 1, difficulty: 4, prereqCodes: ['SI704'] },
  { code: 'SI802', name: 'Ciencia de Datos', credits: 4, semester: 8, type: 'laboratorio', sessionsPerWeek: 3, hoursPerSession: 1, difficulty: 4, prereqCodes: ['SI604', 'SI702'] },
  { code: 'SI803', name: 'Machine Learning', credits: 4, semester: 8, type: 'laboratorio', sessionsPerWeek: 3, hoursPerSession: 1, difficulty: 5, prereqCodes: ['SI702'] },
  { code: 'SI804', name: 'Robótica Educativa', credits: 3, semester: 8, type: 'laboratorio', sessionsPerWeek: 2, hoursPerSession: 2, difficulty: 4, prereqCodes: ['SI405'] },
  { code: 'SI805', name: 'Emprendimiento Digital', credits: 3, semester: 8, type: 'teorico', sessionsPerWeek: 2, hoursPerSession: 1, difficulty: 2 },
  { code: 'SI806', name: 'Legislación Informática', credits: 2, semester: 8, type: 'teorico', sessionsPerWeek: 1, hoursPerSession: 2, difficulty: 1 },

  // Semestre 9
  { code: 'SI901', name: 'Desarrollo de Videojuegos', credits: 4, semester: 9, type: 'laboratorio', sessionsPerWeek: 3, hoursPerSession: 1, difficulty: 4, prereqCodes: ['SI701', 'SI603'] },
  { code: 'SI902', name: 'Criptografía y Seguridad', credits: 3, semester: 9, type: 'teorico', sessionsPerWeek: 2, hoursPerSession: 1, difficulty: 5, prereqCodes: ['SI703'] },
  { code: 'SI903', name: 'Internet de las Cosas', credits: 3, semester: 9, type: 'laboratorio', sessionsPerWeek: 2, hoursPerSession: 2, difficulty: 4, prereqCodes: ['SI704'] },
  { code: 'SI904', name: 'Realidad Virtual y Aumentada', credits: 3, semester: 9, type: 'laboratorio', sessionsPerWeek: 2, hoursPerSession: 2, difficulty: 4, prereqCodes: ['SI701'] },
  { code: 'SI905', name: 'Big Data', credits: 4, semester: 9, type: 'laboratorio', sessionsPerWeek: 3, hoursPerSession: 1, difficulty: 5, prereqCodes: ['SI802'] },
  { code: 'SI906', name: 'Ética Profesional', credits: 2, semester: 9, type: 'teorico', sessionsPerWeek: 1, hoursPerSession: 2, difficulty: 1 },

  // Semestre 10
  { code: 'SI1001', name: 'Proyecto de Tesis I', credits: 4, semester: 10, type: 'teorico', sessionsPerWeek: 2, hoursPerSession: 2, difficulty: 4, prereqCodes: ['SI705'] },
  { code: 'SI1002', name: 'Proyecto de Tesis II', credits: 4, semester: 10, type: 'teorico', sessionsPerWeek: 2, hoursPerSession: 2, difficulty: 4, prereqCodes: ['SI1001'] },
  { code: 'SI1003', name: 'Prácticas Pre-Profesionales', credits: 6, semester: 10, type: 'teorico', sessionsPerWeek: 1, hoursPerSession: 1, difficulty: 1 },
  { code: 'SI1004', name: 'Taller de Emprendimiento', credits: 3, semester: 10, type: 'teorico', sessionsPerWeek: 2, hoursPerSession: 1, difficulty: 2, prereqCodes: ['SI805'] },
  { code: 'SI1005', name: 'Seminario de Actualización', credits: 2, semester: 10, type: 'teorico', sessionsPerWeek: 1, hoursPerSession: 2, difficulty: 1 },
  { code: 'SI1006', name: 'Calidad de Software', credits: 3, semester: 10, type: 'teorico', sessionsPerWeek: 2, hoursPerSession: 1, difficulty: 3, prereqCodes: ['SI701'] },
];

// ─── 58 docentes ───
function generateTeachers(courses) {
  const contractTypes = ['tiempo_completo', 'por_horas'];
  const shifts = ['manana', 'tarde', 'noche'];
  const performanceLevels = ['alto', 'regular', 'bajo'];
  const days = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'];

  const teachers = [];

  for (let i = 0; i < 58; i++) {
    const tName = generateTeacherName(i);
    const contractType = i < 35 ? 'tiempo_completo' : 'por_horas';
    const shift = shifts[i % 3];

    // Assign 1-3 specializations from courses of semesters 1-10
    const specCount = randomInt(1, 3);
    const shuffledCourses = randomShuffle(courses);
    const specializations = shuffledCourses.slice(0, specCount).map(c => c._id);

    // Availability based on shift
    const availability = days.map(day => {
      let startTime, endTime;
      if (shift === 'manana') {
        startTime = `${randomInt(7, 9)}:00`;
        endTime = `${randomInt(12, 14)}:00`;
      } else if (shift === 'tarde') {
        startTime = `${randomInt(14, 16)}:00`;
        endTime = `${randomInt(19, 22)}:00`;
      } else {
        if (i % 2 === 0) {
          startTime = `${randomInt(17, 18)}:00`;
          endTime = `${randomInt(21, 22)}:00`;
        } else {
          return null;
        }
      }
      return { day, startTime: startTime.padStart(5, '0'), endTime: endTime.padStart(5, '0') };
    }).filter(Boolean);

    teachers.push({
      name: tName.name,
      email: `${tName.firstName.toLowerCase()}.${tName.lastName.toLowerCase().replace(/\s/g, '')}@uni.edu`,
      department: 'Ingeniería de Sistemas',
      contractType,
      performanceLevel: randomChoice(performanceLevels),
      performanceScore: randomInt(55, 98),
      specializations,
      maxCourses: contractType === 'tiempo_completo' ? randomInt(3, 5) : randomInt(1, 2),
      preferredShift: shift,
      availability,
      active: true
    });
  }
  return teachers;
}

// ─── 150 estudiantes ───
function generateStudents(courses, careerId) {
  const shifts = ['manana', 'tarde', 'noche'];
  const students = [];

  for (let i = 0; i < 150; i++) {
    const sem = Math.floor(i / 15) + 1; // 15 per semester
    const sName = generateStudentName(i);
    const shift = randomChoice(shifts);
    const works = randomInt(0, 3) === 0; // ~25% work

    // Approved courses: all courses from previous semesters + some from current
    const approvedCourses = [];
    let totalCredits = 0;

    // Add courses from previous semesters
    for (let s = 1; s < sem; s++) {
      const semCourses = courses.filter(c => c.semester === s);
      for (const course of semCourses) {
        approvedCourses.push({
          courseId: course._id,
          grade: randomInt(10, 20),
          semester: `${s}`
        });
        totalCredits += course.credits;
      }
    }

    // Add some courses from current semester (if any)
    if (sem <= 10) {
      const currentSemCourses = randomShuffle(courses.filter(c => c.semester === sem));
      const approvedCurrent = currentSemCourses.slice(0, randomInt(0, Math.min(3, currentSemCourses.length)));
      for (const course of approvedCurrent) {
        approvedCourses.push({
          courseId: course._id,
          grade: randomInt(10, 20),
          semester: `${sem}`
        });
        totalCredits += course.credits;
      }
    }

    students.push({
      name: sName.name,
      email: `${sName.firstName.toLowerCase()}.${sName.lastName.toLowerCase().replace(/\s/g, '')}@uni.edu`,
      studentCode: `ISI${String(i + 1).padStart(4, '0')}`,
      currentSemester: sem,
      career: careerId,
      approvedCourses,
      totalCreditsApproved: totalCredits,
      worksWhileStudying: works,
      preferredShift: shift,
      active: true
    });
  }
  return students;
}

// ─── Main ───
async function poblar() {
  try {
    const dbUri = process.env.MONGODB_URI || process.env.DATABASE_URL || 'mongodb://localhost:27017/unischeduler';
    await mongoose.connect(dbUri);
    console.log('📦 Conectado a MongoDB');

    // Verificar que la carrera ISI existe
    const career = await Career.findOne({ code: 'ISI' });
    if (!career) {
      console.error('❌ Carrera ISI no encontrada. Ejecuta primero npm run seed');
      process.exit(1);
    }
    console.log(`🎓 Carrera: ${career.name}`);

    // ── CAMPUS ──
    const campus = await Campus.findOne({ code: 'HYO' });
    if (campus) {
      console.log('🏛️  Campus Huancayo ya existe.');
    } else {
      console.log('🏛️  Campus Huancayo no encontrado. Se puede crear manualmente desde la app.');
    }

    // ── CURSOS (60) ──
    const existingCourses = await Course.countDocuments({ career: career._id });
    if (existingCourses >= 60) {
      console.log(`📚 Ya existen ${existingCourses} cursos para ISI. Omitiendo...`);
      var courses = await Course.find({ career: career._id });
    } else {
      // Delete ONLY the seed ISI courses (code starts with SI)
      await Course.deleteMany({ career: career._id, code: /^SI/ });

      // Build course map for prerequisites
      const courseMap = {};
      for (const def of courseDefs) {
        courseMap[def.code] = def;
      }

      // Create courses without prerequisites first
      const createdCourses = [];
      for (const def of courseDefs) {
        const c = await Course.create({
          code: def.code, name: def.name, credits: def.credits,
          type: def.type, semester: def.semester, career: career._id,
          sessionsPerWeek: def.sessionsPerWeek, hoursPerSession: def.hoursPerSession,
          difficulty: def.difficulty, mandatory: def.semester <= 8,
          maxStudents: randomInt(25, 50), active: true
        });
        createdCourses.push(c);
      }

      // Set prerequisites
      for (let i = 0; i < courseDefs.length; i++) {
        const def = courseDefs[i];
        if (def.prereqCodes && def.prereqCodes.length > 0) {
          const prereqIds = def.prereqCodes
            .map(code => createdCourses.find(c => c.code === code))
            .filter(Boolean)
            .map(c => c._id);
          if (prereqIds.length > 0) {
            createdCourses[i].prerequisites = prereqIds;
            await createdCourses[i].save();
          }
        }
      }

      courses = createdCourses;
      console.log(`📚 ${courses.length} cursos creados.`);
    }

    // ── DOCENTES (58) ──
    const existingTeachers = await Teacher.countDocuments({ department: 'Ingeniería de Sistemas' });
    if (existingTeachers >= 58) {
      console.log(`👨‍🏫 Ya existen ${existingTeachers} docentes en Sistemas. Omitiendo...`);
    } else {
      await Teacher.deleteMany({ department: 'Ingeniería de Sistemas' });
      const teachersData = generateTeachers(courses);
      const teachers = await Teacher.create(teachersData);
      console.log(`👨‍🏫 ${teachers.length} docentes creados.`);

      // Assign teachers to courses (2-3 teachers per course)
      const shuffledTeachers = randomShuffle(teachers);
      for (let i = 0; i < courses.length; i++) {
        const numTeachers = randomInt(2, 3);
        const assigned = [];
        for (let j = 0; j < numTeachers; j++) {
          const tIdx = (i * 3 + j) % shuffledTeachers.length;
          assigned.push(shuffledTeachers[tIdx]._id);
        }
        courses[i].assignedTeachers = assigned;
        await courses[i].save();
      }
      console.log('🔗 Docentes vinculados a cursos.');
    }

    // ── ESTUDIANTES (150) ──
    const existingStudents = await Student.countDocuments({ career: career._id });
    if (existingStudents >= 150) {
      console.log(`🎓 Ya existen ${existingStudents} estudiantes en ISI. Omitiendo...`);
    } else {
      await Student.deleteMany({ career: career._id });
      const studentsData = generateStudents(courses, career._id);
      // Insert in batches of 25
      for (let i = 0; i < studentsData.length; i += 25) {
        await Student.create(studentsData.slice(i, i + 25));
      }
      console.log(`🎓 150 estudiantes creados.`);
    }

    // ── USUARIOS DE PRUEBA ──
    const testUsers = [
      { name: 'Coordinador ISI', email: 'coordinador.isi@uni.edu', password: 'coordinador123', role: 'coordinador', department: 'Ingeniería de Sistemas' },
      { name: 'Docente ISI', email: 'docente.isi@uni.edu', password: 'docente123', role: 'docente', department: 'Ingeniería de Sistemas' },
      { name: 'Estudiante ISI', email: 'estudiante.isi@uni.edu', password: 'estudiante123', role: 'estudiante', career: 'Ingeniería de Sistemas', semester: 5 },
    ];
    for (const u of testUsers) {
      const exists = await User.findOne({ email: u.email });
      if (!exists) {
        await User.create(u);
      }
    }
    console.log('👤 Usuarios de prueba verificados/creados.');

    console.log('\n══════════════════════════════════════');
    console.log('✅ POBLACIÓN MASIVA COMPLETADA');
    console.log('══════════════════════════════════════');
    console.log('📋 Cuentas de prueba:');
    console.log('  Coordinador: coordinador.isi@uni.edu / coordinador123');
    console.log('  Docente:     docente.isi@uni.edu / docente123');
    console.log('  Estudiante:  estudiante.isi@uni.edu / estudiante123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

poblar();
