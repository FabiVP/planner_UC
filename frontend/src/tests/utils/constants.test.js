import React from 'react';
import { describe, it, expect } from 'vitest';
import {
  DAYS,
  DAYS_DISPLAY,
  TIME_SLOTS,
  ROLES,
  COURSE_TYPES,
  GENERATION_STATUS,
  SCHEDULE_COLORS,
  CONSTRAINTS,
} from '../../utils/constants';

describe('constants', () => {
  describe('DAYS', () => {
    it('Debe contener 6 días', () => {
      expect(DAYS).toHaveLength(6);
    });

    it('Debe incluir lunes a sábado', () => {
      expect(DAYS).toContain('lunes');
      expect(DAYS).toContain('sabado');
    });
  });

  describe('DAYS_DISPLAY', () => {
    it('Debe contener nombres en español con acentos', () => {
      expect(DAYS_DISPLAY).toContain('Miércoles');
      expect(DAYS_DISPLAY).toContain('Sábado');
    });
  });

  describe('TIME_SLOTS', () => {
    it('Debe contener 6 slots', () => {
      expect(TIME_SLOTS).toHaveLength(6);
    });

    it('Cada slot debe tener start, end, label', () => {
      TIME_SLOTS.forEach(slot => {
        expect(slot).toHaveProperty('start');
        expect(slot).toHaveProperty('end');
        expect(slot).toHaveProperty('label');
      });
    });

    it('Debe empezar a las 08:00', () => {
      expect(TIME_SLOTS[0].start).toBe('08:00');
    });
  });

  describe('ROLES', () => {
    it('Debe tener los tres roles', () => {
      expect(ROLES.COORDINADOR).toBe('coordinador');
      expect(ROLES.DOCENTE).toBe('docente');
      expect(ROLES.ESTUDIANTE).toBe('estudiante');
    });
  });

  describe('GENERATION_STATUS', () => {
    it('Debe tener los cuatro estados', () => {
      expect(GENERATION_STATUS.PROGRAMADA).toBe('programada');
      expect(GENERATION_STATUS.EJECUTANDO).toBe('ejecutando');
      expect(GENERATION_STATUS.COMPLETADA).toBe('completada');
      expect(GENERATION_STATUS.FALLIDA).toBe('fallida');
    });
  });

  describe('SCHEDULE_COLORS', () => {
    it('Debe contener 8 colores', () => {
      expect(SCHEDULE_COLORS).toHaveLength(8);
    });
  });

  describe('CONSTRAINTS', () => {
    it('Debe contener 14 restricciones', () => {
      expect(CONSTRAINTS).toHaveLength(14);
    });

    it('Debe incluir RD-01 a RD-14', () => {
      const ids = CONSTRAINTS.map(c => c.id);
      expect(ids[0]).toBe('RD-01');
      expect(ids[13]).toBe('RD-14');
    });

    it('Cada restricción debe tener id, label, active', () => {
      CONSTRAINTS.forEach(c => {
        expect(c).toHaveProperty('id');
        expect(c).toHaveProperty('label');
        expect(c).toHaveProperty('active');
        expect(c.active).toBe(true);
      });
    });
  });
});
