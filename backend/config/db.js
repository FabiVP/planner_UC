const mongoose = require('mongoose');

/**
 * Conectar a MongoDB.
 * 
 * Estrategia de conexión:
 * 1. Si MONGODB_URI apunta a un servidor real (local o Atlas), se conecta directamente.
 * 2. Si la conexión falla (MongoDB no instalado), levanta automáticamente
 *    mongodb-memory-server como base de datos en memoria para desarrollo.
 * 
 * Esto permite que la app funcione sin instalar MongoDB externamente.
 */

let mongoServer = null; // Referencia al servidor en memoria (si se usa)

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/unischeduler';

  try {
    // Intentar conexión al servidor configurado
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // Timeout rápido para detectar si MongoDB no está disponible
    });
    console.log(`📦 MongoDB Connected: ${mongoose.connection.host}`);
    console.log(`🗄️  Database: ${mongoose.connection.name}`);
    return;
  } catch (error) {
    console.warn(`⚠️  No se pudo conectar a MongoDB externo: ${error.message}`);
    console.log('🔄 Iniciando MongoDB en memoria (mongodb-memory-server)...');
  }

  // Fallback: levantar servidor MongoDB en memoria
  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    mongoServer = await MongoMemoryServer.create({
      instance: {
        dbName: 'unischeduler',
      },
    });

    const memoryUri = mongoServer.getUri();
    await mongoose.connect(memoryUri);

    console.log(`📦 MongoDB In-Memory Connected: ${mongoose.connection.host}`);
    console.log(`🗄️  Database: ${mongoose.connection.name}`);
    console.log('');
    console.log('╔══════════════════════════════════════════════════════════════╗');
    console.log('║  ⚠️  MODO DESARROLLO: Base de datos en memoria              ║');
    console.log('║  Los datos se perderán al reiniciar el servidor.            ║');
    console.log('║                                                              ║');
    console.log('║  Para datos persistentes, configura MONGODB_URI en .env:    ║');
    console.log('║  • Local:  mongodb://localhost:27017/unischeduler           ║');
    console.log('║  • Atlas:  mongodb+srv://user:pass@cluster.mongodb.net/db   ║');
    console.log('╚══════════════════════════════════════════════════════════════╝');
    console.log('');
  } catch (memError) {
    console.error('❌ Error fatal: No se pudo iniciar la base de datos.');
    console.error('   Opciones para resolver:');
    console.error('   1. Instalar MongoDB Community: https://www.mongodb.com/try/download/community');
    console.error('   2. Usar MongoDB Atlas (gratis): https://www.mongodb.com/atlas');
    console.error(`   Error: ${memError.message}`);
    process.exit(1);
  }
};

// Eventos de conexión para monitoreo
mongoose.connection.on('connected', () => {
  console.log('✅ Mongoose: conexión establecida');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose: error de conexión:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 Mongoose: conexión desconectada');
});

// Cleanup al cerrar la aplicación
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  if (mongoServer) {
    await mongoServer.stop();
    console.log('🛑 MongoDB Memory Server detenido');
  }
  console.log('👋 Conexión a MongoDB cerrada por terminación de la app');
  process.exit(0);
});

module.exports = connectDB;
