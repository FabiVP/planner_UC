const Notification = require('../models/Notification');

// GET /api/notifications — Listar notificaciones del usuario
exports.getAll = async (req, res, next) => {
  try {
    const { category, read } = req.query;
    const filter = { userId: req.user._id };
    
    if (category && category !== 'todas') filter.category = category;
    if (read !== undefined) filter.read = read === 'true';

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({ userId: req.user._id, read: false });

    res.json({ 
      count: notifications.length, 
      unreadCount,
      notifications 
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/notifications/:id/read — Marcar como leída
exports.markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notificación no encontrada.' });
    }

    res.json(notification);
  } catch (error) {
    next(error);
  }
};

// PUT /api/notifications/read-all — Marcar todas como leídas
exports.markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { userId: req.user._id, read: false },
      { read: true }
    );
    res.json({ message: 'Todas las notificaciones marcadas como leídas.' });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/notifications/:id — Eliminar notificación
exports.deleteOne = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    if (!notification) {
      return res.status(404).json({ message: 'Notificación no encontrada.' });
    }
    res.json({ message: 'Notificación eliminada.' });
  } catch (error) {
    next(error);
  }
};

/**
 * Helper: Create a notification for a user
 */
exports.createNotification = async (userId, { title, message, type, category, relatedEntity }) => {
  try {
    return await Notification.create({
      userId,
      title,
      message,
      type: type || 'sistema',
      category: category || 'info',
      relatedEntity
    });
  } catch (error) {
    console.error('Error creating notification:', error.message);
    // Re-throw so callers can react to failures instead of assuming success
    throw error;
  }
};
