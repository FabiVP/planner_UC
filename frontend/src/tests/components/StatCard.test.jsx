import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { HiOutlineAcademicCap } from 'react-icons/hi';
import StatCard from '../../components/ui/StatCard';

describe('StatCard', () => {
  it('Debe renderizar título, valor y label', () => {
    render(<StatCard icon={HiOutlineAcademicCap} iconBg="#3b82f6" title="Asignaturas" value="10" label="activas" />);
    expect(screen.getByText('Asignaturas')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('activas')).toBeInTheDocument();
  });

  it('Debe renderizar sin título', () => {
    render(<StatCard icon={HiOutlineAcademicCap} iconBg="#3b82f6" value="5" label="docentes" />);
    expect(screen.queryByText('Título')).not.toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('docentes')).toBeInTheDocument();
  });

  it('Debe renderizar subtítulo cuando se proporciona', () => {
    render(<StatCard icon={HiOutlineAcademicCap} iconBg="#3b82f6" value="8" label="aulas" subtitle="2 en mantenimiento" />);
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('2 en mantenimiento')).toBeInTheDocument();
  });

  it('Debe aplicar color personalizado al label', () => {
    render(<StatCard icon={HiOutlineAcademicCap} iconBg="#10b981" value="3" label="generaciones" color="#10b981" />);
    const label = screen.getByText('generaciones');
    expect(label).toBeInTheDocument();
    expect(label).toHaveStyle({ color: '#10b981' });
  });

  it('Debe renderizar el icono correctamente', () => {
    const { container } = render(<StatCard icon={HiOutlineAcademicCap} iconBg="#3b82f6" value="1" label="test" />);
    const iconDiv = container.querySelector('.stat-card-icon');
    expect(iconDiv).toBeInTheDocument();
    expect(iconDiv).toHaveStyle({ background: '#3b82f6' });
  });

  it('Debe renderizar con value en null o undefined sin errores', () => {
    render(<StatCard icon={HiOutlineAcademicCap} iconBg="#3b82f6" value={null} label="test" />);
    expect(screen.getByText('test')).toBeInTheDocument();
  });
});
