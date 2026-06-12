import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ScheduleGrid from '../../components/schedule/ScheduleGrid';

describe('ScheduleGrid', () => {
  const assignments = [
    { day: 'lunes', startTime: '08:00', endTime: '09:00', course: 'Matemática', teacher: 'Dr. Pérez', classroom: 'A101', color: '#4f46e5' },
  ];

  it('Debe renderizar grid con días y horas', () => {
    render(<ScheduleGrid assignments={assignments} />);
    expect(screen.getByText('Lunes')).toBeInTheDocument();
  });

  it('Debe renderizar grid vacío cuando no hay asignaciones', () => {
    render(<ScheduleGrid assignments={[]} />);
    expect(screen.getByText('Lunes')).toBeInTheDocument();
    expect(screen.getByText('Hora')).toBeInTheDocument();
  });
});
