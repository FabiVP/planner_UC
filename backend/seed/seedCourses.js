/**
 * Crea 60 cursos (6×10 semestres) y 35 docentes para ISI.
 * Cursos generales (sin carrera) en semestres 1-2 y algunos en 3.
 * El resto son cursos específicos de carrera ISI.
 * Ejecutar: node seed/seedCourses.js
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const Course = require('../models/Course');
const Teacher = require('../models/Teacher');
const Career = require('../models/Career');

// ─── Currícula: 6 cursos por semestre ───
// type: 'G' = general (sin carrera), 'I' = ISI-specific
const CURRICULUM = [
  // Semestre 1 — 3 generales + 3 ISI
  [
    { code: 'MAT101', name: 'Matemáticas I', credits: 4, type: 'teorico', difficulty: 3, kind: 'G' },
    { code: 'FIS101', name: 'Física I', credits: 4, type: 'teorico', difficulty: 3, kind: 'G' },
    { code: 'LEN101', name: 'Comunicación y Lenguaje', credits: 3, type: 'teorico', difficulty: 2, kind: 'G' },
    { code: 'INF101', name: 'Introducción a la Informática', credits: 3, type: 'teorico', difficulty: 2, kind: 'I' },
    { code: 'LOG101', name: 'Lógica y Programación', credits: 4, type: 'laboratorio', difficulty: 3, kind: 'I' },
    { code: 'MET101', name: 'Metodología del Estudio', credits: 2, type: 'teorico', difficulty: 1, kind: 'G' },
  ],
  // Semestre 2 — 3 generales + 3 ISI
  [
    { code: 'MAT201', name: 'Matemáticas II', credits: 4, type: 'teorico', difficulty: 4, kind: 'G' },
    { code: 'FIS201', name: 'Física II', credits: 4, type: 'teorico', difficulty: 4, kind: 'G' },
    { code: 'EST201', name: 'Estadística General', credits: 3, type: 'teorico', difficulty: 3, kind: 'G' },
    { code: 'PRO201', name: 'Programación I', credits: 4, type: 'laboratorio', difficulty: 4, kind: 'I' },
    { code: 'MAT202', name: 'Matemática Discreta', credits: 3, type: 'teorico', difficulty: 4, kind: 'I' },
    { code: 'ING201', name: 'Inglés Técnico', credits: 2, type: 'teorico', difficulty: 2, kind: 'G' },
  ],
  // Semestre 3 — 2 generales + 4 ISI
  [
    { code: 'MAT301', name: 'Matemáticas III', credits: 4, type: 'teorico', difficulty: 4, kind: 'G' },
    { code: 'CON301', name: 'Contabilidad General', credits: 3, type: 'teorico', difficulty: 2, kind: 'G' },
    { code: 'ALG301', name: 'Algoritmos', credits: 4, type: 'teorico', difficulty: 4, kind: 'I' },
    { code: 'PRO301', name: 'Programación II', credits: 4, type: 'laboratorio', difficulty: 4, kind: 'I' },
    { code: 'ESD301', name: 'Estructura de Datos', credits: 4, type: 'teorico', difficulty: 4, kind: 'I' },
    { code: 'ARQ301', name: 'Arquitectura de Computadoras', credits: 3, type: 'teorico', difficulty: 3, kind: 'I' },
  ],
  // Semestre 4 — todos ISI
  [
    { code: 'BD401', name: 'Base de Datos', credits: 4, type: 'teorico', difficulty: 4, kind: 'I' },
    { code: 'PRO401', name: 'Programación III', credits: 4, type: 'laboratorio', difficulty: 5, kind: 'I' },
    { code: 'ING401', name: 'Ingeniería de Requisitos', credits: 3, type: 'teorico', difficulty: 3, kind: 'I' },
    { code: 'SO401', name: 'Sistemas Operativos', credits: 4, type: 'laboratorio', difficulty: 4, kind: 'I' },
    { code: 'RED401', name: 'Redes I', credits: 3, type: 'laboratorio', difficulty: 4, kind: 'I' },
    { code: 'MET401', name: 'Metodologías Ágiles', credits: 3, type: 'teorico', difficulty: 3, kind: 'I' },
  ],
  // Semestre 5 — todos ISI
  [
    { code: 'IS501', name: 'Ingeniería de Software', credits: 4, type: 'teorico', difficulty: 4, kind: 'I' },
    { code: 'BD502', name: 'Base de Datos Avanzada', credits: 4, type: 'laboratorio', difficulty: 5, kind: 'I' },
    { code: 'RED501', name: 'Redes II', credits: 3, type: 'laboratorio', difficulty: 4, kind: 'I' },
    { code: 'PRO501', name: 'Programación Web', credits: 4, type: 'laboratorio', difficulty: 4, kind: 'I' },
    { code: 'CAL501', name: 'Calidad de Software', credits: 3, type: 'teorico', difficulty: 3, kind: 'I' },
    { code: 'GES501', name: 'Gestión de Proyectos TI', credits: 3, type: 'teorico', difficulty: 3, kind: 'I' },
  ],
  // Semestre 6 — todos ISI
  [
    { code: 'DS601', name: 'Desarrollo de Software', credits: 4, type: 'laboratorio', difficulty: 5, kind: 'I' },
    { code: 'PRO601', name: 'Programación Móvil', credits: 4, type: 'laboratorio', difficulty: 4, kind: 'I' },
    { code: 'SEG601', name: 'Seguridad Informática', credits: 3, type: 'teorico', difficulty: 4, kind: 'I' },
    { code: 'AUD601', name: 'Auditoría de Sistemas', credits: 3, type: 'teorico', difficulty: 3, kind: 'I' },
    { code: 'GES602', name: 'Gestión de TI', credits: 3, type: 'teorico', difficulty: 3, kind: 'I' },
    { code: 'SIM601', name: 'Simulación de Sistemas', credits: 3, type: 'laboratorio', difficulty: 4, kind: 'I' },
  ],
  // Semestre 7 — todos ISI
  [
    { code: 'IA701', name: 'Inteligencia Artificial', credits: 4, type: 'teorico', difficulty: 5, kind: 'I' },
    { code: 'DS702', name: 'Data Science', credits: 4, type: 'laboratorio', difficulty: 5, kind: 'I' },
    { code: 'ARQ701', name: 'Arquitectura Empresarial', credits: 3, type: 'teorico', difficulty: 4, kind: 'I' },
    { code: 'INV701', name: 'Investigación en Sistemas', credits: 3, type: 'teorico', difficulty: 3, kind: 'I' },
    { code: 'ETI701', name: 'Ética Profesional', credits: 2, type: 'teorico', difficulty: 2, kind: 'G' },
    { code: 'TAL701', name: 'Taller de Proyectos I', credits: 3, type: 'laboratorio', difficulty: 4, kind: 'I' },
  ],
  // Semestre 8 — todos ISI
  [
    { code: 'APR801', name: 'Aprendizaje Automático', credits: 4, type: 'laboratorio', difficulty: 5, kind: 'I' },
    { code: 'BIG801', name: 'Big Data', credits: 4, type: 'laboratorio', difficulty: 5, kind: 'I' },
    { code: 'CLO801', name: 'Cloud Computing', credits: 3, type: 'teorico', difficulty: 4, kind: 'I' },
    { code: 'TAL801', name: 'Taller de Proyectos II', credits: 3, type: 'laboratorio', difficulty: 4, kind: 'I' },
    { code: 'EMP801', name: 'Emprendimiento Digital', credits: 3, type: 'teorico', difficulty: 3, kind: 'I' },
    { code: 'FOR801', name: 'Formulación de Proyectos', credits: 3, type: 'teorico', difficulty: 3, kind: 'I' },
  ],
  // Semestre 9 — todos ISI
  [
    { code: 'BLO901', name: 'Blockchain', credits: 3, type: 'teorico', difficulty: 5, kind: 'I' },
    { code: 'IOT901', name: 'Internet de las Cosas', credits: 4, type: 'laboratorio', difficulty: 5, kind: 'I' },
    { code: 'GES901', name: 'Gestión de la Innovación', credits: 3, type: 'teorico', difficulty: 3, kind: 'I' },
    { code: 'TAL901', name: 'Taller de Proyectos III', credits: 3, type: 'laboratorio', difficulty: 4, kind: 'I' },
    { code: 'GER901', name: 'Gerencia Estratégica', credits: 3, type: 'teorico', difficulty: 3, kind: 'I' },
    { code: 'DER901', name: 'Derecho Informático', credits: 2, type: 'teorico', difficulty: 2, kind: 'I' },
  ],
  // Semestre 10 — todos ISI
  [
    { code: 'TES1001', name: 'Tesis / Trabajo de Suficiencia', credits: 6, type: 'teorico', difficulty: 5, kind: 'I' },
    { code: 'PRA1001', name: 'Prácticas Pre-Profesionales', credits: 4, type: 'teorico', difficulty: 3, kind: 'I' },
    { code: 'LID1001', name: 'Liderazgo y Gestión de Equipos', credits: 2, type: 'teorico', difficulty: 2, kind: 'G' },
    { code: 'SEM1001', name: 'Seminario de Actualización', credits: 2, type: 'teorico', difficulty: 2, kind: 'I' },
    { code: 'ETI1001', name: 'Responsabilidad Social', credits: 2, type: 'teorico', difficulty: 2, kind: 'G' },
    { code: 'TAL1001', name: 'Taller de Integración', credits: 3, type: 'laboratorio', difficulty: 3, kind: 'I' },
  ],
];

// ─── 35 docentes para cursos ISI ───
const TEACHER_NAMES = [
  'Ana Vargas', 'Carlos López', 'María Torres', 'Jorge Ramírez', 'Lucía Mendoza',
  'Pedro Sánchez', 'Rosa Flores', 'Miguel Ángel Ruiz', 'Carmen Delgado', 'José Castillo',
  'Patricia Vega', 'Fernando Campos', 'Silvia Peña', 'Ricardo Aguilar', 'Gabriela Soto',
  'Alberto Carrillo', 'Marina Espinoza', 'Hugo Guerrero', 'Natalia Chávez', 'Raúl Huamán',
  'Diana Quispe', 'Oscar Mamani', 'Lucía Condori', 'Víctor Salazar', 'Angélica Huerta',
  'Edwin Valencia', 'Mónica Cárdenas', 'Iván Ortiz', 'Ángel Marín', 'Ruth Ríos',
  'David Vargas', 'Verónica Herrera', 'Christian Paredes', 'Mariana Rojas', 'Alejandro Castro',
];

const DEPARTMENTS = [
  'Ingeniería de Sistemas', 'Ciencias de la Computación', 'Informática', 'Redes y Comunicaciones',
  'Base de Datos', 'Ingeniería de Software', 'Inteligencia Artificial', 'Sistemas de Información',
  'Desarrollo Web y Móvil', 'Investigación y Proyectos', 'Empresarial',
];

const SHIFTS = ['manana', 'tarde', 'noche'];

async function seedCourses() {
  try {
    const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/unischeduler';
    await mongoose.connect(dbUri);
    console.log('📦 Conectado a MongoDB:', dbUri);

    const career = await Career.findOne({ code: 'ISI' });
    if (!career) {
      console.error('❌ No se encontró la carrera ISI. Ejecuta primero: npm run seed');
      process.exit(1);
    }
    console.log(`✅ Carrera encontrada: ${career.name} (${career._id})`);

    // ─── Eliminar todos los cursos de la carrera (viejos del seed + previos) ───
    const deletedCourses = await Course.deleteMany({ career: career._id });
    console.log(`🗑️  Cursos eliminados: ${deletedCourses.deletedCount}`);

    // Keep seed teachers (Matemáticas) and delete the rest
    await Teacher.deleteMany({ name: { $nin: ['Carlos López'] } });
    console.log(`🗑️  Docentes previos eliminados (excepto Matemáticas)`);

    // ─── Crear cursos ───
    const allCourseDocs = [];
    for (const [semIdx, courses] of CURRICULUM.entries()) {
      const sem = semIdx + 1;
      for (const c of courses) {
        allCourseDocs.push({
          code: c.code,
          name: c.name,
          credits: c.credits,
          type: c.type,
          semester: sem,
          career: career._id,
          sessionsPerWeek: c.type === 'laboratorio' ? 2 : 3,
          hoursPerSession: 1,
          difficulty: c.difficulty,
          mandatory: true,
          maxStudents: c.type === 'laboratorio' ? 25 : 40,
        });
      }
    }

    const createdCourses = await Course.insertMany(allCourseDocs);
    console.log(`✅ ${createdCourses.length} cursos creados (${createdCourses.filter(c => c.career).length} ISI + ${createdCourses.filter(c => !c.career).length} generales)`);

    const coursesByCode = {};
    for (const course of createdCourses) {
      coursesByCode[course.code] = course;
    }

    // ─── Crear 35 docentes ───
    const teacherDocs = TEACHER_NAMES.map((name, idx) => ({
      name,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@uni.edu`,
      department: DEPARTMENTS[idx % DEPARTMENTS.length],
      contractType: idx % 5 === 0 ? 'por_horas' : 'tiempo_completo',
      preferredShift: SHIFTS[idx % SHIFTS.length],
      performanceScore: 70 + Math.floor(Math.random() * 25),
      maxCourses: idx % 5 === 0 ? 2 : 4,
      maxWeeklyHours: idx % 5 === 0 ? 20 : 40,
      active: true,
    }));

    const createdTeachers = await Teacher.insertMany(teacherDocs);
    console.log(`✅ ${createdTeachers.length} docentes ISI creados`);

    // ─── Aulas adicionales para cubrir los 60 cursos ───
    const Classroom = require('../models/Classroom');
    const existingClassrooms = await Classroom.countDocuments();
    if (existingClassrooms < 30) {
      const classroomData = [];
      const buildings = ['Pabellón A', 'Pabellón B', 'Pabellón C', 'Pabellón D', 'Laboratorios'];
      let idx = 0;
      // 20 aulas teóricas (capacidades variadas)
      for (let i = 0; i < 20; i++) {
        const b = buildings[i % buildings.length];
        const floor = Math.floor(i / 4) + 1;
        const cap = [30, 35, 40, 45, 50][i % 5];
        classroomData.push({
          code: `T${String(floor).padStart(2, '0')}${String(i + 1).padStart(2, '0')}`,
          name: `Aula Teórica ${b} - Piso ${floor}`,
          capacity: cap,
          type: 'teorico',
          building: b,
          floor,
          available: true,
        });
        idx++;
      }
      // 10 laboratorios (capacidad 25-30)
      for (let i = 0; i < 10; i++) {
        const floor = Math.floor(i / 3) + 1;
        classroomData.push({
          code: `LAB${String(i + 3).padStart(2, '0')}`,
          name: `Laboratorio ${i + 3} - Piso ${floor}`,
          capacity: 40,
          type: 'laboratorio',
          building: 'Laboratorios',
          floor,
          available: true,
          equipment: ['computadoras', 'proyector'],
        });
      }
      await Classroom.insertMany(classroomData);
      console.log(`✅ ${classroomData.length} aulas adicionales creadas (20 teóricas + 10 laboratorios)`);
    } else {
      console.log(`⏭️  Ya existen ${existingClassrooms} aulas, se omitió creación.`);
    }

    const updates = [];

    // ─── Docentes para cursos generales ───
    const generalTeacherData = [
      { name: 'Roberto Gutiérrez', department: 'Matemáticas', shift: 'manana', courses: ['MAT101', 'MAT201', 'MAT301'] },
      { name: 'Elena Castillo', department: 'Física', shift: 'manana', courses: ['FIS101', 'FIS201'] },
      { name: 'Liliana Paredes', department: 'Lenguaje y Comunicación', shift: 'tarde', courses: ['LEN101'] },
      { name: 'Ricardo Mendoza', department: 'Metodología', shift: 'tarde', courses: ['MET101'] },
      { name: 'Patricia Rojas', department: 'Estadística', shift: 'manana', courses: ['EST201'] },
      { name: 'Michael Smith', department: 'Idiomas', shift: 'tarde', courses: ['ING201'] },
      { name: 'Humberto Delgado', department: 'Contabilidad', shift: 'noche', courses: ['CON301'] },
      { name: 'Teresa Álvarez', department: 'Humanidades', shift: 'noche', courses: ['ETI701', 'ETI1001'] },
      { name: 'Santiago Peña', department: 'Gestión Empresarial', shift: 'noche', courses: ['LID1001'] },
    ];

    const generalTeachers = [];
    for (const gt of generalTeacherData) {
      const courseIds = gt.courses.map(code => coursesByCode[code]?._id).filter(Boolean);
      const teacher = await Teacher.create({
        name: gt.name,
        email: `${gt.name.toLowerCase().replace(/\s+/g, '.')}@uni.edu`,
        department: gt.department,
        contractType: 'tiempo_completo',
        preferredShift: gt.shift,
        specializations: courseIds,
        maxCourses: 4,
      });
      generalTeachers.push(teacher);
      // Assign teacher to each general course
      for (const courseId of courseIds) {
        if (coursesByCode[gt.courses[courseIds.indexOf(courseId)]]) {
          const course = coursesByCode[gt.courses[courseIds.indexOf(courseId)]];
          if (!course.assignedTeachers) course.assignedTeachers = [];
          course.assignedTeachers.push(teacher._id);
          updates.push(course.save());
        }
      }
    }
    console.log(`✅ ${generalTeachers.length} docentes de cursos generales creados`);

    // ─── Asignar especializaciones con coherencia por materia ───
    const isiCourses = createdCourses.filter(c => c.career);

    // Mapeo de cursos a índices de docentes según su especialidad
    const departmentMap = [
      { dept: 'Ingeniería de Sistemas', keywords: ['Introducción', 'Lógica', 'Metodologías', 'Taller', 'Integración'] },
      { dept: 'Ciencias de la Computación', keywords: ['Programación', 'Algoritmos', 'Estructura', 'Arquitectura'] },
      { dept: 'Base de Datos', keywords: ['Base de Datos', 'Big Data', 'Data Science'] },
      { dept: 'Redes y Comunicaciones', keywords: ['Redes', 'Seguridad', 'Cloud', 'IoT'] },
      { dept: 'Ingeniería de Software', keywords: ['Ingeniería de Software', 'Calidad', 'Requisitos'] },
      { dept: 'Inteligencia Artificial', keywords: ['Inteligencia', 'Aprendizaje', 'Blockchain'] },
      { dept: 'Sistemas de Información', keywords: ['Sistemas Operativos', 'Simulación', 'Auditoría', 'Gestión', 'Derecho', 'Ética'] },
      { dept: 'Desarrollo Web y Móvil', keywords: ['Web', 'Móvil', 'Desarrollo de Software'] },
      { dept: 'Investigación y Proyectos', keywords: ['Investigación', 'Formulación', 'Prácticas', 'Tesis', 'Seminario', 'Taller de Proyectos'] },
      { dept: 'Empresarial', keywords: ['Emprendimiento', 'Gerencia', 'Liderazgo', 'Responsabilidad'] },
    ];

    // Find teacher index by department name
    const findTeacherByDept = (dept) => {
      const idx = createdTeachers.findIndex(t => t.department === dept);
      return idx >= 0 ? idx : 0;
    };

    const deptToTeacherIdx = {};
    for (const entry of departmentMap) {
      deptToTeacherIdx[entry.dept] = findTeacherByDept(entry.dept);
    }

    for (const course of isiCourses) {
      if (course.assignedTeachers?.length > 0) continue; // ya tiene docente (general)
      let assigned = false;
      for (const entry of departmentMap) {
        if (entry.keywords.some(kw => course.name.includes(kw))) {
          const tIdx = deptToTeacherIdx[entry.dept];
          const teacher = createdTeachers[tIdx];
          if (!teacher.specializations) teacher.specializations = [];
          teacher.specializations.push(course._id);
          if (!course.assignedTeachers) course.assignedTeachers = [];
          course.assignedTeachers.push(teacher._id);
          updates.push(course.save());
          assigned = true;
          break;
        }
      }
      if (!assigned) {
        // Fallback: round-robin across all teachers
        const teacher = createdTeachers[isiCourses.indexOf(course) % createdTeachers.length];
        if (!teacher.specializations) teacher.specializations = [];
        teacher.specializations.push(course._id);
        if (!course.assignedTeachers) course.assignedTeachers = [];
        course.assignedTeachers.push(teacher._id);
        updates.push(course.save());
      }
    }

    // Save all teacher specializations
    for (const teacher of createdTeachers) {
      if (teacher.specializations?.length) {
        updates.push(teacher.save());
      }
    }

    await Promise.all(updates);
    const linkedCount = createdCourses.filter(c => c.assignedTeachers?.length > 0).length;
    console.log(`🔗 ${linkedCount} cursos vinculados a ${createdTeachers.length} docentes (asignación por especialidad)`);

    // ─── Resumen ───
    for (let sem = 1; sem <= 10; sem++) {
      const semCourses = createdCourses.filter(c => c.semester === sem);
      console.log(`   Semestre ${sem}: ${semCourses.length} cursos`);
    }

    await mongoose.disconnect();
    console.log('👋 Desconectado');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

seedCourses();
