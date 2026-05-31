/**
 * Seed Inline — Versión importable del seed para auto-carga.
 * A diferencia de seed.js, esta versión:
 * - No llama a mongoose.connect() (ya está conectado)
 * - No llama a process.exit()
 * - Exporta una función async reutilizable
 */

const User = require('../models/User');
const Course = require('../models/Course');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const Classroom = require('../models/Classroom');
const Preference = require('../models/Preference');
const Notification = require('../models/Notification');
const Career = require('../models/Career');
const InstitutionalPolicy = require('../models/InstitutionalPolicy');
const Campus = require('../models/Campus');
const Simulation = require('../models/Simulation');

async function seedInline() {
  // Clear existing data
  await Promise.all([
    User.deleteMany({}),
    Course.deleteMany({}),
    Teacher.deleteMany({}),
    Student.deleteMany({}),
    Classroom.deleteMany({}),
    Preference.deleteMany({}),
    Notification.deleteMany({}),
    Career.deleteMany({}),
    InstitutionalPolicy.deleteMany({}),
    Campus.deleteMany({}),
    Simulation.deleteMany({})
  ]);
  console.log('🗑️  Datos anteriores eliminados.');

  // ═══════════════════════════════════════════
  // USUARIOS (5 perfiles)
  // ═══════════════════════════════════════════
  const users = await User.create([
    {
      name: 'Carlos Mendoza',
      email: 'admin@uni.edu',
      password: 'admin123',
      role: 'coordinador',
      department: 'Coordinación Académica',
      phone: '999 111 222'
    },
    {
      name: 'Ana Vargas',
      email: 'ana.vargas@uni.edu',
      password: 'docente123',
      role: 'docente',
      department: 'Ingeniería de Sistemas',
      phone: '999 333 444'
    },
    {
      name: 'Luis Ramírez',
      email: 'luis.ramirez@uni.edu',
      password: 'estudiante123',
      role: 'estudiante',
      career: 'Ingeniería de Sistemas',
      semester: 6,
      phone: '999 555 666'
    },
    {
      name: 'María Torres',
      email: 'maria.torres@uni.edu',
      password: 'docente123',
      role: 'docente',
      department: 'Ciencias de la Computación',
      phone: '999 777 888'
    },
    {
      name: 'Jorge López',
      email: 'jorge.lopez@uni.edu',
      password: 'estudiante123',
      role: 'estudiante',
      career: 'Ingeniería de Sistemas',
      semester: 4,
      phone: '999 999 000'
    }
  ]);

  const [userCoord, userDocente1, userEstudiante1, userDocente2, userEstudiante2] = users;
  console.log(`👤 ${users.length} usuarios creados.`);

  // ═══════════════════════════════════════════
  // CARRERAS (4 carreras)
  // ═══════════════════════════════════════════
  const careers = await Career.create([
    { code: 'ISI', name: 'Ingeniería de Sistemas e Informática', faculty: 'Ingeniería', totalSemesters: 10, totalCredits: 220, director: 'Dr. Carlos Mendoza', description: 'Formación en desarrollo de software, redes y sistemas de información.' },
    { code: 'IC', name: 'Ingeniería Civil', faculty: 'Ingeniería', totalSemesters: 10, totalCredits: 230, director: 'Dra. Patricia Ruiz', description: 'Formación en diseño y construcción de infraestructura.' },
    { code: 'ADM', name: 'Administración de Empresas', faculty: 'Ciencias Empresariales', totalSemesters: 10, totalCredits: 200, director: 'Mg. Roberto Gutiérrez', description: 'Gestión empresarial, finanzas y marketing.' },
    { code: 'DER', name: 'Derecho', faculty: 'Ciencias Jurídicas', totalSemesters: 12, totalCredits: 260, director: 'Dr. Miguel Ángel Torres', description: 'Formación en ciencias jurídicas y práctica legal.' }
  ]);
  const [careerSistemas, careerCivil, careerAdmin, careerDerecho] = careers;
  console.log(`🎓 ${careers.length} carreras creadas.`);

  // ═══════════════════════════════════════════
  // CURSOS (10 cursos de Ing. Sistemas + 8 de otras carreras)
  // ═══════════════════════════════════════════
  const courses = await Course.create([
    // --- Ingeniería de Sistemas ---
    { code: 'ALG01', name: 'Algoritmos', credits: 4, type: 'teorico', semester: 3, sessionsPerWeek: 3, hoursPerSession: 1, mandatory: true, maxStudents: 40, career: careerSistemas._id, difficulty: 4 },
    { code: 'BD01', name: 'Base de Datos', credits: 4, type: 'teorico', semester: 4, sessionsPerWeek: 3, hoursPerSession: 1, mandatory: true, maxStudents: 40, career: careerSistemas._id, difficulty: 3 },
    { code: 'MD01', name: 'Matemáticas Discretas', credits: 3, type: 'teorico', semester: 3, sessionsPerWeek: 3, hoursPerSession: 1, mandatory: true, maxStudents: 45, career: careerSistemas._id, difficulty: 5 },
    { code: 'IS01', name: 'Ingeniería de Software', credits: 4, type: 'teorico', semester: 5, sessionsPerWeek: 2, hoursPerSession: 2, mandatory: true, maxStudents: 35, career: careerSistemas._id, difficulty: 3 },
    { code: 'PA01', name: 'Programación Avanzada', credits: 4, type: 'laboratorio', semester: 5, sessionsPerWeek: 2, hoursPerSession: 2, mandatory: true, maxStudents: 30, career: careerSistemas._id, difficulty: 4 },
    { code: 'RED01', name: 'Redes', credits: 3, type: 'laboratorio', semester: 6, sessionsPerWeek: 2, hoursPerSession: 1, mandatory: true, maxStudents: 30, career: careerSistemas._id, difficulty: 3 },
    { code: 'SO01', name: 'Sistemas Operativos', credits: 4, type: 'laboratorio', semester: 5, sessionsPerWeek: 2, hoursPerSession: 1, mandatory: true, maxStudents: 35, career: careerSistemas._id, difficulty: 4 },
    { code: 'IA01', name: 'Inteligencia Artificial', credits: 3, type: 'teorico', semester: 7, sessionsPerWeek: 2, hoursPerSession: 1, mandatory: false, maxStudents: 30, career: careerSistemas._id, difficulty: 5 },
    { code: 'SEC01', name: 'Seguridad Informática', credits: 3, type: 'teorico', semester: 7, sessionsPerWeek: 2, hoursPerSession: 1, mandatory: false, maxStudents: 30, career: careerSistemas._id, difficulty: 3 },
    { code: 'EMP01', name: 'Emprendimiento Digital', credits: 2, type: 'teorico', semester: 8, sessionsPerWeek: 1, hoursPerSession: 2, mandatory: false, maxStudents: 40, career: careerSistemas._id, difficulty: 1 },
    // --- Ingeniería Civil ---
    { code: 'EST01', name: 'Estática', credits: 4, type: 'teorico', semester: 3, sessionsPerWeek: 3, hoursPerSession: 1, mandatory: true, maxStudents: 40, career: careerCivil._id },
    { code: 'RES01', name: 'Resistencia de Materiales', credits: 4, type: 'laboratorio', semester: 4, sessionsPerWeek: 2, hoursPerSession: 2, mandatory: true, maxStudents: 35, career: careerCivil._id },
    // --- Administración ---
    { code: 'MKT01', name: 'Marketing', credits: 3, type: 'teorico', semester: 4, sessionsPerWeek: 2, hoursPerSession: 1, mandatory: true, maxStudents: 45, career: careerAdmin._id },
    { code: 'FIN01', name: 'Finanzas Corporativas', credits: 4, type: 'teorico', semester: 5, sessionsPerWeek: 3, hoursPerSession: 1, mandatory: true, maxStudents: 40, career: careerAdmin._id },
    { code: 'RRHH01', name: 'Gestión del Talento Humano', credits: 3, type: 'teorico', semester: 6, sessionsPerWeek: 2, hoursPerSession: 1, mandatory: true, maxStudents: 45, career: careerAdmin._id },
    // --- Derecho ---
    { code: 'DPC01', name: 'Derecho Procesal Civil', credits: 4, type: 'teorico', semester: 5, sessionsPerWeek: 3, hoursPerSession: 1, mandatory: true, maxStudents: 50, career: careerDerecho._id },
    { code: 'DPE01', name: 'Derecho Penal', credits: 4, type: 'teorico', semester: 4, sessionsPerWeek: 3, hoursPerSession: 1, mandatory: true, maxStudents: 50, career: careerDerecho._id },
    { code: 'DCON01', name: 'Derecho Constitucional', credits: 3, type: 'teorico', semester: 3, sessionsPerWeek: 2, hoursPerSession: 1, mandatory: true, maxStudents: 55, career: careerDerecho._id }
  ]);

  // Set prerequisites
  courses[3].prerequisites = [courses[0]._id];
  await courses[3].save();
  courses[4].prerequisites = [courses[0]._id, courses[1]._id];
  await courses[4].save();
  courses[5].prerequisites = [courses[6]._id];
  await courses[5].save();
  // Set corequisites: IS01 <-> PA01 (same semester, should be taken together)
  courses[3].corequisites = [courses[4]._id]; // IS -> PA
  courses[4].corequisites = [courses[3]._id]; // PA -> IS
  // Set corequisites: RED01 <-> SO01 (related lab courses)
  courses[5].corequisites = [courses[6]._id];

  await Promise.all([courses[3].save(), courses[4].save(), courses[5].save()]);
  console.log(`📚 ${courses.length} cursos creados (con dificultad y correquisitos).`);

  // ═══════════════════════════════════════════
  // DOCENTES (5 docentes)
  // ═══════════════════════════════════════════
  const teachers = await Teacher.create([
    {
      userId: userDocente1._id,
      name: 'Ana Vargas',
      email: 'ana.vargas@uni.edu',
      department: 'Ingeniería de Sistemas',
      specializations: [courses[0]._id, courses[3]._id, courses[7]._id],
      maxCourses: 3,
      preferredShift: 'manana',
      contractType: 'tiempo_completo',
      performanceLevel: 'alto',
      performanceScore: 92,
      availability: [
        { day: 'lunes', startTime: '07:00', endTime: '14:00' },
        { day: 'martes', startTime: '07:00', endTime: '14:00' },
        { day: 'miercoles', startTime: '07:00', endTime: '14:00' },
        { day: 'jueves', startTime: '07:00', endTime: '14:00' },
        { day: 'viernes', startTime: '07:00', endTime: '14:00' }
      ]
    },
    {
      name: 'Carlos López',
      email: 'carlos.lopez@uni.edu',
      department: 'Matemáticas',
      specializations: [courses[2]._id, courses[8]._id],
      maxCourses: 3,
      preferredShift: 'manana',
      contractType: 'tiempo_completo',
      performanceLevel: 'regular',
      performanceScore: 78,
      availability: [
        { day: 'lunes', startTime: '08:00', endTime: '13:00' },
        { day: 'martes', startTime: '08:00', endTime: '13:00' },
        { day: 'miercoles', startTime: '08:00', endTime: '13:00' },
        { day: 'jueves', startTime: '08:00', endTime: '13:00' },
        { day: 'viernes', startTime: '08:00', endTime: '13:00' }
      ]
    },
    {
      userId: userDocente2._id,
      name: 'María Torres',
      email: 'maria.torres@uni.edu',
      department: 'Base de Datos',
      specializations: [courses[1]._id, courses[4]._id],
      maxCourses: 3,
      preferredShift: 'tarde',
      contractType: 'tiempo_completo',
      performanceLevel: 'alto',
      performanceScore: 88,
      availability: [
        { day: 'lunes', startTime: '14:00', endTime: '19:00' },
        { day: 'martes', startTime: '14:00', endTime: '19:00' },
        { day: 'miercoles', startTime: '14:00', endTime: '19:00' },
        { day: 'jueves', startTime: '14:00', endTime: '19:00' },
        { day: 'viernes', startTime: '14:00', endTime: '19:00' }
      ]
    },
    {
      name: 'Jorge Ramírez',
      email: 'jorge.ramirez@uni.edu',
      department: 'Redes y Comunicaciones',
      specializations: [courses[5]._id, courses[6]._id],
      maxCourses: 3,
      preferredShift: 'tarde',
      contractType: 'por_horas',
      performanceLevel: 'regular',
      performanceScore: 72,
      availability: [
        { day: 'lunes', startTime: '14:00', endTime: '22:00' },
        { day: 'martes', startTime: '14:00', endTime: '22:00' },
        { day: 'miercoles', startTime: '14:00', endTime: '22:00' },
        { day: 'jueves', startTime: '14:00', endTime: '22:00' },
        { day: 'viernes', startTime: '14:00', endTime: '22:00' }
      ]
    },
    {
      name: 'Lucía Mendoza',
      email: 'lucia.mendoza@uni.edu',
      department: 'Emprendimiento',
      specializations: [courses[9]._id, courses[8]._id],
      maxCourses: 2,
      preferredShift: 'noche',
      contractType: 'por_horas',
      performanceLevel: 'bajo',
      performanceScore: 60,
      availability: [
        { day: 'lunes', startTime: '17:00', endTime: '22:00' },
        { day: 'miercoles', startTime: '17:00', endTime: '22:00' },
        { day: 'viernes', startTime: '17:00', endTime: '22:00' }
      ]
    }
  ]);
  console.log(`👨‍🏫 ${teachers.length} docentes creados.`);

  // ── Vincular docentes a cursos (assignedTeachers) ──
  // Ana Vargas -> Algoritmos, Ing. Software, IA
  courses[0].assignedTeachers = [teachers[0]._id];
  courses[3].assignedTeachers = [teachers[0]._id];
  courses[7].assignedTeachers = [teachers[0]._id];
  // Carlos López -> Mat. Discretas, Seguridad
  courses[2].assignedTeachers = [teachers[1]._id];
  courses[8].assignedTeachers = [teachers[1]._id, teachers[4]._id];
  // María Torres -> Base de Datos, Prog. Avanzada
  courses[1].assignedTeachers = [teachers[2]._id];
  courses[4].assignedTeachers = [teachers[2]._id];
  // Jorge Ramírez -> Redes, Sistemas Operativos
  courses[5].assignedTeachers = [teachers[3]._id];
  courses[6].assignedTeachers = [teachers[3]._id];
  // Lucía Mendoza -> Emprendimiento Digital
  courses[9].assignedTeachers = [teachers[4]._id];
  await Promise.all(courses.filter(c => c.isModified?.('assignedTeachers') || c.assignedTeachers?.length).map(c => c.save()));
  console.log('🔗 Vinculación tripartita (assignedTeachers) aplicada.');

  // ═══════════════════════════════════════════
  // POLÍTICA INSTITUCIONAL
  // ═══════════════════════════════════════════
  await InstitutionalPolicy.create({
    name: 'Política Institucional 2026-1',
    semester: '2026-1',
    active: true,
    allowedSchedule: {
      startTime: '07:00',
      endTime: '22:00',
      activeDays: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'],
      blockedTimeSlots: [
        { start: '13:00', end: '14:00', reason: 'Horario de almuerzo' }
      ]
    },
    shifts: {
      manana: { start: '07:00', end: '13:00' },
      tarde: { start: '14:00', end: '19:00' },
      noche: { start: '19:00', end: '22:00' }
    },
    teacherLimits: {
      maxWeeklyHoursFullTime: 40,
      maxWeeklyHoursPartTime: 20,
      maxCoursesFullTime: 4,
      maxCoursesPartTime: 2,
      minBreakBetweenClasses: 0,
      maxContinuousHours: 4
    },
    partTimePreferences: {
      allowedShifts: ['manana', 'tarde'],
      allowMultiShift: false,
      allowedCourseTypes: ['teorico', 'laboratorio'],
      prioritizeAfterFullTime: true,
      maxDaysPerWeek: 5
    },
    classroomRules: {
      maxCapacityUsagePercent: 100,
      strictTypeMatch: true,
      allowVirtualClassrooms: true
    },
    courseDistribution: {
      preferNonConsecutiveDays: true,
      maxSessionsPerCoursePerDay: 1
    },
    enrollmentRules: {
      minCreditsPerSemester: 12,
      maxCreditsPerSemester: 25,
      minStudentsPerSection: 15
    },
    priorityWeights: {
      institutional: 0.30,
      validity: 0.25,
      preferences: 0.25,
      optimization: 0.20
    }
  });
  console.log('📜 Política institucional creada (con almuerzo bloqueado 13:00-14:00).');

  // ═══════════════════════════════════════════
  // AULAS (8 aulas)
  // ═══════════════════════════════════════════
  const classrooms = await Classroom.create([
    { code: 'A101', name: 'Aula A101', capacity: 40, type: 'teorico', building: 'Pabellón A', floor: 1 },
    { code: 'A202', name: 'Aula A202', capacity: 45, type: 'teorico', building: 'Pabellón A', floor: 2 },
    { code: 'B103', name: 'Aula B103', capacity: 35, type: 'teorico', building: 'Pabellón B', floor: 1 },
    { code: 'B204', name: 'Aula B204', capacity: 50, type: 'teorico', building: 'Pabellón B', floor: 2 },
    { code: 'C201', name: 'Aula C201', capacity: 30, type: 'teorico', building: 'Pabellón C', floor: 2 },
    { code: 'C301', name: 'Aula C301', capacity: 35, type: 'teorico', building: 'Pabellón C', floor: 3 },
    { code: 'LAB1', name: 'Laboratorio 1', capacity: 30, type: 'laboratorio', building: 'Lab Building', floor: 1, equipment: ['computadoras', 'proyector'] },
    { code: 'LAB2', name: 'Laboratorio 2', capacity: 25, type: 'laboratorio', building: 'Lab Building', floor: 1, equipment: ['computadoras', 'proyector', 'servidores'] }
  ]);
  console.log(`🏠 ${classrooms.length} aulas creadas.`);

  // ═══════════════════════════════════════════
  // CAMPUS / SEDES
  // ═══════════════════════════════════════════
  const campuses = await Campus.create([
    {
      code: 'HYO',
      name: 'Campus Huancayo',
      address: 'Av. San Carlos 1980, Huancayo',
      city: 'Huancayo',
      operatingHours: { startTime: '07:00', endTime: '22:00' },
      buildings: [
        { code: 'PA', name: 'Pabellón A', floors: 3 },
        { code: 'PB', name: 'Pabellón B', floors: 3 },
        { code: 'PC', name: 'Pabellón C', floors: 4 },
        { code: 'LAB', name: 'Edificio de Laboratorios', floors: 2 }
      ]
    },
    {
      code: 'LIM',
      name: 'Campus Lima',
      address: 'Calle Los Alamos 456, Lima',
      city: 'Lima',
      operatingHours: { startTime: '08:00', endTime: '22:00' },
      buildings: [
        { code: 'T1', name: 'Torre 1', floors: 6 },
        { code: 'T2', name: 'Torre 2', floors: 4 }
      ],
      travelTimes: [{ toCampusId: 'HYO', minutes: 360 }]
    }
  ]);
  console.log(`🌍 ${campuses.length} campus creados.`);

  // ═══════════════════════════════════════════
  // ESTUDIANTES (15 estudiantes)
  // ═══════════════════════════════════════════
  const studentNames = [
    { name: 'Luis Ramírez', code: 'EST001', userId: userEstudiante1._id, sem: 6, shift: 'manana', works: false },
    { name: 'Jorge López', code: 'EST002', userId: userEstudiante2._id, sem: 4, shift: 'tarde', works: true },
    { name: 'Sofía Paredes', code: 'EST003', sem: 5, shift: 'manana', works: false },
    { name: 'Diego Huamán', code: 'EST004', sem: 3, shift: 'manana', works: false },
    { name: 'Valeria Quispe', code: 'EST005', sem: 6, shift: 'tarde', works: true },
    { name: 'Andrés Flores', code: 'EST006', sem: 4, shift: 'manana', works: false },
    { name: 'Camila Rojas', code: 'EST007', sem: 5, shift: 'manana', works: false },
    { name: 'Fernando Castillo', code: 'EST008', sem: 7, shift: 'noche', works: true },
    { name: 'Isabella Moreno', code: 'EST009', sem: 3, shift: 'manana', works: false },
    { name: 'Mateo Sánchez', code: 'EST010', sem: 6, shift: 'tarde', works: false },
    { name: 'Daniela Herrera', code: 'EST011', sem: 5, shift: 'manana', works: false },
    { name: 'Sebastián Núñez', code: 'EST012', sem: 4, shift: 'manana', works: false },
    { name: 'Valentina Cruz', code: 'EST013', sem: 7, shift: 'tarde', works: true },
    { name: 'Nicolás Peña', code: 'EST014', sem: 3, shift: 'manana', works: false },
    { name: 'Luciana Vargas', code: 'EST015', sem: 8, shift: 'noche', works: true }
  ];

  const students = await Student.create(studentNames.map(s => ({
    userId: s.userId,
    name: s.name,
    email: `${s.name.toLowerCase().replace(/\s/g, '.').replace(/[áéíóú]/g, c => ({ á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u' })[c])}@uni.edu`,
    studentCode: s.code,
    currentSemester: s.sem,
    preferredShift: s.shift,
    worksWhileStudying: s.works,
    career: careerSistemas._id,
    approvedCourses: s.sem > 3
      ? [{ courseId: courses[0]._id, grade: 14 + Math.floor(Math.random() * 6) }]
      : [],
    totalCreditsApproved: s.sem > 3 ? (s.sem - 1) * 18 : 0
  })));
  console.log(`🎓 ${students.length} estudiantes creados.`);

  // ═══════════════════════════════════════════
  // PREFERENCIAS
  // ═══════════════════════════════════════════
  await Preference.create([
    {
      userId: userCoord._id,
      role: 'coordinador',
      availability: {
        manana: { lun: true, mar: true, mie: true, jue: true, vie: true },
        tarde: { lun: true, mar: true, mie: true, jue: true, vie: true },
        noche: { lun: false, mar: false, mie: false, jue: false, vie: false }
      },
      additionalPreferences: { avoidBefore8am: false, avoidGaps: true, preferFewerDays: false, groupSameSubjectConsecutive: false },
      priorityOrder: ['conflicts', 'institutional', 'gaps', 'personal'],
      preferredShift: 'indiferente'
    },
    {
      userId: userDocente1._id,
      role: 'docente',
      availability: {
        manana: { lun: true, mar: true, mie: true, jue: true, vie: true },
        tarde: { lun: true, mar: true, mie: false, jue: false, vie: true },
        noche: { lun: false, mar: false, mie: false, jue: false, vie: false }
      },
      additionalPreferences: { avoidBefore8am: true, avoidGaps: true, preferFewerDays: true, groupSameSubjectConsecutive: false },
      priorityOrder: ['conflicts', 'institutional', 'gaps', 'personal'],
      preferredShift: 'manana'
    },
    {
      userId: userEstudiante1._id,
      role: 'estudiante',
      availability: {
        manana: { lun: true, mar: true, mie: true, jue: true, vie: true, sab: false, dom: false },
        tarde: { lun: true, mar: true, mie: true, jue: true, vie: true, sab: false, dom: false },
        noche: { lun: false, mar: false, mie: false, jue: false, vie: false, sab: false, dom: false }
      },
      additionalPreferences: { avoidBefore8am: true, avoidGaps: true, preferFewerDays: true, groupSameSubjectConsecutive: false },
      priorityOrder: ['conflicts', 'institutional', 'gaps', 'personal'],
      preferredShift: 'manana',
      worksWhileStudying: false
    },
    {
      userId: userDocente2._id,
      role: 'docente',
      availability: {
        manana: { lun: false, mar: false, mie: false, jue: false, vie: false },
        tarde: { lun: true, mar: true, mie: true, jue: true, vie: true },
        noche: { lun: true, mar: true, mie: true, jue: true, vie: true }
      },
      additionalPreferences: { avoidBefore8am: true, avoidGaps: false, preferFewerDays: false, groupSameSubjectConsecutive: true },
      priorityOrder: ['institutional', 'conflicts', 'personal', 'gaps'],
      preferredShift: 'tarde'
    },
    {
      userId: userEstudiante2._id,
      role: 'estudiante',
      availability: {
        manana: { lun: false, mar: false, mie: false, jue: false, vie: false },
        tarde: { lun: true, mar: true, mie: true, jue: true, vie: true },
        noche: { lun: true, mar: true, mie: true, jue: true, vie: true }
      },
      additionalPreferences: { avoidBefore8am: true, avoidGaps: true, preferFewerDays: true, groupSameSubjectConsecutive: false },
      priorityOrder: ['conflicts', 'gaps', 'institutional', 'personal'],
      preferredShift: 'tarde',
      worksWhileStudying: true
    }
  ]);
  console.log('⚙️  Preferencias creadas para los 5 usuarios.');

  // ═══════════════════════════════════════════
  // NOTIFICACIONES
  // ═══════════════════════════════════════════
  await Notification.create([
    {
      userId: userEstudiante1._id,
      title: 'Horario generado',
      message: 'Tu horario "Horario óptimo" ha sido generado correctamente.',
      type: 'horario',
      category: 'info',
      read: false
    },
    {
      userId: userEstudiante1._id,
      title: 'Cupo disponible',
      message: 'Hay cupo disponible en "Inteligencia Artificial" sección B4077.',
      type: 'cupo',
      category: 'aviso',
      read: false
    },
    {
      userId: userEstudiante1._id,
      title: 'Recordatorio',
      message: 'Tienes hasta el 20/05/2025 de matrícula habilitada hasta el período 2025-2.',
      type: 'sistema',
      category: 'info',
      read: true
    },
    {
      userId: userEstudiante1._id,
      title: 'Conflictos detectados',
      message: 'No fue posible generar un horario que cumpla todas tus preferencias.',
      type: 'conflicto',
      category: 'alerta',
      read: false
    },
    {
      userId: userEstudiante1._id,
      title: 'Actualización de restricciones',
      message: 'Se han actualizado las restricciones institucionales para el período 2025-2.',
      type: 'restriccion',
      category: 'aviso',
      read: true
    },
    {
      userId: userDocente1._id,
      title: 'Horario actualizado',
      message: 'Se ha actualizado tu horario de clases para el semestre 2025-2.',
      type: 'horario',
      category: 'info',
      read: false
    },
    {
      userId: userCoord._id,
      title: 'Generación completada',
      message: 'La generación de horarios para el semestre 2025-2 se completó exitosamente. Puntaje: 92/100',
      type: 'horario',
      category: 'info',
      read: false
    }
  ]);
  console.log('🔔 Notificaciones de ejemplo creadas.');

  console.log('');
  console.log('📋 Cuentas de acceso:');
  console.log('  Coordinador: admin@uni.edu / admin123');
  console.log('  Docente:     ana.vargas@uni.edu / docente123');
  console.log('  Docente:     maria.torres@uni.edu / docente123');
  console.log('  Estudiante:  luis.ramirez@uni.edu / estudiante123');
  console.log('  Estudiante:  jorge.lopez@uni.edu / estudiante123');
}

module.exports = seedInline;
