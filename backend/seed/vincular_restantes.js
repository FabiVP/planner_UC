const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');
const Student = require('../models/Student');
const Career = require('../models/Career');

async function main() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/unischeduler');

  const career = await Career.findOne({ code: 'ISI' });

  // Link luis.ramirez@uni.edu to a student
  const luis = await User.findOne({ email: 'luis.ramirez@uni.edu' });
  if (luis) {
    let s = await Student.findOne({ userId: luis._id });
    if (!s) {
      s = await Student.findOne({ career: career._id, userId: { $exists: false } }).sort({ currentSemester: 1 });
      if (s) {
        s.userId = luis._id;
        await s.save();
        console.log(`✅ luis.ramirez@uni.edu vinculado a: ${s.name} (${s.studentCode})`);
      }
    } else {
      console.log(`👤 luis.ramirez ya vinculado a: ${s.name}`);
    }
  }

  // Link estudiante.isi@uni.edu to a mid-semester student
  const estIsi = await User.findOne({ email: 'estudiante.isi@uni.edu' });
  if (estIsi) {
    let s = await Student.findOne({ userId: estIsi._id });
    if (!s) {
      s = await Student.findOne({ career: career._id, currentSemester: 5, userId: { $exists: false } });
      if (s) {
        s.userId = estIsi._id;
        await s.save();
        console.log(`✅ estudiante.isi@uni.edu vinculado a: ${s.name} (${s.studentCode}) semestre ${s.currentSemester}`);
      }
    } else {
      console.log(`👤 estudiante.isi ya vinculado a: ${s.name}`);
    }
  }

  // Link jorge.lopez@uni.edu (already linked, just verify)
  const jorge = await User.findOne({ email: 'jorge.lopez@uni.edu' });
  if (jorge) {
    const s = await Student.findOne({ userId: jorge._id });
    if (s) console.log(`👤 jorge.lopez ya vinculado a: ${s.name} (${s.studentCode})`);
  }

  // Summary
  const vinculados = await Student.countDocuments({ userId: { $exists: true, $ne: null } });
  console.log(`\n📊 Total estudiantes con login: ${vinculados} de 150`);

  console.log('\n📋 Cuentas estudiantes:');
  const users = await User.find({ role: 'estudiante' }).lean();
  for (const u of users) {
    const s = await Student.findOne({ userId: u._id }).lean();
    console.log(`   ${u.email} / estudiante123  → ${s ? s.name + ' (' + s.studentCode + ') sem ' + s.currentSemester : '⚠️  SIN ESTUDIANTE VINCULADO'}`);
  }

  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
