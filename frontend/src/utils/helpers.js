/**
 * Helper/utility functions for UniScheduler frontend.
 */

/**
 * Format a date to a locale-friendly string in Spanish (Peru).
 * @param {string|Date} date 
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string}
 */
export function formatDate(date, options = {}) {
  if (!date) return '—';
  const defaults = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return new Date(date).toLocaleDateString('es-PE', { ...defaults, ...options });
}

/**
 * Format a date with time.
 * @param {string|Date} date 
 * @returns {string}
 */
export function formatDateTime(date) {
  if (!date) return '—';
  return new Date(date).toLocaleString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Capitalize the first letter of a string.
 * @param {string} str 
 * @returns {string}
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Truncate a string to a max length with ellipsis.
 * @param {string} str 
 * @param {number} maxLen 
 * @returns {string}
 */
export function truncate(str, maxLen = 30) {
  if (!str || str.length <= maxLen) return str || '';
  return str.slice(0, maxLen) + '…';
}

/**
 * Get badge class based on generation status.
 * @param {string} status 
 * @returns {string}
 */
export function getStatusBadge(status) {
  switch (status) {
    case 'completada': return 'success';
    case 'ejecutando': return 'info';
    case 'pendiente': return 'info';
    case 'fallida': return 'warning';
    default: return 'info';
  }
}

/**
 * Get human-readable status label.
 * @param {string} status 
 * @returns {string}
 */
export function getStatusLabel(status) {
  const labels = {
    completada: 'Óptimo',
    ejecutando: 'En ejecución',
    pendiente: 'Programada',
    fallida: 'Con advertencias',
  };
  return labels[status] || capitalize(status);
}

/**
 * Map a day key to its display name.
 * @param {string} dayKey 
 * @returns {string}
 */
export function dayDisplayName(dayKey) {
  const map = {
    lunes: 'Lunes',
    martes: 'Martes',
    miercoles: 'Miércoles',
    jueves: 'Jueves',
    viernes: 'Viernes',
    sabado: 'Sábado',
  };
  return map[dayKey] || capitalize(dayKey);
}

/**
 * Format course type for display.
 * @param {string} type 
 * @returns {string}
 */
export function formatCourseType(type) {
  return type === 'laboratorio' ? 'Laboratorio' : 'Teórico';
}

/**
 * Generate a color from an index (for schedule cells).
 * @param {number} index 
 * @param {string[]} palette 
 * @returns {string}
 */
export function getColorByIndex(index, palette) {
  return palette[index % palette.length];
}
