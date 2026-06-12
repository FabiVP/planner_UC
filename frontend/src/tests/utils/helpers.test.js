import React from 'react';
import { describe, it, expect } from 'vitest';
import {
  formatDate,
  formatDateTime,
  capitalize,
  truncate,
  getStatusBadge,
  getStatusLabel,
  dayDisplayName,
  formatCourseType,
  getColorByIndex,
} from '../../utils/helpers';

describe('helpers', () => {
  describe('formatDate', () => {
    it('Debe formatear una fecha correctamente', () => {
      const result = formatDate(new Date('2026-06-11T12:00:00Z'));
      expect(result).toBe('11/06/2026');
    });

    it('Debe retornar — para fecha nula', () => {
      expect(formatDate(null)).toBe('—');
    });

    it('Debe retornar — para fecha undefined', () => {
      expect(formatDate(undefined)).toBe('—');
    });

    it('Debe aceptar string ISO', () => {
      const result = formatDate('2026-06-11T10:00:00Z');
      expect(result).toBe('11/06/2026');
    });
  });

  describe('formatDateTime', () => {
    it('Debe formatear fecha y hora', () => {
      const result = formatDateTime(new Date('2026-06-11T10:30:00'));
      expect(result).toContain('11/06/2026');
    });

    it('Debe retornar — para fecha nula', () => {
      expect(formatDateTime(null)).toBe('—');
    });
  });

  describe('capitalize', () => {
    it('Debe capitalizar primera letra', () => {
      expect(capitalize('hola')).toBe('Hola');
    });

    it('Debe retornar string vacío para null', () => {
      expect(capitalize(null)).toBe('');
    });

    it('Debe retornar string vacío para undefined', () => {
      expect(capitalize(undefined)).toBe('');
    });

    it('Debe manejar string vacío', () => {
      expect(capitalize('')).toBe('');
    });

    it('Debe manejar una sola letra', () => {
      expect(capitalize('a')).toBe('A');
    });
  });

  describe('truncate', () => {
    it('Debe truncar strings largos con ellipsis', () => {
      expect(truncate('Hola Mundo Cruel', 10)).toBe('Hola Mundo…');
    });

    it('Debe retornar string completo si es más corto que maxLen', () => {
      expect(truncate('Hola', 10)).toBe('Hola');
    });

    it('Debe retornar string vacío para null', () => {
      expect(truncate(null)).toBe('');
    });
  });

  describe('getStatusBadge', () => {
    it('Debe retornar success para completada', () => {
      expect(getStatusBadge('completada')).toBe('success');
    });

    it('Debe retornar info para ejecutando', () => {
      expect(getStatusBadge('ejecutando')).toBe('info');
    });

    it('Debe retornar warning para fallida', () => {
      expect(getStatusBadge('fallida')).toBe('warning');
    });

    it('Debe retornar info para estado desconocido', () => {
      expect(getStatusBadge('desconocido')).toBe('info');
    });
  });

  describe('getStatusLabel', () => {
    it('Debe retornar label en español', () => {
      expect(getStatusLabel('completada')).toBe('Óptimo');
      expect(getStatusLabel('ejecutando')).toBe('En ejecución');
      expect(getStatusLabel('pendiente')).toBe('Programada');
      expect(getStatusLabel('fallida')).toBe('Con advertencias');
    });
  });

  describe('dayDisplayName', () => {
    it('Debe retornar nombre del día en español', () => {
      expect(dayDisplayName('lunes')).toBe('Lunes');
      expect(dayDisplayName('miercoles')).toBe('Miércoles');
      expect(dayDisplayName('sabado')).toBe('Sábado');
    });

    it('Debe capitalizar día desconocido', () => {
      expect(dayDisplayName('unknown')).toBe('Unknown');
    });
  });

  describe('formatCourseType', () => {
    it('Debe retornar Laboratorio', () => {
      expect(formatCourseType('laboratorio')).toBe('Laboratorio');
    });

    it('Debe retornar Teórico', () => {
      expect(formatCourseType('teorico')).toBe('Teórico');
    });
  });

  describe('getColorByIndex', () => {
    it('Debe retornar color según índice', () => {
      const palette = ['red', 'green', 'blue'];
      expect(getColorByIndex(0, palette)).toBe('red');
      expect(getColorByIndex(1, palette)).toBe('green');
      expect(getColorByIndex(3, palette)).toBe('red');
    });
  });
});
