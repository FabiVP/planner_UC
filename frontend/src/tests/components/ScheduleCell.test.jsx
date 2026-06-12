import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ScheduleCell from '../../components/schedule/ScheduleCell';

describe('ScheduleCell', () => {
  it('Debe renderizar celda vacía cuando no hay assignment', () => {
    const { container } = render(<ScheduleCell assignment={null} />);
    const cell = container.querySelector('.schedule-cell');
    expect(cell).toBeInTheDocument();
    expect(cell.classList.contains('empty-cell')).toBe(true);
  });

  it('Debe renderizar celda con contenido cuando hay assignment', () => {
    const assignment = { courseName: 'Matemáticas', classroomName: 'A101' };
    const { container } = render(<ScheduleCell assignment={assignment} />);
    const cell = container.querySelector('.schedule-cell');
    expect(cell.classList.contains('has-content')).toBe(true);
    expect(screen.getByText('Matemáticas')).toBeInTheDocument();
    expect(screen.getByText('A101')).toBeInTheDocument();
  });

  it('Debe mostrar nombre del curso por defecto si no se proporciona', () => {
    const assignment = { classroomName: 'A101' };
    render(<ScheduleCell assignment={assignment} />);
    expect(screen.getByText('Curso')).toBeInTheDocument();
  });

  it('Debe llamar onClick al hacer clic', () => {
    const onClick = vi.fn();
    const assignment = { courseName: 'Física' };
    render(<ScheduleCell assignment={assignment} onClick={onClick} />);
    const cell = screen.getByText('Física').closest('.schedule-cell');
    fireEvent.click(cell);
    expect(onClick).toHaveBeenCalledWith(assignment);
  });

  it('Debe llamar onClick con Enter', () => {
    const onClick = vi.fn();
    const assignment = { courseName: 'Química' };
    render(<ScheduleCell assignment={assignment} onClick={onClick} />);
    const cell = screen.getByText('Química').closest('.schedule-cell');
    fireEvent.keyDown(cell, { key: 'Enter' });
    expect(onClick).toHaveBeenCalledWith(assignment);
  });

  it('Debe manejar onClick undefined sin errores', () => {
    const assignment = { courseName: 'Historia' };
    render(<ScheduleCell assignment={assignment} />);
    const cell = screen.getByText('Historia').closest('.schedule-cell');
    expect(() => fireEvent.click(cell)).not.toThrow();
  });

  it('Debe aplicar color personalizado', () => {
    const assignment = { courseName: 'Arte', color: '#ff0000' };
    const { container } = render(<ScheduleCell assignment={assignment} />);
    const course = screen.getByText('Arte');
    expect(course).toHaveStyle({ color: '#ff0000' });
  });
});
