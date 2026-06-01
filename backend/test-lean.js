const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Course = require('./models/Course');

async function run() {
  try {
    console.log('Conectando a MongoDB...');
    await connectDB();

    console.log('\n=== Prueba de rendimiento .lean() ===\n');

    console.time('sin-lean');
    const docs = await Course.find({}).limit(100);
    console.timeEnd('sin-lean');

    console.time('con-lean');
    const plans = await Course.find({}).limit(100).lean();
    console.timeEnd('con-lean');

    console.log('\nResultados:');
    console.log(`Documentos sin lean: ${docs.length}`);
    console.log(`Documentos con lean: ${plans.length}`);

    await mongoose.disconnect();
    process.exit(0);

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

run();