/**
 * Vincular estudiantes existentes con cuentas de usuario para login.
 * Ejecutar: node seed/vincular_estudiantes.js
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');
const Student = require('../models/Student');
const Career = require('../models/Career');

async function main() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/unischeduler');
  console.log('📦 Conectado a MongoDB');

  const career = await Career.findOne({ code: 'ISI' });
  if (!career) { console.error('❌ Carrera ISI no encontrada'); process.exit(1); }

  // Obtener 2 estudiantes: uno de semestre bajo y otro de semestre medio
  const students = await Student.find({ career: career._id, userId: { $exists: false } })
    .sort({ currentSemester: 1 }).limit(2);

  if (students.length === 0) {
    console.log('⚠️  No hay estudiantes sin vincular. Verificando estado actual...');
  }

  for (const s of students) {
    const email = s.email || `student.${s.studentCode.toLowerCase()}@uni.edu`;
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name: s.name,
        email,
        password: 'estudiante123',
        role: 'estudiante',
        career: 'Ingeniería de Sistemas',
        semester: s.currentSemester
      });
      console.log(`✅ Usuario creado: ${email} / estudiante123`);
    } else {
      console.log(`👤 Usuario ya existe: ${email}`);
    }

    s.userId = user._id;
    await s.save();
    console.log(`🔗 Estudiante "${s.name}" (${s.studentCode}) vinculado a usuario`);
  }

  // Resumen
  const total = await Student.countDocuments({ career: career._id });
  const vinculados = await Student.countDocuments({ career: career._id, userId: { $exists: true, $ne: null } });
  const totalUsers = await User.countDocuments({ role: 'estudiante' });
  console.log('\n══════════════════════════════════════');
  console.log(`📊 Resumen:`);
  console.log(`   Estudiantes ISI: ${total}`);
  console.log(`   Con login:       ${vinculados}`);
  console.log(`   Users estudiante: ${totalUsers}`);
  console.log('══════════════════════════════════════');
  console.log('\n📋 Cuentas estudiantes disponibles:');
  const users = await User.find({ role: 'estudiante' }).lean();
  for (const u of users) {
    console.log(`   ${u.email} / estudiante123  (${u.name})`);
  }

  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
