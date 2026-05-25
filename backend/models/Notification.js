const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'El título es obligatorio'],
    trim: true
  },
  message: {
    type: String,
    required: [true, 'El mensaje es obligatorio'],
    trim: true
  },
  type: {
    type: String,
    enum: ['horario', 'cupo', 'conflicto', 'actualizacion', 'restriccion', 'sistema'],
    default: 'sistema'
  },
  category: {
    type: String,
    enum: ['aviso', 'alerta', 'info'],
    default: 'info'
  },
  read: {
    type: Boolean,
    default: false
  },
  relatedEntity: {
    entityType: String,  // 'generation', 'schedule', 'course', etc.
    entityId: mongoose.Schema.Types.ObjectId
  },
  // Tiempo relativo para display ("Hace 1 día", etc.)
  expiresAt: Date
}, {
  timestamps: true
});

notificationSchema.index({ userId: 1, read: 1 });
notificationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
